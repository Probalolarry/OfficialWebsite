import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiCamera,
  FiUser,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiLock,
} from "react-icons/fi";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const fetchProfile = () => api.get("/api/users/profile").then((r) => r.data);

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

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user: authUser, loading: authLoading } = useAuth();

  const [me, setMe] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    whatAppNumber: "",
    location: "",
    jobTitle: "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, authUser, navigate]);

  useEffect(() => {
    fetchProfile()
      .then((u) => {
        setMe(u);
        setForm({
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          email: u.email ?? "",
          whatAppNumber: u.whatAppNumber ?? "",
          location: u.location ?? "",
          jobTitle: u.jobTitle ?? "",
        });
        setImagePreview(u.profileImage || "");
      })
      .catch(() => toast.error("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

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
      whatAppNumber: form.whatAppNumber.trim(),
      location: form.location.trim(),
      jobTitle: form.jobTitle.trim(),
    };
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
      return toast.error("Password must be at least 6 chars and contain a digit");
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

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#fafafa]">
        <p className="text-sm text-gray-500">Loading your account…</p>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My account
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Manage your personal info, password and account preferences.
        </p>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Side menu (desktop) / top tile (mobile) */}
          <aside className="space-y-2">
            <Link
              to="/orders"
              className="flex items-center gap-3 rounded-md bg-white border px-4 py-3 hover:bg-gray-50"
            >
              <FiPackage className="text-orange-500" /> My Orders
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 rounded-md bg-white border px-4 py-3 hover:bg-gray-50"
            >
              <FiHeart className="text-orange-500" /> Wishlist
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 hover:bg-red-100"
            >
              <FiLogOut /> Log out
            </button>
          </aside>

          <div className="space-y-10">
            {/* Personal Information */}
            <section className="rounded-xl bg-white border p-5 sm:p-8">
              <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    This is what we show on your orders and receipts.
                  </p>
                </div>
              </header>

              <form onSubmit={submit} className="space-y-6">
                {/* avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-orange-200 grid place-items-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-gray-400 text-3xl" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 rounded-full bg-orange-500 p-2 text-white shadow hover:bg-orange-600"
                      aria-label="Change photo"
                    >
                      <FiCamera className="text-sm" />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Profile photo</p>
                    <p className="text-xs text-gray-400">
                      JPG or PNG, up to 5 MB.
                    </p>
                    {imageFile && (
                      <p className="text-xs text-orange-600 mt-1">
                        New photo selected — click Save to upload.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    value={form.firstName}
                    onChange={change("firstName")}
                  />
                  <Field
                    label="Last name"
                    value={form.lastName}
                    onChange={change("lastName")}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={change("email")}
                  />
                  <Field
                    label="WhatsApp number"
                    type="tel"
                    value={form.whatAppNumber}
                    onChange={change("whatAppNumber")}
                  />
                  <Field
                    label="Location"
                    value={form.location}
                    onChange={change("location")}
                  />
                  <Field
                    label="Job title (optional)"
                    value={form.jobTitle}
                    onChange={change("jobTitle")}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-orange-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* Change password */}
            <section className="rounded-xl bg-white border p-5 sm:p-8">
              <header className="mb-6 flex items-center gap-3">
                <FiLock className="text-orange-500 text-lg" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Change password
                  </h2>
                  <p className="text-sm text-gray-500">
                    At least 6 characters and one digit.
                  </p>
                </div>
              </header>

              <form
                onSubmit={submitPassword}
                className="grid sm:grid-cols-3 gap-4"
              >
                <Field
                  label="Current password"
                  type="password"
                  value={pw.current}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, current: e.target.value }))
                  }
                />
                <Field
                  label="New password"
                  type="password"
                  value={pw.next}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, next: e.target.value }))
                  }
                />
                <Field
                  label="Confirm new"
                  type="password"
                  value={pw.confirm}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, confirm: e.target.value }))
                  }
                />

                <div className="sm:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingPw}
                    className="rounded-md bg-gray-800 text-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-900 disabled:opacity-60"
                  >
                    {savingPw ? "Updating…" : "Update password"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

const Field = ({ label, ...rest }) => (
  <label className="grid gap-1 text-sm">
    <span className="font-medium text-gray-700">{label}</span>
    <input
      {...rest}
      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
    />
  </label>
);

export default Profile;
