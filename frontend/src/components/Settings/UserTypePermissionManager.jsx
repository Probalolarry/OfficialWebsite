import React, { useEffect, useState } from "react";
import api from "../../api";
import { ALL_PERMISSIONS } from "../../constants/permissions";

export default function UserTypePermissionManager({ userType, onBack }) {
  const [policy, setPolicy] = useState(null); // { userType, permissions[] }
  const [dirty, setDirty] = useState(new Set());
  const [saving, setSaving] = useState(false);

  /* pull current ticks */
  useEffect(() => {
    api
      .get(`/api/access/${userType}`, { withCredentials: true })
      .then((res) => {
        setPolicy(res.data);
        setDirty(new Set(res.data.permissions));
      });
  }, [userType]);

  const toggle = (p) =>
    setDirty((s) => {
      const nxt = new Set(s);
      nxt.has(p) ? nxt.delete(p) : nxt.add(p);
      return nxt;
    });

  const save = async () => {
    setSaving(true);
    await api.put(
      `/api/access/${userType}`,
      { permissions: [...dirty] },
      { withCredentials: true }
    );

    // refresh *current session’s* JWT to pick up the new policy
    await api.post(
      "/api/users/refresh-permissions",
      {},
      { withCredentials: true }
    );

    setSaving(false);
    alert("Saved!");
    onBack();
  };

  if (!policy) return <p className="p-4">Loading…</p>;

  const isAdminRole = userType === "Admin";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Permissions – {userType}</h2>
        <button onClick={onBack} className="text-sm text-orange-600">
          ← Back
        </button>
      </div>

      {isAdminRole && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Admins always have full access.</strong> The permissions
          below are stored for record-keeping, but Admin accounts bypass
          permission checks on the server. You cannot lock yourself out by
          editing this list.
        </div>
      )}

      <ul className="space-y-2">
        {ALL_PERMISSIONS.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 text-orange-600"
              checked={isAdminRole ? true : dirty.has(p.id)}
              disabled={isAdminRole}
              onChange={() => toggle(p.id)}
            />
            <span className={isAdminRole ? "text-gray-500" : ""}>
              {p.label}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 rounded bg-orange-600 text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </section>
  );
}
