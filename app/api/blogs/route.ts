import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";
import { generateUniqueSlug } from "@/lib/slugify";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
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

    const slug = await generateUniqueSlug(body.title);
    const blog = await Blog.create({ ...body, slug });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "مشکل در ایجاد بلاگ" }, { status: 500 });
  }
}
