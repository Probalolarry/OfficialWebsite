import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Content = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[1100px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Info</h1>
        <p className="text-gray-700 mb-6">
          Looking for buying advice, support, or order info? Start here.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/collection"
            className="rounded-lg border bg-white p-5 hover:shadow transition"
          >
            <h3 className="font-semibold mb-1">Browse the shop</h3>
            <p className="text-sm text-gray-600">
              See everything we have in stock right now.
            </p>
          </Link>
          <Link
            to="/orders"
            className="rounded-lg border bg-white p-5 hover:shadow transition"
          >
            <h3 className="font-semibold mb-1">My orders</h3>
            <p className="text-sm text-gray-600">
              Track an order or download an invoice.
            </p>
          </Link>
          <Link
            to="/about"
            className="rounded-lg border bg-white p-5 hover:shadow transition"
          >
            <h3 className="font-semibold mb-1">About Algomian</h3>
            <p className="text-sm text-gray-600">Who we are and what we do.</p>
          </Link>
          <Link
            to="/blog"
            className="rounded-lg border bg-white p-5 hover:shadow transition"
          >
            <h3 className="font-semibold mb-1">Blog</h3>
            <p className="text-sm text-gray-600">
              Buying guides, reviews and announcements.
            </p>
          </Link>
        </div>
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Content;
