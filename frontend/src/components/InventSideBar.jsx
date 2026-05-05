import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiTag,
  FiPackage,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiX,
  FiSave,
  FiRepeat,
  FiEdit3,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { BsClipboard } from "react-icons/bs";
import { assets } from "../assets/assets";
import { DEFAULT_PERMS_BY_TYPE } from "../utils/defaultPerms";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard", icon: <FiHome />, perm: null },
  { path: "/inventory", label: "Inventory", icon: <BsClipboard />, perm: "product.view" },
  { path: "/transfer", label: "Product Transfer", icon: <FiRepeat />, perm: "product.transfer" },
  { path: "/stock", label: "Stock Management", icon: <FiSave />, perm: "product.view" },
  { path: "/inventory/orders", label: "Orders", icon: <FiShoppingCart />, perm: "order.view" },
  { path: "/sales", label: "Sale Management", icon: <FiTag />, perm: "order.edit" },
  { path: "/inventoryManager", label: "Store Management", icon: <FiTag />, perm: "store.edit" },
  { path: "/logistics", label: "Logistics", icon: <FiPackage />, perm: "shipment.view" },
  { path: "/customers", label: "Customers", icon: <FiUsers />, perm: "order.view" },
  { path: "/inventory/blogs", label: "Blog Posts", icon: <FiEdit3 />, perm: null },
  { path: "/settings", label: "Settings", icon: <FiSettings />, perm: null },
];

export default function InventSideBar({
  isOpen,
  setIsOpen,
  user,
  onLogout,
  collapsed = false,
  onToggleCollapsed = () => {},
}) {
  const safeUser = user ?? {};
  const perms =
    safeUser.perms && safeUser.perms.length
      ? safeUser.perms
      : DEFAULT_PERMS_BY_TYPE[safeUser.userType] ?? [];

  const isAdmin = (safeUser.userType || "").toLowerCase() === "admin";
  const links = NAV_LINKS.filter(
    (l) => !l.perm || perms.includes(l.perm) || isAdmin
  );

  const widthCls = collapsed ? "md:w-[72px]" : "md:w-[260px]";

  return (
    <>
      {/* mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity ${
          isOpen ? "block md:hidden" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* sidebar — full-width on mobile drawer, collapsible on desktop */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-[260px] ${widthCls} flex-col
                    justify-between border-r bg-white transition-all
                    duration-300 md:translate-x-0 ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
      >
        {/* logo + close (mobile) + collapse (desktop) */}
        <div
          className={`flex items-center ${
            collapsed ? "md:justify-center" : "md:justify-between"
          } justify-between px-4 pt-6 pb-4`}
        >
          <Link
            to="/inventory"
            className={collapsed ? "md:hidden" : "block"}
          >
            <img src={assets.color_logo} alt="Logo" className="w-32" />
          </Link>
          {collapsed && (
            <Link to="/inventory" className="hidden md:block">
              <img src={assets.color_logo} alt="Logo" className="w-8" />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl text-gray-500 md:hidden"
            aria-label="Close menu"
          >
            <FiX />
          </button>
          <button
            onClick={onToggleCollapsed}
            className={`hidden md:inline-flex items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 ${
              collapsed ? "absolute right-2 top-7" : ""
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        </div>

        {/* navigation */}
        <nav
          className={`flex-1 space-y-1 ${
            collapsed ? "md:px-2" : "px-4"
          } overflow-y-auto`}
        >
          {links.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={() => setIsOpen(false)}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 ${
                  collapsed ? "md:justify-center md:px-2" : "px-4"
                } py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-100 text-orange-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span className={collapsed ? "md:hidden" : ""}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* user footer */}
        {user && (
          <div className="mt-auto border-t p-4">
            <div
              className={`flex items-center ${
                collapsed ? "md:justify-center" : "justify-between"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || "https://i.pravatar.cc/100"}
                  className="h-9 w-9 rounded-full object-cover"
                  alt=""
                />
                {!collapsed && (
                  <div className={collapsed ? "md:hidden" : ""}>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <FiLogOut
                  className="cursor-pointer text-xl text-gray-400 hover:text-gray-700"
                  onClick={onLogout}
                  title="Logout"
                />
              )}
            </div>
            {collapsed && (
              <button
                onClick={onLogout}
                className="hidden md:flex w-full justify-center mt-2 text-gray-400 hover:text-gray-700"
                title="Logout"
              >
                <FiLogOut className="text-xl" />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
