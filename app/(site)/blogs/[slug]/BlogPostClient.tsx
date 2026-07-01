"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import BlogViewTracker from "@/app/-component/BlogViewTracker";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  category?: string;
  createdAt?: string;
}

interface Props {
  blog: Blog;
  categoryName: string | null;
}

export default function BlogPostClient({ blog, categoryName }: Props) {
  const [readingMode, setReadingMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const text =
      contentRef.current?.innerText ||
      blog.content.replace(/<[^>]+>/g, "");
    const words = text.trim().split(/\s+/).length;
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  }, [blog.content]);

  useEffect(() => {
    const html = document.documentElement;
    if (readingMode) {
      html.classList.add("reading-mode");
    } else {
      html.classList.remove("reading-mode");
    }
    return () => html.classList.remove("reading-mode");
  }, [readingMode]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (scrollTop / total) * 100 : 0);
      setShowScrollTop(scrollTop > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Inject copy buttons into code blocks
  const injectCopyButtons = useCallback(() => {
    if (!contentRef.current) return;
    contentRef.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
          btn.classList.add("copied");
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path></svg> Copy`;
            btn.classList.remove("copied");
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, []);

  useEffect(() => {
    injectCopyButtons();
  }, [injectCopyButtons, blog.content]);

  // Hide global scroll-to-top; the floating stack handles it here
  useEffect(() => {
    document.documentElement.classList.add("blog-detail-page");
    return () => document.documentElement.classList.remove("blog-detail-page");
  }, []);

  return (
    <>
      {/* ─── Reading Progress Bar ─── */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* ─── Floating Action Stack ─── */}
      <div className="floating-action-stack">
        {/* Reading Mode */}
        <div className="floating-tooltip-wrap">
          <button
            onClick={() => setReadingMode((v) => !v)}
            className={`floating-btn reading-mode-fab ${readingMode ? "reading-mode-fab--active" : ""}`}
            aria-label={readingMode ? "خروج از حالت مطالعه" : "حالت مطالعه"}
          >
            {readingMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            )}
          </button>
          <span className="floating-tooltip">حالت مطالعه</span>
        </div>

        {/* Scroll to top */}
        <div className="floating-tooltip-wrap">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`floating-btn scroll-top-fab ${showScrollTop ? "scroll-top-fab--visible" : ""}`}
            aria-label="بازگشت به بالا"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <span className="floating-tooltip">بازگشت به بالا</span>
        </div>
      </div>

      <BlogViewTracker blogId={blog._id} />

      {/* ─── Article ─── */}
      <article
        className={`blog-article ${isVisible ? "blog-article--visible" : "blog-article--hidden"}`}
      >
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="cover-wrapper">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="cover-img"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="cover-gradient" aria-hidden="true" />
          </div>
        )}

        {/* Header */}
        <header className="article-header">
          {categoryName && (
            <span className="article-category">{categoryName}</span>
          )}
          <h1 className="article-title">{blog.title}</h1>
          <div className="article-meta">
            {blog.createdAt && (
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span className="meta-dot" aria-hidden="true">·</span>
            <span>امیرحسین ورمانلی</span>
            {readingTime > 0 && (
              <>
                <span className="meta-dot" aria-hidden="true">·</span>
                <span>{readingTime} دقیقه مطالعه</span>
              </>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="article-divider" aria-hidden="true" />

        {/* Body */}
        <div
          ref={contentRef}
          className="article-body prose max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-headings:text-text
            prose-p:text-text-muted
            prose-p:leading-[1.9]
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text
            prose-blockquote:not-italic
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-ul:space-y-1 prose-ol:space-y-1
            prose-li:text-text-muted
            prose-code:text-primary
            prose-code:bg-surface-soft
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-code:before:content-none prose-code:after:content-none
          "
        >
          {parse(blog.content)}
        </div>

        {/* Footer */}
        <footer className="article-footer">
          <div className="footer-bar">
            {blog.createdAt && (
              <span>
                تاریخ انتشار:{" "}
                <strong>{new Date(blog.createdAt).toLocaleDateString("fa-IR")}</strong>
              </span>
            )}
            <span>
              نویسنده: <strong>امیرحسین ورمانلی</strong>
            </span>
          </div>
        </footer>
      </article>
    </>
  );
}
