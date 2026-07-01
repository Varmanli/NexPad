"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onAdd: (title: string) => void;
}

export default function AddLessonModal({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("نام درس نمی‌تواند خالی باشد");

    setLoading(true);
    try {
      await onAdd(title);
      setTitle("");
      setIsOpen(false);
      toast.success("درس اضافه شد");
    } catch {
      toast.error("خطا در اضافه کردن درس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:opacity-90 transition-all"
      >
        <span>افزودن درس جدید</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg border border-border">
            <h2 className="text-xl font-bold mb-4 text-text">
              افزودن درس جدید
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="نام درس"
                className="p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface-soft text-text placeholder:text-text-soft"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-soft text-text-muted hover:bg-surface-hover transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-primary text-black hover:opacity-90 transition"
                >
                  {loading ? "در حال اضافه کردن..." : "اضافه کردن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
