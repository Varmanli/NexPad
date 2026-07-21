import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";
import { slugify } from "@/lib/slugify";

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

    if (typeof body.title !== "string" || !slugify(body.title)) {
      return NextResponse.json({ error: "title الزامی است" }, { status: 400 });
    }

    const title = slugify(body.title);
    // Deliberately discard a supplied slug: it is server controlled.
    const blog = await Blog.create({ ...body, title, slug: title });

    return NextResponse.json(blog);
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "عنوان مقاله باید یکتا باشد، چون URL دقیقاً برابر عنوان است" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "مشکل در ایجاد بلاگ" }, { status: 500 });
  }
}
