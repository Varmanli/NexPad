"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import {
  FaCode,
  FaBookOpen,
  FaReact,
  FaNodeJs,
  FaBug,
  FaDatabase,
  FaServer,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Button from "./Buttoon";

export default function HeroSection() {
  const floatingCards = [
    {
      icon: <FaReact />,
      title: "React",
      text: "کامپوننت‌ها و JSX",
      className: "right-6 top-36 hidden xl:flex",
    },
    {
      icon: <FaCode />,
      title: "Frontend",
      text: "ترفندهای کاربردی",
      className: "left-10 top-48 hidden xl:flex",
    },
    {
      icon: <FaServer />,
      title: "Backend",
      text: "API و منطق سرور",
      className: "right-20 bottom-48 hidden 2xl:flex",
    },
    {
      icon: <FaDatabase />,
      title: "Database",
      text: "مدل‌سازی و کوئری",
      className: "left-24 bottom-52 hidden 2xl:flex",
    },
    {
      icon: <FaNodeJs />,
      title: "Node.js",
      text: "ساخت سرویس‌های واقعی",
      className: "right-72 top-28 hidden 2xl:flex",
    },
    {
      icon: <FaBug />,
      title: "Debug",
      text: "حل خطاهای پروژه",
      className: "left-72 top-32 hidden 2xl:flex",
    },
    {
      icon: <FaBookOpen />,
      title: "Article",
      text: "مقاله‌های کوتاه و مفید",
      className: "left-14 bottom-28 hidden 2xl:flex",
    },
  ];

  return (
    <section
      dir="rtl"
      className="
        relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32
        bg-[#F7F8FC] text-slate-950 transition-colors duration-300
        dark:bg-[#080817] dark:text-white
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_10%,rgba(5,150,105,0.16),transparent_34%),radial-gradient(circle_at_15%_45%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_85%_55%,rgba(8,145,178,0.12),transparent_34%)]
            dark:bg-[radial-gradient(circle_at_50%_10%,rgba(22,242,164,0.18),transparent_34%),radial-gradient(circle_at_15%_45%,rgba(139,92,246,0.16),transparent_32%),radial-gradient(circle_at_85%_55%,rgba(34,211,238,0.12),transparent_34%)]
          "
        />

        <div
          className="
            absolute inset-0 opacity-[0.35]
            [background-image:linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)]
            [background-size:54px_54px]
            dark:opacity-[0.12] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)]
          "
        />

        <div className="absolute right-1/2 top-24 h-72 w-72 translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-400/15" />
        <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/20" />
      </div>

      {/* Floating cards */}
      {floatingCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.12, duration: 0.5 }}
          className={`
            absolute z-10 items-center gap-3 rounded-3xl border border-slate-200/80
            bg-white/75 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl
            dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/20
            ${card.className}
          `}
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-lg text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            {card.icon}
          </span>
          <span className="text-right">
            <span className="block text-sm font-black text-slate-900 dark:text-white">
              {card.title}
            </span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {card.text}
            </span>
          </span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-20 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-black text-primary shadow-sm shadow-primary/10"
        >
          <HiSparkles className="text-lg" />
          Nexpad — یادگیری برنامه‌نویسی باحال و کاربردی
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="
            mx-auto max-w-4xl text-balance text-4xl font-black leading-[1.35] tracking-tight
            sm:text-6xl lg:text-7xl
          "
        >
          مقاله‌های آموزشی برای اینکه{" "}
          <span
            className="
              bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent
            "
          >
            بهتر کدنویسی کنی
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="
            mx-auto mt-6 max-w-2xl text-pretty text-base font-medium leading-8 text-text-muted sm:text-lg
          "
        >
          در Nexpad مفاهیم برنامه‌نویسی را ساده، تصویری و کاربردی یاد می‌گیری؛
          از نکات کوتاه روزانه تا مقاله‌های عمیق برای رشد واقعی.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg">
            <Link href="#blog" className="inline-flex items-center gap-3">
              رفتن به مقالات <BiArrowBack size={19} />
            </Link>
          </Button>

          <Link
            href="/blogs"
            className="
              inline-flex items-center justify-center rounded-2xl border border-border bg-surface/70 px-6 py-3
              text-sm font-black text-text-muted shadow-sm backdrop-blur-xl transition-all duration-200
              hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-soft hover:text-primary
            "
          >
            مشاهده همه نوشته‌ها
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="
            mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 rounded-3xl border border-slate-200/80
            bg-white/70 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl
            dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20 sm:grid-cols-3
          "
        >
          <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-white/[0.04]">
            <p className="text-2xl font-black text-slate-950 dark:text-white">
              کوتاه
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              قابل خواندن سریع
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-white/[0.04]">
            <p className="text-2xl font-black text-slate-950 dark:text-white">
              کاربردی
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              مناسب پروژه واقعی
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-white/[0.04]">
            <p className="text-2xl font-black text-slate-950 dark:text-white">
              ساده
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              بدون پیچیدگی اضافه
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
