"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-global fixed bottom-6 right-6 z-[9990] p-3 rounded-full bg-gradient-to-tr from-secondary via-accent to-primary shadow-lg text-white text-base transition-all duration-300 ${
        visible ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      } hover:scale-110`}
      aria-label="بازگشت به بالا"
    >
      <FaArrowUp />
    </button>
  );
}
