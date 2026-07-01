"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeProvider";
import { ICategory } from "@/models/Category";
import logo from "@/public/logo.png";

export default function Header() {
  const themeContext = useContext(ThemeContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const theme = themeContext?.theme;
  const toggleTheme = themeContext?.toggleTheme;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!themeContext) return null;

  const navLinks = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ];

  return (
    <>
      <header
        dir="rtl"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-border bg-surface/80 shadow-sm backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="group flex items-center" aria-label="صفحه اصلی">
              <span
                className={`relative flex h-14 w-[160px] items-center justify-center overflow-hidden rounded-2xl border px-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg ${
                  theme === "dark"
                    ? "border-border-soft bg-surface-soft shadow-[0_8px_30px_rgba(0,0,0,0.22)]"
                    : "border-border bg-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <Image
                  src={logo}
                  alt="Nexpad logo"
                  width={140}
                  priority
                  className="relative z-10 h-auto w-full object-contain"
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center rounded-full border border-border bg-surface/70 px-2 py-2 shadow-sm backdrop-blur-xl md:flex">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-bold text-text-muted transition-all hover:bg-primary-soft hover:text-primary"
              >
                صفحه اصلی
              </Link>

              {/* Blogs Dropdown */}
              <div className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-text-muted transition-all hover:bg-primary-soft hover:text-primary"
                >
                  مقالات
                  <FaChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                </button>

                <div className="invisible absolute right-0 top-full mt-3 w-64 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-3xl border border-border bg-surface/95 p-2 shadow-2xl backdrop-blur-xl">
                    <Link
                      href="/blogs"
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-text transition-all hover:bg-primary-soft hover:text-primary"
                    >
                      همه مقالات
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">همه</span>
                    </Link>

                    <div className="my-2 h-px bg-border" />

                    <div className="max-h-72 overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <Link
                            key={String(cat._id)}
                            href={`/blogs/category/${cat._id}`}
                            className="block rounded-2xl px-4 py-3 text-sm font-medium text-text-muted transition-all hover:bg-surface-hover hover:text-text"
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-text-soft">دسته‌بندی‌ای یافت نشد</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-bold text-text-muted transition-all hover:bg-primary-soft hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                type="button"
                aria-label="تغییر حالت نمایش"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface/80 text-text-muted shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-soft hover:text-primary"
              >
                {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>

              <Link
                href="/blogs"
                className="hidden rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:inline-flex"
              >
                خواندن مقالات
              </Link>

              <button
                onClick={() => setIsMenuOpen(true)}
                type="button"
                aria-label="باز کردن منو"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface/80 text-text-muted shadow-sm transition-all duration-200 hover:bg-surface-hover md:hidden"
              >
                <FaBars size={19} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        dir="rtl"
        className={`fixed right-0 top-0 z-[70] h-dvh w-[86%] max-w-sm transform overflow-y-auto border-l border-border bg-surface p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="group relative flex h-12 w-36 items-center justify-center overflow-hidden rounded-2xl border px-3 border-border bg-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/10" />
            <Image
              src={logo}
              alt="logo"
              width={140}
              priority
              className="relative z-10 h-auto w-full object-contain"
            />
          </Link>

          <button
            onClick={() => setIsMenuOpen(false)}
            type="button"
            aria-label="بستن منو"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-danger/10 text-danger transition-all hover:bg-danger/20"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-2xl px-4 py-3 text-base font-black text-text transition-all hover:bg-primary-soft hover:text-primary"
          >
            صفحه اصلی
          </Link>

          <div className="rounded-3xl border border-border bg-surface-soft p-2">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-black text-text transition-all hover:bg-surface-hover"
            >
              <span>مقالات</span>
              <FaChevronDown
                size={13}
                className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isDropdownOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mt-2 space-y-1 border-t border-border pt-2">
                  <Link
                    href="/blogs"
                    onClick={() => { setIsMenuOpen(false); setIsDropdownOpen(false); }}
                    className="block rounded-2xl px-4 py-3 text-sm font-bold text-text-muted transition-all hover:bg-surface-hover hover:text-primary"
                  >
                    همه مقالات
                  </Link>

                  {categories.map((cat) => (
                    <Link
                      key={String(cat._id)}
                      href={`/blogs/category/${cat._id}`}
                      onClick={() => { setIsMenuOpen(false); setIsDropdownOpen(false); }}
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-text-muted transition-all hover:bg-surface-hover hover:text-text"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-2xl px-4 py-3 text-base font-black text-text transition-all hover:bg-primary-soft hover:text-primary"
          >
            درباره ما
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-2xl px-4 py-3 text-base font-black text-text transition-all hover:bg-primary-soft hover:text-primary"
          >
            تماس با ما
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-surface-soft p-4">
          <p className="mb-3 text-sm font-bold text-text-muted">تنظیمات نمایش</p>

          <button
            onClick={toggleTheme}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm font-black text-text shadow-sm transition-all hover:bg-primary-soft hover:text-primary"
          >
            <span>{theme === "dark" ? "حالت روشن" : "حالت تاریک"}</span>
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>

        <Link
          href="/blogs"
          onClick={() => setIsMenuOpen(false)}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-4 text-sm font-black text-black shadow-lg shadow-primary/20 transition-all hover:opacity-90"
        >
          رفتن به مقالات
        </Link>
      </aside>
    </>
  );
}
