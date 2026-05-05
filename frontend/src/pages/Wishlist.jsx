import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import api from "../api";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const Wishlist = () => {
  const {
    wishlist,
    products,
    currency,
    addToCart,
    toggleWishlist,
    productsLoading,
  } = useContext(ShopContext);

  // For logged-in users, fetch full product objects from server (they include
  // products even if not currently flagged showInStorefront). For guests,
  // resolve from the products array we already have.
  const [serverItems, setServerItems] = useState(null);
  const [loading, setLoading] = useState(false);

  const loggedIn = !!localStorage.getItem("algomian:token");

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    api
      .get("/api/users/wishlist")
      .then((r) => setServerItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setServerItems([]))
      .finally(() => setLoading(false));
  }, [loggedIn, wishlist.length]);

  const items = useMemo(() => {
    if (loggedIn && serverItems) {
      return serverItems.map((p) => ({
        ...p,
        _id: p._id,
        name: p.productName ?? p.name,
        price: p.sellingPrice ?? p.price,
        image:
          Array.isArray(p.images) && p.images.length ? p.images : p.image,
      }));
    }
    return products.filter((p) => wishlist.includes(p._id));
  }, [loggedIn, serverItems, products, wishlist]);

  const handleRemove = (id) => {
    toggleWishlist(id);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <FaHeart className="text-2xl text-orange-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <span className="ml-2 text-sm text-gray-500">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {loading || productsLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 mb-4">
              You haven&apos;t saved anything yet.
            </p>
            <Link
              to="/collection"
              className="inline-block rounded bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => {
              const img = Array.isArray(item.image) ? item.image[0] : item.image;
              return (
                <div
                  key={item._id}
                  className="rounded-lg border bg-white overflow-hidden shadow-sm"
                >
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={img || "/fallback.png"}
                      alt={item.name}
                      className="h-44 w-full object-cover"
                    />
                  </Link>
                  <div className="p-3">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-gray-800 mt-2">
                      {currency} {(item.price || 0).toLocaleString()}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 rounded bg-[#5A4FCF] py-2 text-xs font-semibold text-white hover:bg-[#483dc2]"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => handleRemove(item._id)}
                        aria-label="Remove from wishlist"
                        className="rounded border border-gray-200 px-2 hover:bg-gray-50"
                      >
                        <FaTrash className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Wishlist;
