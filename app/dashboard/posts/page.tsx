"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { blogPath } from "@/lib/slugify";

interface Post {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  views?: number;
  coverImage?: string;
  category?: { name: string } | string;
  tags?: string[];
}

type SortField = "title" | "createdAt" | "views";
type SortOrder = "asc" | "desc";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface border border-border animate-pulse">
      <div className="w-full aspect-video bg-surface-hover" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-surface-hover rounded w-3/4" />
        <div className="h-3 bg-surface-hover rounded w-full" />
        <div className="h-3 bg-surface-hover rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-surface-hover rounded-full" />
          <div className="h-6 w-20 bg-surface-hover rounded-full" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="w-24 h-24 rounded-full bg-surface-soft flex items-center justify-center">
        <svg
          className="w-10 h-10 text-text-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-text mb-1">
          هیچ بلاگی ثبت نشده
        </h3>
        <p className="text-text-muted text-sm">
          اولین مقاله خود را بنویسید و منتشر کنید.
        </p>
      </div>
      <Link href="/dashboard/posts/create">
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-semibold hover:opacity-90 transition-all shadow-md">
          <FaPlus size={14} /> افزودن اولین مقاله
        </button>
      </Link>
    </div>
  );
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("خطا در دریافت بلاگ‌ها");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت بلاگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("آیا از حذف این بلاگ مطمئن هستید؟");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("بلاگ حذف شد");
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch {
      toast.error("خطا در حذف بلاگ");
    }
  };

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    let valA: number | string = "";
    let valB: number | string = "";

    if (sortField === "title") {
      valA = a.title;
      valB = b.title;
    } else if (sortField === "createdAt") {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    } else if (sortField === "views") {
      valA = a.views ?? 0;
      valB = b.views ?? 0;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortBtn = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        sortField === field
          ? "bg-primary/10 text-primary"
          : "text-text-muted hover:bg-surface-hover"
      }`}
    >
      {label}
      {sortField === field ? (
        sortOrder === "asc" ? (
          <FaSortAmountUp size={12} />
        ) : (
          <FaSortAmountDown size={12} />
        )
      ) : null}
    </button>
  );

  return (
    <main className="p-6 min-h-screen text-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text">
            مدیریت مقالات
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {posts.length} مقاله ثبت شده
          </p>
        </div>
        <Link href="/dashboard/posts/create">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl font-semibold hover:opacity-90 transition-all shadow-sm">
            <FaPlus size={14} /> مقاله جدید
          </button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Sort Controls */}
      {!loading && posts.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-text-soft ml-1">مرتب‌سازی:</span>
          <SortBtn field="createdAt" label="تاریخ" />
          <SortBtn field="title" label="عنوان" />
          <SortBtn field="views" label="بازدید" />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : sortedPosts.length === 0 ? (
          <EmptyState />
        ) : (
          sortedPosts.map((post) => (
            <article
              key={post._id}
              className="group rounded-2xl overflow-hidden bg-surface border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-video overflow-hidden bg-surface-soft">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-text-soft"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-surface-soft text-text-muted font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="text-base font-bold text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-text-soft mt-auto pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={10} />
                    {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye size={10} />
                    {post.views ?? 0}
                  </span>
                  {post.category && typeof post.category === "object" && (
                    <span className="mr-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[10px]">
                      {(post.category as { name: string }).name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/dashboard/posts/edit/${post._id}`}
                    className="flex-1"
                  >
                    <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-surface-soft text-text-muted hover:bg-accent/10 hover:text-accent transition-all">
                      <FaEdit size={13} /> ویرایش
                    </button>
                  </Link>
                  <Link
                    href={blogPath(post.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      title="پیش‌نمایش مقاله"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-surface-soft text-text-muted hover:bg-success/10 hover:text-success transition-all"
                    >
                      <FaEye size={13} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-surface-soft text-text-muted hover:bg-danger/10 hover:text-danger transition-all"
                  >
                    <FaTrashAlt size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
