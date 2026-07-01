"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import RichEditor from "./rich-editor";
import ImageProvider from "./context/ImageProvider";
import { uploadFile } from "@/app/actions/file";
import { IBlog } from "@/models/Blog";

interface Category {
  _id: string;
  name: string;
}

interface PostFormProps {
  post?: IBlog;
  mode: "create" | "edit";
}

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === "edit" && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setExistingCoverUrl(post.coverImage || null);
      setCoverPreview(null);
      setCoverFile(null);
      setSelectedCategory(post.category ? String(post.category) : "");
    } else {
      setTitle("");
      setContent("");
      setCoverFile(null);
      setCoverPreview(null);
      setExistingCoverUrl(null);
      setSelectedCategory("");
    }
  }, [mode, post]);

  const applyFile = useCallback((file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setExistingCoverUrl(null);
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setExistingCoverUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; category?: string } = {};
    if (!title.trim()) newErrors.title = "عنوان پست الزامی است";
    if (!content.trim() || content === "<p></p>")
      newErrors.content = "محتوای پست الزامی است";
    if (!selectedCategory) newErrors.category = "انتخاب دسته‌بندی الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let coverUrl = existingCoverUrl;

      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        const uploadResult = await uploadFile(formData);
        if (uploadResult?.secure_url) coverUrl = uploadResult.secure_url;
        else throw new Error("خطا در آپلود تصویر کاور");
      }

      const postData = {
        title: title.trim(),
        content,
        coverImage: coverUrl,
        author: "ناشناس",
        tags: post?.tags || [],
        category: selectedCategory,
      };

      let response;
      if (mode === "create") {
        response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      } else {
        response = await fetch(`/api/blogs/${post?._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره پست");
      }

      toast.success(
        mode === "create" ? "پست با موفقیت ایجاد شد!" : "پست با موفقیت بروزرسانی شد!"
      );

      if (mode === "create") {
        setTitle("");
        setContent("");
        setCoverFile(null);
        setCoverPreview(null);
        setExistingCoverUrl(null);
        setSelectedCategory("");
      }

      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره پست");
    } finally {
      setIsLoading(false);
    }
  };

  const coverSrc = coverPreview || existingCoverUrl;

  return (
    <ImageProvider>
      <form onSubmit={handleSubmit} className="min-h-screen">
        {/* ─── Top bar ─────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/posts")}
              className="text-text-soft hover:text-text transition-colors"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-text">
              {mode === "create" ? "ایجاد مقاله جدید" : `ویرایش: ${post?.title ?? ""}`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/posts")}
              className="px-4 py-2 text-sm border border-border text-text-muted rounded-xl hover:bg-surface-hover transition-colors"
              disabled={isLoading}
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm ${
                isLoading
                  ? "bg-surface-soft text-text-soft cursor-not-allowed"
                  : "bg-primary text-black hover:opacity-90"
              }`}
            >
              {isLoading
                ? "در حال ذخیره..."
                : mode === "create"
                ? "انتشار مقاله"
                : "ذخیره تغییرات"}
            </button>
          </div>
        </div>

        {/* ─── Two-column layout ──────────────────── */}
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-0 xl:gap-8 px-4 xl:px-8 py-8">
          {/* ── Main editor column ─────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Title input */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان مقاله را وارد کنید..."
                className={`w-full text-2xl md:text-3xl font-bold bg-transparent border-0 border-b-2 outline-none pb-3 placeholder:text-text-soft transition-colors ${
                  errors.title
                    ? "border-danger text-danger"
                    : "border-border text-text focus:border-primary"
                }`}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-danger">{errors.title}</p>
              )}
            </div>

            {/* Rich Editor */}
            <div
              className={`rounded-2xl border transition-colors ${
                errors.content ? "border-danger" : "border-border"
              }`}
            >
              <RichEditor value={content} onChange={setContent} />
            </div>
            {errors.content && (
              <p className="text-xs text-danger -mt-4">{errors.content}</p>
            )}
          </div>

          {/* ── Settings sidebar ───────────────────── */}
          <div className="w-full xl:w-80 shrink-0 space-y-5">
            {/* Cover image */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-text-muted">
                  تصویر کاور
                </h3>
                <p className="text-xs text-text-soft mt-0.5">
                  اندازه پیشنهادی: 1200×630 پیکسل
                </p>
              </div>
              <div className="p-4">
                {coverSrc ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                    <Image
                      src={coverSrc}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-medium bg-surface text-text rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        تغییر
                      </button>
                      <button
                        type="button"
                        onClick={removeCover}
                        className="px-3 py-1.5 text-xs font-medium bg-danger text-white rounded-lg hover:opacity-90 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all ${
                      isDraggingOver
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:border-primary hover:bg-surface-hover"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center">
                      <svg className="w-5 h-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-text-muted">
                        {isDraggingOver ? "رها کنید..." : "کشیدن و رها کردن"}
                      </p>
                      <p className="text-[11px] text-text-soft mt-0.5">
                        یا کلیک کنید
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Category */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-text-muted">
                  دسته‌بندی
                </h3>
              </div>
              <div className="p-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-surface-soft text-text outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer ${
                    errors.category
                      ? "border-danger"
                      : "border-border"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-danger">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Summary card for edit mode */}
            {mode === "edit" && post && (
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-text-muted mb-3">
                  اطلاعات مقاله
                </h3>
                <dl className="space-y-2 text-xs text-text-soft">
                  <div className="flex justify-between">
                    <dt>تاریخ ایجاد</dt>
                    <dd>{post.createdAt ? new Date(post.createdAt as unknown as string).toLocaleDateString("fa-IR") : "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>بازدید</dt>
                    <dd>{(post as { views?: number }).views ?? 0}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </form>
    </ImageProvider>
  );
}
