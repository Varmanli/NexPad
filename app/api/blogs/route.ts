import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: any = {};
    if (category && category !== "all") {
      query.category = category; // فقط بلاگ‌های دسته موردنظر
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }); // مرتب‌سازی نزولی
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "مشکل در گرفتن بلاگ‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body: Partial<IBlog> = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "title الزامی است" }, { status: 400 });
    }

    // اگر نیاز داری category یا سایر فیلدها هم ارسال بشه، همینجا اضافه کن
    const blog = await Blog.create({ ...body, slug: body.title });

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "مشکل در ایجاد بلاگ" }, { status: 500 });
  }
}
