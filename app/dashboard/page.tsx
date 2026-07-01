"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  FaEye,
  FaBlog,
  FaTags,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

interface Stats {
  totalViews: number;
  totalBlogs: number;
  totalCategories: number;
  totalMessages: number;
  topPosts: { _id: string; title: string; slug: string; views: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => toast.error("خطا در دریافت آمار"));

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = time.toLocaleDateString("fa-IR", {
    month: "long",
    year: "numeric",
    weekday: "long",
    day: "numeric",
  });
  const timeStr = time.toLocaleTimeString("fa-IR");

  const cards = stats
    ? [
        {
          icon: <FaBlog size={24} />,
          label: "مقالات",
          value: stats.totalBlogs,
          href: "/dashboard/posts",
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-500/10",
        },
        {
          icon: <FaEye size={24} />,
          label: "بازدید کل",
          value: stats.totalViews.toLocaleString("fa-IR"),
          href: "/dashboard/stats",
          color: "text-success",
          bg: "bg-success/10",
        },
        {
          icon: <FaTags size={24} />,
          label: "دسته‌بندی‌ها",
          value: stats.totalCategories,
          href: "/dashboard/categories",
          color: "text-secondary",
          bg: "bg-secondary/10",
        },
        {
          icon: <FaEnvelope size={24} />,
          label: "پیام‌ها",
          value: stats.totalMessages,
          href: "/dashboard/message",
          color: "text-warning",
          bg: "bg-warning/10",
        },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">داشبورد</h1>
          <p className="text-sm text-text-muted mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-mono text-primary font-semibold">
            {timeStr}
          </span>
          <a
            href="/"
            target="_blank"
            className="bg-primary text-black font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-all text-sm shadow"
          >
            مشاهده سایت
          </a>
        </div>
      </div>

      {/* stat cards */}
      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl p-6 animate-pulse h-32"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group border border-border"
            >
              <div
                className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
              >
                {card.icon}
              </div>
              <p className="text-sm text-text-muted mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-text">{card.value}</p>
            </Link>
          ))}
        </div>
      )}

      {/* top posts */}
      {stats && stats.topPosts?.length > 0 && (
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">
              پربازدیدترین مقالات
            </h2>
            <Link
              href="/dashboard/stats"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              مشاهده همه <FaArrowLeft size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.topPosts.map((post, i) => (
              <div
                key={post._id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-soft text-xs flex items-center justify-center text-text-muted font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-text-muted truncate max-w-xs">
                    {post.title}
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary flex items-center gap-1">
                  <FaEye size={12} />
                  {post.views.toLocaleString("fa-IR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
