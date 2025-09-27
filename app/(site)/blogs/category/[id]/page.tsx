"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IBlog } from "@/models/Blog";
import { ICategory } from "@/models/Category";

import { motion } from "framer-motion";
import { FaFire, FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import Status from "@/app/-component/Status";
import Card from "@/app/-component/Card";

export default function CategoryPage() {
  const { id } = useParams(); // آیدی دسته‌بندی
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        // گرفتن اسم دسته‌بندی از API
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`,
          { cache: "no-store" }
        );
        if (!categoryRes.ok) throw new Error("خطا در دریافت دسته‌بندی");
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // گرفتن بلاگ‌های اون دسته
        const blogsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?category=${id}`,
          { cache: "no-store" }
        );
        if (!blogsRes.ok) throw new Error("خطا در دریافت بلاگ‌ها");
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <Status type="loading" message="در حال بارگذاری..." />;
  if (error) return <Status type="error" message="خطا در دریافت داده‌ها" />;

  // مرتب‌سازی
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortOrder === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOrder === "popular") return b.views - a.views;
    return 0;
  });

  return (
    <section className="relative z-20 md:px-14">
      {/* عنوان دسته‌بندی */}
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-transparent bg-clip-text animate-fadeIn mb-8 text-center pt-14">
        مقالات {category?.name || "دسته‌بندی"}
      </h1>

      {/* دکمه مرتب‌سازی */}
      <div className="flex justify-end mb-8 md:px-6">
        <div className="relative inline-block group">
          <button className="w-44 flex justify-between items-center gap-3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
            {sortOrder === "newest" && (
              <>
                جدیدترین <FaSortAmountDownAlt />
              </>
            )}
            {sortOrder === "oldest" && (
              <>
                قدیمی‌ترین <FaSortAmountUp />
              </>
            )}
            {sortOrder === "popular" && (
              <>
                محبوب‌ترین <FaFire />
              </>
            )}
          </button>

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute mt-2 right-0 w-44 rounded-xl bg-white dark:bg-gray-800 shadow-xl z-20 overflow-hidden border border-gray-200 dark:border-gray-700 opacity-0 scale-95 invisible group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
          >
            {["newest", "oldest", "popular"].map((option) => (
              <div
                key={option}
                onClick={() =>
                  setSortOrder(option as "newest" | "oldest" | "popular")
                }
                className="px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors duration-200"
              >
                {option === "newest"
                  ? "جدیدترین"
                  : option === "oldest"
                  ? "قدیمی‌ترین"
                  : "محبوب‌ترین"}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* لیست بلاگ‌ها */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:px-6 mb-[200px]">
        {sortedBlogs.length ? (
          sortedBlogs.map((blog) => (
            <div key={String(blog._id)} className="p-5">
              <Card
                id={String(blog._id)}
                title={blog.title}
                coverImage={blog.coverImage}
                buttonText="مطالعه مقاله"
                itemType="blog"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-12 z-10 relative">
            مقاله‌ای برای این دسته‌بندی پیدا نشد.
          </p>
        )}
      </div>

      {/* بک‌گراند گرادیانت */}
      <div className="absolute top-1 left-[30%] w-72 h-72 md:w-[700px] md:h-[700px] rounded-full bg-[#00FF99] opacity-20 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 left-0 w-72 h-72 md:w-[400px] md:h-[400px] rounded-full bg-[#00FF99] opacity-25 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-20 right-0 w-72 md:w-[400px] md:h-[400px] rounded-full bg-[#00FF99] opacity-20 blur-3xl pointer-events-none -z-10"></div>
    </section>
  );
}
