"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IBlog } from "@/models/Blog";
import Image from "next/image";
import { blogPath } from "@/lib/slugify";

interface BlogCardProps {
  blog: IBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative group rounded-2xl overflow-hidden shadow-lg bg-surface border border-border transition-all duration-500"
    >
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500" />

      {/* تصویر */}
      <div className="h-48 w-full overflow-hidden relative">
        <Image
          src={blog.coverImage || "/fallback.png"}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          fill
        />

        {/* شاین افکت */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700" />
      </div>

      {/* محتوا */}
      <div className="relative p-5 z-10">
        <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition">
          {blog.title}
        </h3>

        {/* دکمه */}
        <div className="flex justify-end">
          <Link
            href={blogPath(blog.slug)}
            className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-semibold shadow hover:opacity-90 transition mt-3"
          >
            مطالعه مقاله
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
