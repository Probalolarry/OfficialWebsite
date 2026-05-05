import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Footer from "../components/Footer";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/blogs/slug/${slug}`)
      .then((r) => setPost(r.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Post not found")
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[850px] mx-auto w-full px-4 py-10">
        <Link to="/blog" className="text-sm text-orange-500 hover:underline">
          ← All posts
        </Link>

        {loading ? (
          <p className="text-sm text-gray-500 py-16 text-center">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-600 py-16 text-center">{error}</p>
        ) : !post ? null : (
          <article className="mt-4">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 sm:h-80 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
              {post.author && (
                <span>
                  By {post.author.firstName} {post.author.lastName}
                </span>
              )}
              {post.publishedAt && (
                <>
                  <span>·</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
            {/* Body — supports plain text or basic HTML written by admin */}
            <div
              className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.body || "" }}
            />
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </article>
        )}
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default BlogDetail;
