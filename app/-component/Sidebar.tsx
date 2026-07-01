"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartBar,
  FaTags,
  FaBars,
  FaTimes,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaFileAlt,
  FaPlusCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm";
  const activeLink = "bg-primary/15 text-primary shadow-sm";
  const inactiveLink =
    "text-text-muted hover:bg-surface-hover hover:text-text";

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("خروج موفق");
    router.push("/auth/login");
  }

  const navItems = [
    { href: "/dashboard", label: "داشبورد", icon: <FaHome size={16} /> },
    { href: "/dashboard/message", label: "پیام‌ها", icon: <FaEnvelope size={16} /> },
    { href: "/dashboard/stats", label: "آمار و تحلیل", icon: <FaChartBar size={16} /> },
  ];

  const blogSubItems = [
    { href: "/dashboard/posts", label: "لیست مقالات", icon: <FaFileAlt size={14} /> },
    { href: "/dashboard/posts/create", label: "مقاله جدید", icon: <FaPlusCircle size={14} /> },
    { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: <FaTags size={14} /> },
  ];

  return (
    <div className="flex">
      {/* hamburger for mobile */}
      <button
        onClick={toggleSidebar}
        className="p-4 text-text-muted md:hidden focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 right-0 z-20 h-full w-64 flex flex-col
          bg-surface border-l border-border
          shadow-xl md:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0
        `}
      >
        {/* header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <FaHome className="text-black" size={16} />
            </div>
            <div>
              <h1 className="text-base font-bold text-text leading-tight">
                پنل مدیریت
              </h1>
              <p className="text-xs text-text-soft">NexPad Admin</p>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`${linkBase} ${isActive(item.href) ? activeLink : inactiveLink}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* blog collapsible */}
          <div>
            <button
              onClick={() => setBlogOpen((p) => !p)}
              className={`${linkBase} w-full justify-between ${
                pathname.startsWith("/dashboard/posts") || pathname.startsWith("/dashboard/categories")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              <span className="flex items-center gap-3">
                <FaFileAlt size={16} />
                مدیریت محتوا
              </span>
              {blogOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {blogOpen && (
              <div className="mt-1 mr-3 space-y-1 border-r-2 border-primary/30 pr-3">
                {blogSubItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`${linkBase} text-xs ${isActive(item.href) ? activeLink : inactiveLink}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* footer */}
        <div className="p-4 border-t border-border">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-text-muted hover:bg-surface-hover transition-all mb-2"
          >
            <FaHome size={14} />
            مشاهده سایت
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-all"
          >
            <FaSignOutAlt size={14} />
            خروج از حساب
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
