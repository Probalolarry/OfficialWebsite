import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import api from "../api";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/blogs", { params: { limit: 3 } })
      .then((r) => setPosts(r.data?.blogs || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Hide the section entirely if no posts have been published yet.
  if (!loading && posts.length === 0) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 my-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400">Latest posts</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222]">
            Read Our Blog
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Interviews, tips, guides, industry best practices, and news.
          </p>
        </div>
        <Link
          to="/blog"
          className="self-start bg-[#5A4FCF] text-white px-4 py-2 text-sm rounded hover:bg-[#483dc2] transition"
        >
          View all posts
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {(loading ? Array.from({ length: 3 }) : posts).map((post, idx) =>
          loading ? (
            <div
              key={idx}
              className="bg-white rounded-md shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            </div>
          ) : (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition flex flex-col"
            >
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-purple-100" />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 mb-1">
                  {post.author
                    ? `${post.author.firstName ?? ""} ${
                        post.author.lastName ?? ""
                      }`.trim()
                    : "Algomian Team"}
                  {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
                </p>
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-base text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <FaArrowRight className="mt-1 text-gray-400 text-xs shrink-0" />
                </div>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Blog;
