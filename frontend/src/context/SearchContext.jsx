import React, { createContext, useContext, useState, useMemo } from "react";
import { ShopContext } from "./ShopContext";

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const { products } = useContext(ShopContext);

  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    ram: [],
    storage: [],
    rating: [],
    graphics: [],
    price: 50_000_000, // generous default — real products can be millions of NGN
    query: "",
  });

  const filteredProducts = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();
    return products.filter((product) => {
      const {
        brand,
        processor,
        ram,
        storage,
        rating,
        graphics,
        price,
      } = filters;

      if (brand.length && !brand.includes(product.brand)) return false;
      if (processor.length && !processor.includes(product.processor))
        return false;
      if (ram.length && !ram.includes(product.ram)) return false;
      if (storage.length && !storage.includes(product.storage)) return false;
      if (rating.length && !rating.includes(product.rating)) return false;
      if (graphics.length && !graphics.includes(product.graphicsCard))
        return false;
      if (typeof product.price === "number" && product.price > price)
        return false;

      if (!q) return true;
      const haystack = [
        product.name,
        product.productName,
        product.brand,
        product.productCategory,
        product.processor,
        product.ram,
        product.storage,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, filters]);

  return (
    <SearchContext.Provider value={{ filters, setFilters, filteredProducts }}>
      {children}
    </SearchContext.Provider>
  );
};
