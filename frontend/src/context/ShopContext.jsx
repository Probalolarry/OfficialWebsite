import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { products as placeholderProducts } from "../assets/assets";
import api from "../api";

export const ShopContext = createContext();

const isLoggedIn = () => !!localStorage.getItem("algomian:token");

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
        brand: p.brand ?? "",
        processor: p.baseSpecs?.[0]?.baseCPU ?? p.processor ?? "",
        ram: p.baseSpecs?.[0]?.baseRam ?? p.ram ?? "",
        storage: p.baseSpecs?.[0]?.baseStorage ?? p.storage ?? "",
        productCategory: p.productCategory ?? p.category ?? "",
        graphicsCard: p.graphicsCard ?? "",
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

  /* ───────── wishlist ─────────
     Stored as an array of product IDs.
     - Always mirrored to localStorage (for guests).
     - When logged in, fetched from + synced to /api/users/wishlist.        */
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("algomian:wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("algomian:wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch from server when token is present (initial load + login event).
  useEffect(() => {
    const sync = async () => {
      if (!isLoggedIn()) return;
      try {
        const { data } = await api.get("/api/users/wishlist");
        const serverIds = Array.isArray(data) ? data.map((p) => p._id) : [];
        setWishlist(serverIds);
      } catch {
        /* swallow — server may be down or token expired */
      }
    };
    sync();
    window.addEventListener("algomian-login", sync);
    window.addEventListener("algomian-logout", () => setWishlist([]));
    return () => {
      window.removeEventListener("algomian-login", sync);
    };
  }, []);

  const isInWishlist = useCallback(
    (id) => wishlist.includes(id),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      const has = wishlist.includes(productId);
      setWishlist((prev) =>
        has ? prev.filter((x) => x !== productId) : [...prev, productId]
      );
      if (isLoggedIn()) {
        try {
          if (has) {
            await api.delete(`/api/users/wishlist/${productId}`);
          } else {
            await api.post("/api/users/wishlist", { productId });
          }
        } catch {
          /* best-effort; local state already updated */
        }
      }
    },
    [wishlist]
  );

  const wishlistCount = wishlist.length;

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
    wishlist,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
