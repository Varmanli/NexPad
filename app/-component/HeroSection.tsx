"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import Button from "./Buttoon";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col justify-center items-center text-center py-20 px-4
                h-[100vh] mt-[-84px] transition-colors duration-300 overflow-x-hidden"
    >
      {/* گرادینت نور */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.15),transparent_70%)]
               dark:bg-[radial-gradient(ellipse_at_top,rgba(0,255,153,0.1),transparent_70%)]
               pointer-events-none"
      />

      {/* محتوای اصلی */}
      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span
            className="px-3 py-1 text-sm font-mono rounded-full border 
                       border-[#00FF99] text-green-500 dark:text-[#00FF99] inline-block"
          >
            🚀 Nexpad - یادگیری برنامه‌نویسی باحال!
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold leading-tight dark:text-white"
        >
          مقاله‌های{" "}
          <span className="text-green-500 dark:text-[#00FF99] ">
            جالب و آموزشی
          </span>{" "}
          برنامه‌نویسی
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300"
        >
          در Nexpad یاد می‌گیری چطور با روش‌های جدید، خلاق و ساده برنامه‌نویسی
          کنی.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Button size="lg">
            <Link href="#blog" className="inline-flex items-center gap-3">
              رفتن به مقالات <BiArrowBack size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
