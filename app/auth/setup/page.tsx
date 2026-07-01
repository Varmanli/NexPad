"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

type Step = "checking" | "locked" | "form" | "done";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((d) => {
        if (d.initialized) {
          setStep("locked");
          setTimeout(() => router.replace("/auth/login"), 2500);
        } else {
          setStep("form");
        }
      })
      .catch(() => setStep("form"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) { setError("رمز عبور و تکرار آن یکسان نیستند."); return; }
    if (password.length < 8) { setError("رمز عبور باید حداقل ۸ کاراکتر باشد."); return; }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "خطایی رخ داد."); return; }

      setStep("done");
      setTimeout(() => router.replace("/auth/login"), 2000);
    } catch {
      setError("اتصال به سرور برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "checking") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-muted">بررسی وضعیت...</p>
        </div>
      </Shell>
    );
  }

  if (step === "locked") {
    return (
      <Shell>
        <div className="text-center py-8 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10 mb-2">
            <FaShieldAlt className="text-success" size={24} />
          </div>
          <p className="font-semibold text-text">سیستم قبلاً راه‌اندازی شده است</p>
          <p className="text-sm text-text-muted">در حال انتقال به صفحه ورود...</p>
        </div>
      </Shell>
    );
  }

  if (step === "done") {
    return (
      <Shell>
        <div className="text-center py-8 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10 mb-2">
            <FaShieldAlt className="text-success" size={24} />
          </div>
          <p className="font-semibold text-text">حساب مالک با موفقیت ایجاد شد!</p>
          <p className="text-sm text-text-muted">در حال انتقال به صفحه ورود...</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <FaShieldAlt className="text-primary" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-text">راه‌اندازی اولیه</h1>
        <p className="text-sm text-text-muted mt-1">
          ایجاد حساب مالک سیستم (یک‌بار انجام می‌شود)
        </p>
      </div>

      {/* info banner */}
      <div className="mb-6 p-3 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent leading-relaxed">
        این صفحه فقط یک‌بار در دسترس است. پس از ایجاد حساب مالک، این مسیر برای همیشه غیرفعال می‌شود.
      </div>

      {/* error */}
      {error && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30">
          <span className="text-danger mt-0.5 shrink-0">✕</span>
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* email */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">آدرس ایمیل</label>
          <div className="relative">
            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft" size={14} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
              autoComplete="email"
              placeholder="owner@example.com"
              disabled={isLoading}
              className="w-full pr-10 pl-4 py-2.5 text-sm rounded-xl border border-border bg-surface-soft text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition"
            />
          </div>
        </div>

        {/* password */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            رمز عبور <span className="text-xs text-text-soft">(حداقل ۸ کاراکتر)</span>
          </label>
          <div className="relative">
            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft" size={13} />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pr-10 pl-10 py-2.5 text-sm rounded-xl border border-border bg-surface-soft text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text-muted transition"
              tabIndex={-1}
            >
              {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          </div>
        </div>

        {/* confirm password */}
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">تکرار رمز عبور</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft" size={13} />
            <input
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(null); }}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pr-10 pl-4 py-2.5 text-sm rounded-xl border border-border bg-surface-soft text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-primary text-black hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              در حال ایجاد...
            </>
          ) : (
            "ایجاد حساب مالک"
          )}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-xl border border-border p-8">
        {children}
      </div>
    </div>
  );
}
