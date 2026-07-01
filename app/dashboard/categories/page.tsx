"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaSearch,
  FaTag,
  FaEllipsisH,
} from "react-icons/fa";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
  blogCount?: number;
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      dir="rtl"
      className="rounded-2xl bg-surface border border-border p-5 animate-pulse"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-7 h-7 rounded-lg bg-surface-hover" />
        <div className="flex items-center gap-3">
          <div className="space-y-2 text-right">
            <div className="h-4 w-28 bg-surface-hover rounded mr-auto" />
            <div className="h-3 w-20 bg-surface-hover rounded mr-auto" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-hover" />
        </div>
      </div>
      <div className="h-px bg-border my-3" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-surface-hover rounded" />
        <div className="h-6 w-14 rounded-full bg-surface-hover" />
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      dir="rtl"
      className="col-span-full flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-surface-soft flex items-center justify-center">
        <FaTag className="w-8 h-8 text-text-soft" />
      </div>
      <div>
        <p className="text-lg font-semibold text-text">
          هیچ دسته‌بندی‌ای یافت نشد
        </p>
        <p className="text-sm text-text-muted mt-1">
          با ایجاد اولین دسته‌بندی شروع کنید
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
      >
        <FaPlus size={11} />
        ایجاد اولین دسته‌بندی
      </button>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = category.name.slice(0, 2);

  return (
    <div
      dir="rtl"
      className="group relative rounded-2xl bg-surface border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Action menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-soft hover:text-text hover:bg-surface-hover transition-all opacity-0 group-hover:opacity-100"
          >
            <FaEllipsisH size={12} />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-9 z-20 w-40 rounded-xl bg-surface border border-border shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(category);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-muted hover:bg-surface-hover transition-colors text-right"
              >
                <FaEdit size={11} className="text-accent flex-shrink-0" />
                ویرایش
              </button>
              <div className="h-px bg-border" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(category._id);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors text-right"
              >
                <FaTrashAlt size={11} className="flex-shrink-0" />
                حذف
              </button>
            </div>
          )}
        </div>

        {/* Name + avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h3 className="font-semibold text-text leading-tight">
              {category.name}
            </h3>
            <p className="text-xs text-text-soft mt-0.5 font-mono ltr inline-block">
              /{category.slug}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {initials}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-3" />

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-soft">
          {category.blogCount ?? 0} محتوا
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          فعال
        </span>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

function CategoryModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Category;
  onClose: () => void;
  onSave: (name: string, slug: string) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [saving, setSaving] = useState(false);

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name, slug);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        dir="rtl"
        className="w-full max-w-md mx-4 bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text">
            {initial ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-soft hover:text-text hover:bg-surface-hover transition-all"
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-soft mb-1.5 uppercase tracking-wide">
              نام دسته‌بندی
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: فناوری"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-soft text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-soft mb-1.5 uppercase tracking-wide">
              شناسه (خودکار)
            </label>
            <div
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-soft text-text-soft text-sm font-mono"
            >
              /{slug || "category-slug"}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary text-black disabled:opacity-50 hover:opacity-90 transition-all"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <FaCheck size={11} />
              )}
              {initial ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-border text-text-muted hover:bg-surface-hover transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        dir="rtl"
        className="w-full max-w-sm mx-4 bg-surface rounded-2xl shadow-2xl border border-border p-6 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <FaTrashAlt className="text-danger" size={16} />
        </div>
        <h3 className="text-base font-semibold text-text mb-1">
          حذف دسته‌بندی؟
        </h3>
        <p className="text-sm text-text-muted mb-6">
          آیا از حذف این دسته‌بندی مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-danger hover:opacity-90 text-white transition-all"
          >
            بله، حذف شود
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-border text-text-muted hover:bg-surface-hover transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("خطا در بارگذاری دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (name: string, slug: string) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (!res.ok) throw new Error();
      await fetchCategories();
      setShowAddModal(false);
      toast.success("دسته‌بندی ایجاد شد");
    } catch {
      toast.error("خطا در ایجاد دسته‌بندی");
    }
  };

  const handleEdit = async (name: string, slug: string) => {
    if (!editingCategory) return;
    try {
      const res = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (!res.ok) throw new Error();
      await fetchCategories();
      setEditingCategory(null);
      toast.success("دسته‌بندی ویرایش شد");
    } catch {
      toast.error("خطا در ویرایش دسته‌بندی");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/categories/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c._id !== deletingId));
      toast.success("دسته‌بندی حذف شد");
    } catch {
      toast.error("خطا در حذف دسته‌بندی");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div dir="rtl" className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            دسته‌بندی‌های محتوای سایت را مدیریت کنید
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black text-sm font-semibold rounded-xl hover:opacity-90 transition-all flex-shrink-0"
        >
          <FaPlus size={11} />
          افزودن دسته‌بندی جدید
        </button>
      </div>

      {/* Search + stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <FaSearch
            size={12}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-soft"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در دسته‌بندی‌ها..."
            className="w-full pr-9 pl-3.5 py-2 rounded-xl border border-border bg-surface text-sm text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right"
          />
        </div>
        {!loading && (
          <span className="text-xs text-text-soft">
            {filtered.length} دسته‌بندی
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          filtered.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onEdit={setEditingCategory}
              onDelete={setDeletingId}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <CategoryModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}
      {editingCategory && (
        <CategoryModal
          initial={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleEdit}
        />
      )}
      {deletingId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
