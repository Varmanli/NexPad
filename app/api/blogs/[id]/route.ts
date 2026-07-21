import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";
import { Types } from "mongoose";
import { decodeBlogParam, slugify } from "@/lib/slugify";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const slug = decodeBlogParam(params.id);
    let blog;

    if (Types.ObjectId.isValid(params.id)) {
      blog = await Blog.findById(params.id);
    }

    // Fall back to slug lookup if not found by ID or param isn't an ObjectId
    if (!blog) {
      blog = await Blog.findOne({
        $or: [{ slug }, { legacySlugs: slug }],
      });
    }

    if (!blog)
      return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "مشکل در گرفتن بلاگ" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const body: Partial<IBlog> = await req.json();
    const current = await Blog.findById(params.id);
    if (!current)
      return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });

    // slug and legacySlugs are never accepted from the client.
    delete body.slug;
    delete body.legacySlugs;

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !slugify(body.title)) {
        return NextResponse.json({ error: "title الزامی است" }, { status: 400 });
      }
      const title = slugify(body.title);
      if (title !== current.title) {
        if (current.slug && current.slug !== title) {
          current.legacySlugs = Array.from(
            new Set([...(current.legacySlugs || []), current.slug])
          );
        }
        current.title = title;
        current.slug = title;
      }
      delete body.title;
    }

    Object.assign(current, body);
    const updated = await current.save();

    if (!updated)
      return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "عنوان مقاله باید یکتا باشد، چون URL دقیقاً برابر عنوان است" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "مشکل در بروزرسانی بلاگ" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const deleted = await Blog.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });

    return NextResponse.json({ message: "پست حذف شد" });
  } catch (error) {
    return NextResponse.json({ error: "مشکل در حذف بلاگ" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(params.id);
    if (!blog)
      return NextResponse.json({ error: "پست پیدا نشد" }, { status: 404 });

    blog.views += 1;
    await blog.save();

    return NextResponse.json(blog);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در آپدیت ویو" }, { status: 500 });
  }
}
