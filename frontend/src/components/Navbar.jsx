import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiX,
  FiMenu,
  FiLogIn,
  FiLogOut,
  FiPackage,
  FiHome,
  FiGrid,
  FiBookOpen,
} from "react-icons/fi";

import { assets } from "../assets/assets";
import { useSearch } from "../context/SearchContext";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

import MyCart from "./MyCart";
import UserProfileView from "./UserProfileView";

export default function Navbar() {
  const navigate = useNavigate();
  const { setFilters } = useSearch();
  const { cartItems, wishlistCount } = useContext(ShopContext);
  const { user, logout, loading } = useAuth();

  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mSearch, setMSearch] = useState(false);

  const totalItems = cartItems.reduce((t, i) => t + i.quantity, 0);
  const allowInventory = !loading && user && user.userType !== "Customer";

  // Lock body scroll when drawer or cart is open (mobile UX)
  useEffect(() => {
    const open = drawer || showCart;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer, showCart]);

  const doSearch = () => {
    if (!search.trim()) return;
    setFilters((p) => ({ ...p, query: search }));
    navigate("/search");
    setMSearch(false);
    setDrawer(false);
  };

  const closeDrawer = () => setDrawer(false);

  const handleDrawerLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
    closeDrawer();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4">
        <Link to="/" className="shrink-0">
          <img src={assets.color_logo} alt="Algomian" className="w-28 sm:w-32" />
        </Link>

        <nav className="hidden lg:flex gap-6 text-sm font-medium text-gray-800">
          <NavLink to="/collection">Shop</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/orders">My Orders</NavLink>
          {!loading && allowInventory && (
            <NavLink to="/inventory">Inventory</NavLink>
          )}
        </nav>

        <div className="hidden md:flex flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="Search"
            className="w-full rounded-full border px-4 py-2 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4 text-gray-700">
          <button
            className="md:hidden"
            onClick={() => setMSearch(!mSearch)}
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5" />
          </button>

          <Link
            to="/wishlist"
            className="relative hidden sm:inline-flex"
            aria-label="Wishlist"
          >
            <FiHeart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-orange-500 text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setShowCart(true)}
            className="relative"
            aria-label="Cart"
          >
            <FiShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* profile */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() =>
                user ? setShowProfile((p) => !p) : navigate("/login")
              }
              className="block"
              aria-label="Account"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <FiUser className="h-6 w-6" />
              )}
            </button>
            {user && showProfile && (
              <div
                className="absolute right-0 top-9 z-50"
                onMouseLeave={() => setShowProfile(false)}
              >
                <UserProfileView
                  user={user}
                  onLogout={() => {
                    logout();
                    toast.success("Logged out");
                    navigate("/");
                  }}
                  onClose={() => setShowProfile(false)}
                />
              </div>
            )}
          </div>

          <button
            className="lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mSearch && (
        <div className="mt-3 md:hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="Search products…"
            className="w-full rounded-full border px-4 py-2 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* MOBILE DRAWER ----------------------------------------------------- */}
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm flex flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          drawer ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <Link to="/" onClick={closeDrawer} className="block">
            <img src={assets.color_logo} alt="Algomian" className="w-28" />
          </Link>
          <button
            onClick={closeDrawer}
            className="rounded p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* user identity */}
        {user ? (
          <Link
            to="/profile"
            onClick={closeDrawer}
            className="flex items-center gap-3 border-b px-4 py-4 hover:bg-gray-50"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-orange-600">
                <FiUser />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
            <span className="text-xs text-orange-600">Edit</span>
          </Link>
        ) : (
          <div className="flex gap-2 border-b px-4 py-4">
            <Link
              to="/login"
              onClick={closeDrawer}
              className="flex-1 rounded bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600"
            >
              <FiLogIn className="inline mr-2" />
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={closeDrawer}
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Sign up
            </Link>
          </div>
        )}

        {/* mobile search */}
        <div className="border-b px-4 py-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Search products…"
              className="w-full rounded-full border bg-gray-50 pl-9 pr-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <DrawerLink
            to="/"
            icon={<FiHome />}
            label="Home"
            onClick={closeDrawer}
          />
          <DrawerLink
            to="/collection"
            icon={<FiGrid />}
            label="Shop"
            onClick={closeDrawer}
          />
          <DrawerLink
            to="/blog"
            icon={<FiBookOpen />}
            label="Blog"
            onClick={closeDrawer}
          />
          {user && (
            <>
              <DrawerLink
                to="/orders"
                icon={<FiPackage />}
                label="My Orders"
                onClick={closeDrawer}
              />
              <DrawerLink
                to="/wishlist"
                icon={<FiHeart />}
                label="Wishlist"
                badge={wishlistCount || null}
                onClick={closeDrawer}
              />
              <DrawerLink
                to="/profile"
                icon={<FiUser />}
                label="Personal Information"
                onClick={closeDrawer}
              />
            </>
          )}
          {!loading && allowInventory && (
            <DrawerLink
              to="/inventory"
              icon={<FiGrid />}
              label="Inventory"
              onClick={closeDrawer}
            />
          )}
        </nav>

        {user && (
          <div className="border-t p-3">
            <button
              onClick={handleDrawerLogout}
              className="flex w-full items-center justify-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <FiLogOut /> Log out
            </button>
          </div>
        )}
      </aside>

      {/* CART PANEL -------------------------------------------------------- */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowCart(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-4 shadow-lg sm:max-w-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="rounded p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close cart"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <MyCart />
          </div>
        </>
      )}
    </header>
  );
}

function DrawerLink({ to, icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
            : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-orange-500 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}
