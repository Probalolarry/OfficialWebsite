import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductItem = ({ id, image, name, price, description, rating }) => {
  const { currency, addToCart, isInWishlist, toggleWishlist } =
    useContext(ShopContext);

  const imageSrc =
    typeof image?.[0] === "string"
      ? image[0]
      : image?.[0]?.default || image?.[0];

  const inWishlist = isInWishlist(id);

  const handleHeart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      to={`/product/${id}`}
      className="block rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-white transition hover:shadow-md"
    >
      {/* Image + Tag + Favorite */}
      <div className="relative overflow-hidden">
        <span className="absolute top-2 left-2 bg-white text-[10px] font-semibold text-gray-700 px-2 py-[2px] rounded shadow">
          NEW
        </span>
        <button
          type="button"
          onClick={handleHeart}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow cursor-pointer hover:scale-110 transition"
        >
          {inWishlist ? (
            <FaHeart className="text-orange-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-400 text-sm" />
          )}
        </button>
        <img
          src={imageSrc || "/fallback.png"}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Rating */}
        <div className="flex items-center text-xs text-gray-600 gap-1">
          <div className="flex text-orange-500">
            {Array.from({ length: 5 }).map((_, i) =>
              i < rating ? (
                <FaStar key={i} className="text-xs" />
              ) : (
                <FaRegStar key={i} className="text-xs" />
              )
            )}
          </div>
          <span>(91)</span>
        </div>

        <h3 className="mt-1 text-sm font-semibold text-gray-800">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        <p className="text-sm font-bold text-gray-800 mt-2">
          {currency} {price?.toLocaleString()}
        </p>
        <button
          className="mt-2 bg-[#5A4FCF] text-white text-xs font-semibold w-full py-2 rounded hover:bg-[#483dc2] transition"
          onClick={(e) => {
            e.preventDefault();
            addToCart({ id, image, name, price, description, rating, _id: id });
          }}
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
};

export default ProductItem;
