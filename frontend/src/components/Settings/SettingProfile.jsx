import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FiCamera, FiUser } from "react-icons/fi";
import api from "../../api";

const fetchProfile = () => api.get("/api/users/profile").then((r) => r.data);

/* sends multipart/form-data — supports optional profileImage file */
const saveProfile = (payload, file) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  if (file) fd.append("profileImage", file);
  return api
    .put("/api/users/profile", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

const changePassword = (current, next) =>
  api
    .put("/api/users/change-password", { current, next })
    .then((r) => r.data);

export default function SettingProfile() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    whatAppNumber: "",
    location: "",
    userType: "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchProfile()
      .then((u) => {
        setMe(u);
        setForm((f) => ({
          ...f,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          email: u.email ?? "",
          jobTitle: u.jobTitle ?? "",
          whatAppNumber: u.whatAppNumber ?? "",
          location: u.location ?? "",
          userType: u.userType ?? "Customer",
        }));
        setImagePreview(u.profileImage || "");
      })
      .catch(() => toast.error("Unable to load profile"));
  }, []);

  if (!me) return <p className="text-sm text-gray-500 px-4 py-6">Loading…</p>;

  const change = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      whatAppNumber: form.whatAppNumber.trim(),
      location: form.location.trim(),
    };
    if (me?.userType === "Admin") payload.userType = form.userType;

    try {
      const updated = await saveProfile(payload, imageFile);
      setMe(updated);
      setImageFile(null);
      if (updated.profileImage) setImagePreview(updated.profileImage);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (!pw.current || !pw.next) return toast.error("Fill in all fields");
    if (pw.next !== pw.confirm)
      return toast.error("New passwords don't match");
    if (!/^(?=.*\d).{6,}$/.test(pw.next))
      return toast.error("Password must be ≥ 6 chars and contain a digit");
    setSavingPw(true);
    try {
      await changePassword(pw.current, pw.next);
      toast.success("Password changed");
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={submit} className="space-y-10">
        {/* Avatar + identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 ring-2 ring-orange-200 grid place-items-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="text-gray-400 text-4xl" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-orange-500 p-2 text-white shadow hover:bg-orange-600"
              aria-label="Change photo"
            >
              <FiCamera />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {form.firstName} {form.lastName}
            </h2>
            <p className="text-sm text-gray-500">{form.email}</p>
            <p className="text-xs text-gray-400 mt-1">{form.userType}</p>
          </div>
        </div>

        <SectionHeader
          title="Business Information"
          desc="Edit general information about your business"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Business Name"
            defaultValue="Algomian Technologies"
            readOnly
          />
          <Select
            label="Business Industry"
            disabled
            defaultValue="Laptops & Electronics"
            options={["Laptops & Electronics", "Fashion", "Groceries"]}
          />
          <Input
            label="Business Email"
            type="email"
            defaultValue="algomiantechnologies@gmail.com"
            readOnly
          />
          <Input
            label="Business Phone"
            type="tel"
            defaultValue="+2348123435668"
            readOnly
          />
        </div>

        <SectionHeader
          className="pt-4"
          title="Personal Information"
          desc="Update your name, contact and location."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First name"
            value={form.firstName}
            onChange={change("firstName")}
          />
          <Input
            label="Last name"
            value={form.lastName}
            onChange={change("lastName")}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={change("email")}
          />
          <Input
            label="WhatsApp number"
            type="tel"
            value={form.whatAppNumber}
            onChange={change("whatAppNumber")}
          />
          <Input
            label="Job description"
            value={form.jobTitle}
            onChange={change("jobTitle")}
          />
          <Input
            label="Location"
            value={form.location}
            onChange={change("location")}
          />

          {me?.userType === "Admin" && (
            <Select
              label="User Type"
              value={form.userType}
              onChange={change("userType")}
              options={[
                "Admin",
                "Manager",
                "SalesRep",
                "Customer",
                "Inventory",
                "Logistics",
              ]}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-orange-600 text-white px-6 py-3 hover:bg-orange-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <hr className="my-12" />

      <form onSubmit={submitPassword} className="space-y-6">
        <SectionHeader
          title="Change password"
          desc="Choose a strong password — at least 6 characters with one digit."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          <Input
            label="Current password"
            type="password"
            value={pw.current}
            onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
          />
          <Input
            label="New password"
            type="password"
            value={pw.next}
            onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
          />
          <Input
            label="Confirm new"
            type="password"
            value={pw.confirm}
            onChange={(e) =>
              setPw((p) => ({ ...p, confirm: e.target.value }))
            }
          />
        </div>
        <button
          type="submit"
          disabled={savingPw}
          className="rounded-md bg-gray-800 text-white px-6 py-3 hover:bg-gray-900 disabled:opacity-50"
        >
          {savingPw ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

/* ───────── helpers / atoms ───────── */
const SectionHeader = ({ title, desc, className = "" }) => (
  <header className={`space-y-1 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-500">{desc}</p>
  </header>
);

const Input = ({ label, className = "", ...rest }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...rest}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500 ${className}`}
    />
  </div>
);

const Select = ({ label, options = [], className = "", ...rest }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...rest}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500 ${className}`}
    >
      <option value="">— choose —</option>
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  </div>
);
