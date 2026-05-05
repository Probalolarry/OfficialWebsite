import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

const emptyForm = {
  title: "",
  excerpt: "",
  body: "",
  coverImage: "",
  tags: "",
  status: "draft",
};

const BlogEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/api/blogs/admin/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title || "",
          excerpt: data.excerpt || "",
          body: data.body || "",
          coverImage: data.coverImage || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          status: data.status || "draft",
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Could not load post");
        navigate("/inventory/blogs");
      })
      .finally(() => setLoading(false));
  }, [id, isNew, navigate]);

  const change = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt,
      body: form.body,
      coverImage: form.coverImage.trim(),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
    };
    try {
      if (isNew) {
        const { data } = await api.post("/api/blogs", payload);
        toast.success("Post created");
        navigate(`/inventory/blogs/${data._id}`);
      } else {
        await api.put(`/api/blogs/${id}`, payload);
        toast.success("Post saved");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="px-6 py-10 text-sm text-gray-500">Loading…</p>;
  }

  return (
    <form onSubmit={submit} className="px-4 sm:px-6 py-6 max-w-[900px] space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isNew ? "New Post" : "Edit Post"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/inventory/blogs")}
            className="rounded border border-gray-300 px-4 py-2 text-sm"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-orange-600"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-gray-700">Title</span>
        <input
          value={form.title}
          onChange={change("title")}
          className="rounded border px-3 py-2 text-base"
          placeholder="Why we recommend the Lenovo X1 for fieldwork"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-gray-700">Cover image URL</span>
        <input
          value={form.coverImage}
          onChange={change("coverImage")}
          className="rounded border px-3 py-2"
          placeholder="https://…/image.jpg"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-gray-700">Excerpt</span>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={change("excerpt")}
          className="rounded border px-3 py-2 resize-none"
          placeholder="One-sentence summary shown in the blog list."
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-gray-700">
          Body <span className="text-xs text-gray-500">(plain text or HTML)</span>
        </span>
        <textarea
          rows={14}
          value={form.body}
          onChange={change("body")}
          className="rounded border px-3 py-2 resize-y font-mono text-sm"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-gray-700">Tags (comma-separated)</span>
        <input
          value={form.tags}
          onChange={change("tags")}
          className="rounded border px-3 py-2"
          placeholder="laptops, buying-guide, lenovo"
        />
      </label>

      <label className="grid gap-1 text-sm w-48">
        <span className="font-medium text-gray-700">Status</span>
        <select
          value={form.status}
          onChange={change("status")}
          className="rounded border px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
    </form>
  );
};

export default BlogEditor;
