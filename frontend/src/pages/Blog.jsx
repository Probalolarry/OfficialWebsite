import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/blogs", { params: { limit: 24 } })
      .then((r) => setPosts(r.data?.blogs || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load blog posts")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">
          Buying guides, reviews, and announcements from Algomian.
        </p>

        {loading ? (
          <p className="text-sm text-gray-500 py-16 text-center">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600 py-16 text-center">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500 py-16 text-center">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p._id}
                to={`/blog/${p.slug}`}
                className="rounded-lg border bg-white overflow-hidden hover:shadow transition"
              >
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-orange-100 to-purple-100" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {p.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default BlogList;
