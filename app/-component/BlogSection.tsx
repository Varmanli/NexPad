"use client";

import { useEffect, useMemo, useState } from "react";
import { IBlog } from "@/models/Blog";
import { ICategory } from "@/models/Category";
import Card from "./Card";
import Link from "next/link";
import Status from "./Status";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFire,
  FaSortAmountDownAlt,
  FaSortAmountUp,
  FaChevronDown,
  FaLayerGroup,
  FaNewspaper,
  FaArrowLeft,
} from "react-icons/fa";
import Button from "./Buttoon";

interface BlogSectionProps {
  hideTabs?: boolean;
  initialCategoryId?: string;
  categoryName?: string;
}

type SortOrder = "newest" | "oldest" | "popular";

export default function BlogSection({
  hideTabs = false,
  initialCategoryId = "all",
  categoryName,
}: BlogSectionProps) {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategoryId);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(false);

        const [blogsRes, categoriesRes] = await Promise.all([
          fetch("/api/blogs", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!blogsRes.ok || !categoriesRes.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }

        const blogsData = await blogsRes.json();
        const categoriesData = await categoriesRes.json();

        setBlogs(blogsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategoryId);
  }, [initialCategoryId]);

  const pageTitle =
    categoryName === "همه مقالات"
      ? "همه مقالات"
      : categoryName
        ? `مقالات ${categoryName}`
        : "آخرین مقالات";

  const selectedCategoryName =
    selectedCategory === "all"
      ? "همه مقالات"
      : categories.find((c) => String(c._id) === selectedCategory)?.name ||
        "انتخاب دسته‌بندی";

  const sortOptions: {
    value: SortOrder;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "newest",
      label: "جدیدترین",
      icon: <FaSortAmountDownAlt />,
    },
    {
      value: "oldest",
      label: "قدیمی‌ترین",
      icon: <FaSortAmountUp />,
    },
    {
      value: "popular",
      label: "محبوب‌ترین",
      icon: <FaFire />,
    },
  ];

  const currentSort = sortOptions.find((item) => item.value === sortOrder);

  const filteredBlogs = useMemo(() => {
    return selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => String(blog.category) === selectedCategory);
  }, [blogs, selectedCategory]);

  const sortedBlogs = useMemo(() => {
    return [...filteredBlogs].sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (sortOrder === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      if (sortOrder === "popular") {
        return (b.views || 0) - (a.views || 0);
      }

      return 0;
    });
  }, [filteredBlogs, sortOrder]);

  const displayBlogs = hideTabs ? sortedBlogs : sortedBlogs.slice(0, 9);

  if (loading) {
    return (
      <section id="blog" dir="rtl" className="relative z-20 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 h-10 w-56 animate-pulse rounded-2xl bg-surface-hover" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="
                  h-80 animate-pulse rounded-[2rem] border border-border
                  bg-white shadow-sm
                  dark:border-white/10 dark:bg-white/[0.04]
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <Status type="error" message="خطا در دریافت داده‌ها" />;

  return (
    <section
      id="blog"
      dir="rtl"
      className="
        relative z-20 overflow-hidden px-4 py-20
        bg-background text-text
        sm:px-6 lg:px-8
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="
            absolute inset-0 opacity-60
            bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.13),transparent_32%),radial-gradient(circle_at_15%_45%,rgba(124,58,237,0.10),transparent_28%),radial-gradient(circle_at_85%_55%,rgba(8,145,178,0.10),transparent_30%)]
            dark:bg-[radial-gradient(circle_at_50%_0%,rgba(22,242,164,0.12),transparent_32%),radial-gradient(circle_at_15%_45%,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_85%_55%,rgba(34,211,238,0.10),transparent_30%)]
          "
        />

        <div
          className="
            absolute inset-0 opacity-[0.35]
            [background-image:linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)]
            [background-size:56px_56px]
            dark:opacity-[0.10]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)]
          "
        />

        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <div
            className="
              mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20
              bg-primary-soft px-4 py-2 text-sm font-black text-primary
            "
          >
            <FaNewspaper />
            بلاگ Nexpad
          </div>

          <h2
            className="
              text-4xl font-black leading-tight tracking-tight text-text md:text-6xl
            "
          >
            {pageTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-text-muted md:text-lg">
            مقاله‌های آموزشی، کوتاه و کاربردی برای یادگیری بهتر برنامه‌نویسی و
            توسعه وب.
          </p>
        </motion.div>

        {/* Controls */}
        {!hideTabs && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="
              relative z-30 mb-10 rounded-[2rem] border border-border
              bg-surface/85 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl
            "
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 px-2">
                <span
                  className="
                    grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary
                  "
                >
                  <FaLayerGroup />
                </span>

                <div>
                  <p className="text-sm font-black text-text">
                    فیلتر و مرتب‌سازی
                  </p>
                  <p className="text-xs font-medium text-text-soft">
                    {displayBlogs.length} مقاله قابل نمایش
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Category Dropdown */}
                <div className="relative min-w-56">
                  <button
                    onClick={() => {
                      setCategoryDropdownOpen((prev) => !prev);
                      setSortDropdownOpen(false);
                    }}
                    type="button"
                    className="
                      flex w-full items-center justify-between gap-3 rounded-2xl border border-border
                      bg-surface-soft px-4 py-3 text-sm font-bold text-text
                      transition-all duration-200 hover:border-primary/50 hover:bg-primary-soft
                      focus:outline-none focus:ring-4 focus:ring-primary/10
                    "
                  >
                    <span className="truncate">{selectedCategoryName}</span>
                    <FaChevronDown
                      size={12}
                      className={`shrink-0 transition-transform duration-200 ${
                        categoryDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {categoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="
                          absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-3xl
                          border border-border bg-surface p-2 shadow-2xl shadow-slate-900/10
                        "
                      >
                        <button
                          onClick={() => {
                            setSelectedCategory("all");
                            setCategoryDropdownOpen(false);
                          }}
                          type="button"
                          className={`
                            flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-bold transition-all
                            ${
                              selectedCategory === "all"
                                ? "bg-primary text-black"
                                : "text-text-muted hover:bg-surface-hover"
                            }
                          `}
                        >
                          همه مقالات
                        </button>

                        <div className="my-2 h-px bg-border" />

                        <div className="max-h-64 overflow-y-auto">
                          {categories.map((cat) => {
                            const isActive =
                              selectedCategory === String(cat._id);

                            return (
                              <button
                                key={String(cat._id)}
                                onClick={() => {
                                  setSelectedCategory(String(cat._id));
                                  setCategoryDropdownOpen(false);
                                }}
                                type="button"
                                className={`
                                  flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-bold transition-all
                                  ${
                                    isActive
                                      ? "bg-primary text-black"
                                      : "text-text-muted hover:bg-surface-hover"
                                  }
                                `}
                              >
                                {cat.name}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort Dropdown */}
                <div className="relative min-w-44">
                  <button
                    onClick={() => {
                      setSortDropdownOpen((prev) => !prev);
                      setCategoryDropdownOpen(false);
                    }}
                    type="button"
                    className="
                      flex w-full items-center justify-between gap-3 rounded-2xl border border-border
                      bg-surface-soft px-4 py-3 text-sm font-bold text-text
                      transition-all duration-200 hover:border-secondary/50 hover:bg-secondary-soft
                      focus:outline-none focus:ring-4 focus:ring-secondary/10
                    "
                  >
                    <span className="flex items-center gap-2">
                      {currentSort?.icon}
                      {currentSort?.label}
                    </span>
                    <FaChevronDown
                      size={12}
                      className={`shrink-0 transition-transform duration-200 ${
                        sortDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="
                          absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-3xl
                          border border-border bg-surface p-2 shadow-2xl shadow-slate-900/10
                        "
                      >
                        {sortOptions.map((option) => {
                          const isActive = sortOrder === option.value;

                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortOrder(option.value);
                                setSortDropdownOpen(false);
                              }}
                              type="button"
                              className={`
                                flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-right text-sm font-bold transition-all
                                ${
                                  isActive
                                    ? "bg-violet-500 text-white"
                                    : "text-text-muted hover:bg-surface-hover"
                                }
                              `}
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        {displayBlogs.length ? (
          <motion.div
            layout
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {displayBlogs.map((blog, index) => (
                <motion.div
                  key={String(blog._id)}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: index * 0.035, duration: 0.28 }}
                  className="
                    rounded-[2rem] border border-border bg-surface/70 p-2
                    shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300
                    hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10
                  "
                >
                  <Card
                    id={String((blog as any).slug || blog._id)}
                    title={blog.title}
                    coverImage={blog.coverImage}
                    buttonText="مطالعه مقاله"
                    itemType="blog"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mx-auto max-w-lg rounded-[2rem] border border-border bg-surface/85
              p-10 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl
            "
          >
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-primary-soft text-2xl text-primary">
              <FaNewspaper />
            </div>

            <h3 className="text-xl font-black text-text">
              مقاله‌ای پیدا نشد
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-text-muted">
              برای این دسته‌بندی هنوز مقاله‌ای منتشر نشده است. دسته‌بندی دیگری
              را انتخاب کنید.
            </p>

            <button
              onClick={() => setSelectedCategory("all")}
              type="button"
              className="
                mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black
                transition-all hover:opacity-90
              "
            >
              نمایش همه مقالات
            </button>
          </motion.div>
        )}

        {/* View All */}
        {!hideTabs && displayBlogs.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button size="lg">
              <Link
                href={
                  selectedCategory === "all"
                    ? "/blogs"
                    : `/blogs/category/${selectedCategory}`
                }
                className="inline-flex items-center gap-3"
              >
                مشاهده همه مقالات
                <FaArrowLeft size={14} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
