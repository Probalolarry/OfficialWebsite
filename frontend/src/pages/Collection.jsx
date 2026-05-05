import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import Footer from "../components/Footer";

const Collection = () => {
  const { products, hasStorefrontContent, productsLoading, productsError } =
    useContext(ShopContext);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const c = p.productCategory || p.category;
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const cat = p.productCategory || p.category || "";
      if (category && cat !== category) return false;
      if (!q) return true;
      const name = (p.name || p.productName || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      return name.includes(q) || brand.includes(q);
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    return list;
  }, [products, query, category, sort]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <div className="w-full max-w-[1500px] mx-auto px-4 py-10 flex-1">
        <div className="flex items-center justify-between mb-6">
          <Title text1="Shop" text2="Collection" />
        </div>

        {!hasStorefrontContent && !productsLoading && (
          <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing sample products — admins haven&apos;t added items to the
            storefront yet.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_180px] gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="rounded-md border px-4 py-2 text-sm bg-white"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm bg-white"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
          </select>
        </div>

        {productsLoading ? (
          <p className="py-16 text-center text-sm text-gray-500">
            Loading products…
          </p>
        ) : productsError ? (
          <p className="py-16 text-center text-sm text-red-600">
            Could not load products: {productsError}
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No products match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {filtered.map((item) => (
              <ProductItem key={item._id} {...item} id={item._id} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-auto bg-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Collection;
