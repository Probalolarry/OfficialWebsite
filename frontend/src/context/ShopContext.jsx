import { createContext, useState, useEffect, useMemo } from "react";
import { products as placeholderProducts } from "../assets/assets";
import api from "../api";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₦";
  const delivery_Fee = 0;

  /* ───────── live storefront products from API ───────── */
  const [storefrontProducts, setStorefrontProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setProductsLoading(true);
        const { data } = await api.get("/api/products", {
          params: { showInStorefront: "true", limit: 100 },
        });
        if (cancelled) return;
        const list = Array.isArray(data?.products) ? data.products : [];
        setStorefrontProducts(list);
      } catch (err) {
        if (cancelled) return;
        setProductsError(err.message || "Failed to load products");
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* normalise API product shape so existing components keep working */
  const normalised = useMemo(
    () =>
      storefrontProducts.map((p) => ({
        ...p,
        _id: p._id,
        name: p.productName ?? p.name,
        price: p.sellingPrice ?? p.price,
        image: Array.isArray(p.images) && p.images.length ? p.images : p.image,
        description: p.description ?? "",
        rating: p.rating ?? 4,
        bestseller: p.bestseller ?? false,
        createdAt: p.createdAt,
      })),
    [storefrontProducts]
  );

  const hasStorefrontContent = normalised.length > 0;
  const products = hasStorefrontContent ? normalised : placeholderProducts;

  /* ───────── cart ───────── */
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const clearCart = () => setCartItems([]);

  const value = {
    products,
    storefrontProducts: normalised,
    hasStorefrontContent,
    productsLoading,
    productsError,
    currency,
    delivery_Fee,
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    cartCount,
    clearCart,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
