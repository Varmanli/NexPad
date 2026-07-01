"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChartBar, FaEye, FaBlog, FaTags, FaEnvelope } from "react-icons/fa";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Stats {
  totalViews: number;
  totalBlogs: number;
  totalCategories: number;
  totalMessages: number;
  monthlyViews: number[];
  monthlyBlogs: number[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("خطا در دریافت آمار");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="p-6 text-center text-text-muted">
        در حال بارگذاری آمار...
      </p>
    );

  if (!stats)
    return (
      <p className="p-6 text-center text-danger">
        امکان بارگذاری آمار وجود ندارد.
      </p>
    );

  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر",
    "مرداد", "شهریور", "مهر", "آبان",
    "آذر", "دی", "بهمن", "اسفند",
  ];

  const barData = {
    labels: months,
    datasets: [
      {
        label: "تعداد بازدیدها",
        data: stats.monthlyViews,
        backgroundColor: "rgba(22, 242, 164, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "تعداد بلاگ‌ها",
        data: stats.monthlyBlogs,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#A7B0C3" } },
      tooltip: { mode: "index" as const, intersect: false },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#A7B0C3" },
        grid: { color: "rgba(37, 43, 70, 0.8)" },
      },
      y: {
        ticks: { color: "#A7B0C3" },
        grid: { color: "rgba(37, 43, 70, 0.8)" },
      },
    },
  };

  return (
    <main className="p-6 min-h-screen text-text">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <FaEye className="text-5xl text-primary mb-3" />, title: "تعداد بازدیدها", value: stats.totalViews.toLocaleString() },
          { icon: <FaBlog className="text-5xl text-secondary mb-3" />, title: "تعداد بلاگ‌ها", value: stats.totalBlogs },
          { icon: <FaTags className="text-5xl text-accent mb-3" />, title: "تعداد دسته‌بندی‌ها", value: stats.totalCategories },
          { icon: <FaEnvelope className="text-5xl text-warning mb-3" />, title: "پیام‌های دریافتی", value: stats.totalMessages },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center transition-all hover:shadow-md"
          >
            {card.icon}
            <h2 className="text-lg font-semibold text-text mb-1">{card.title}</h2>
            <p className="text-3xl font-bold text-text">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-8">
        <div className="bg-surface p-14 rounded-2xl shadow-sm border border-border transition-all hover:shadow-md w-full h-[450px]">
          <h2 className="text-xl font-semibold mb-4 text-text">
            تعداد بازدیدها (ماهانه)
          </h2>
          <Bar data={barData} options={chartOptions} />
        </div>

        <div className="bg-surface p-14 rounded-2xl shadow-sm border border-border transition-all hover:shadow-md w-full h-[450px]">
          <h2 className="text-xl font-semibold mb-4 text-text">
            تعداد بلاگ‌ها (ماهانه)
          </h2>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
}
