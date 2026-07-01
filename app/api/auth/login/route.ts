import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ── in-memory rate limiter (resets on cold start, good enough for serverless) ──
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= MAX_ATTEMPTS) return false; // blocked

  entry.count += 1;
  return true;
}

function clearRateLimit(ip: string) {
  attempts.delete(ip);
}

export async function POST(req: Request) {
  // ── rate limiting ────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "تعداد تلاش‌های ناموفق زیاد است. ۱۵ دقیقه دیگر امتحان کنید." },
      { status: 429 }
    );
  }

  // ── input validation ─────────────────────────────────────────────────────
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "آدرس ایمیل معتبر نیست." },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." },
      { status: 400 }
    );
  }

  // ── database lookup ──────────────────────────────────────────────────────
  try {
    await connectDB();

    const user = await User.findOne({ email }).select("+password +role");

    // same message for not-found and wrong-password (prevents user enumeration)
    if (!user) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    if (user.role !== "admin" && user.role !== "owner") {
      return NextResponse.json(
        { error: "این حساب دسترسی به پنل مدیریت ندارد." },
        { status: 403 }
      );
    }

    // login successful — clear rate limit for this IP
    clearRateLimit(ip);

    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "خطای سرور. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
