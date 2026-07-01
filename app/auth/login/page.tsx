"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    fetch("/api/auth/setup")
      .then((r) => r.json())
      .then((d) => {
        if (!d.initialized) setNeedsSetup(true);
      })
      .catch(() => {})
      .finally(() => setCheckingSetup(false));
  }, []);

  function clearError() {
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "خطایی رخ داد. دوباره تلاش کنید.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("اتصال به سرور برقرار نشد. اینترنت خود را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
  }

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* subtle background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* card */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border p-8">
          {/* logo / title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <FaLock className="text-primary" size={22} />
            </div>
            <h1 className="text-2xl font-bold text-text">
              ورود به پنل مدیریت
            </h1>
            <p className="text-sm text-text-muted mt-1">NexPad Admin</p>
          </div>

          {/* setup banner */}
          {needsSetup && (
            <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 text-sm text-warning">
              <p className="font-semibold mb-1">حساب مدیر وجود ندارد</p>
              <p>
                برای اولین استفاده، ابتدا{" "}
                <Link
                  href="/auth/setup"
                  className="underline font-medium hover:no-underline"
                >
                  حساب مالک را ایجاد کنید
                </Link>
                .
              </p>
            </div>
          )}

          {/* error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30">
              <span className="text-danger mt-0.5 shrink-0">✕</span>
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* email */}
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                آدرس ایمیل
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft"
                  size={15}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  className="w-full pr-10 pl-4 py-2.5 text-sm rounded-xl border border-border bg-surface-soft text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                رمز عبور
              </label>
              <div className="relative">
                <FaLock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft"
                  size={14}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pr-10 pl-10 py-2.5 text-sm rounded-xl border border-border bg-surface-soft text-text placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text-muted transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-primary text-black hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  در حال ورود...
                </>
              ) : (
                "ورود به داشبورد"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-soft mt-6">
          دسترسی فقط برای مدیران مجاز است
        </p>
      </div>
    </div>
  );
}
