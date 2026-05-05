import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api";

import InventNav from "../components/InventNav";
import InventSideBar from "../components/InventSideBar";

const COLLAPSED_KEY = "algomian:sidebar-collapsed";

export default function InventoryLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_KEY) === "true"
  );
  const [lastSeenSaleISO, setLastSeenSaleISO] = useState(
    localStorage.getItem("lastSalesPing") || null
  );

  const handlePing = (iso) => {
    localStorage.setItem("lastSalesPing", iso);
    setLastSeenSaleISO(iso);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("algomian:token");
    window.dispatchEvent(new Event("algomian-logout"));
    navigate("/login");
  };

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const mainShift = collapsed ? "md:ml-[72px]" : "md:ml-[260px]";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InventSideBar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div
        className={`flex flex-1 flex-col transition-[margin] duration-300 ${mainShift}`}
      >
        <InventNav
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentUser={user}
          lastSeenSaleISO={lastSeenSaleISO}
          onSalesPing={handlePing}
        />

        <main className="flex flex-1 flex-col overflow-y-auto px-4 pt-20 sm:px-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
