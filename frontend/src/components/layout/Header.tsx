"use client";

import { useAppStore } from "@/store";
import { Bell, Search, Sun, Moon, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { theme, toggleTheme, notifications, markNotificationRead } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#e5e7eb]">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="relative w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
          <input
            type="text"
            placeholder="Cari order, produk, atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd] transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-[#f5f5f5] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} className="text-[#616161]" /> : <Sun size={18} className="text-[#616161]" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-[#616161]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ff7759] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#212121]">Notifikasi</h3>
                  <Link href="/notifications" className="text-xs text-[#1863dc] hover:underline" onClick={() => setShowNotifications(false)}>
                    Lihat semua
                  </Link>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "px-4 py-3 border-b border-[#f2f2f2] cursor-pointer hover:bg-[#f8f8f8] transition-colors",
                        !notif.isRead && "bg-[#f1f5ff]"
                      )}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <p className="text-sm font-medium text-[#212121]">{notif.title}</p>
                      <p className="text-xs text-[#616161] mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-[#93939f] mt-1">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative ml-2 pl-4 border-l border-[#e5e7eb]" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-[#f5f5f5] rounded-lg pl-2 pr-3 py-1.5 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-[#212121]">Admin</p>
                <p className="text-[10px] text-[#93939f]">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#003c33] flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e5e7eb]">
                  <p className="text-sm font-medium text-[#212121]">Admin Manggala</p>
                  <p className="text-xs text-[#616161]">admin@manggala.co.id</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#212121] hover:bg-[#f8f8f8] transition-colors"
                  >
                    <User size={14} />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#212121] hover:bg-[#f8f8f8] transition-colors"
                  >
                    <Bell size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
