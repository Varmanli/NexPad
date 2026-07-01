import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/** Returns whether an owner/admin already exists. Used by the setup page. */
export async function GET() {
  try {
    await connectDB();
    const exists = await User.exists({ role: { $in: ["owner", "admin"] } });
    return NextResponse.json({ initialized: !!exists });
  } catch {
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}

/** Creates the one-and-only owner account. Locked once any admin/owner exists. */
export async function POST(req: Request) {
  try {
    await connectDB();

    // guard: only allowed if no admin/owner exists yet
    const exists = await User.exists({ role: { $in: ["owner", "admin"] } });
    if (exists) {
      return NextResponse.json(
        { error: "سیستم قبلاً راه‌اندازی شده است." },
        { status: 403 }
      );
    }

    let body: { email?: unknown; password?: unknown; name?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "درخواست نامعتبر." }, { status: 400 });
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
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۸ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ email, password: hashed, role: "owner" });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
