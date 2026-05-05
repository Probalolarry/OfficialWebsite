import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const BestSeller = () => {
  const { products, hasStorefrontContent, productsLoading } =
    useContext(ShopContext);

  const bestSeller = useMemo(() => {
    if (!hasStorefrontContent) {
      return products.filter((item) => item.bestseller).slice(0, 4);
    }
    // For real storefront products: prefer flagged bestsellers, otherwise
    // fall back to the first 4 (most recent) so the section never empties.
    const flagged = products.filter((p) => p.bestseller);
    return (flagged.length ? flagged : products).slice(0, 4);
  }, [products, hasStorefrontContent]);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-6">
        <Title text1="Best" text2="Sellers" />
        <Link
          to="/collection"
          className="text-sm sm:text-base text-orange-500 hover:underline flex items-center gap-1 font-medium"
        >
          More Products <FaArrowRight className="text-[10px] mt-[1px]" />
        </Link>
      </div>

      {productsLoading ? (
        <p className="text-sm text-gray-500 py-10 text-center">Loading…</p>
      ) : bestSeller.length === 0 ? (
        <p className="text-sm text-gray-500 py-10 text-center">
          No products yet — admins can mark items to show on the storefront.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              description={item.description}
              rating={item.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;
