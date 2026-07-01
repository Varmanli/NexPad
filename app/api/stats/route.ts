import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Message from "@/models/Message";

export async function GET() {
  try {
    await connectDB();

    const [totalViewsAgg, totalBlogs, totalCategories, totalMessages] =
      await Promise.all([
        Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]),
        Blog.countDocuments(),
        Category.countDocuments(),
        Message.countDocuments(),
      ]);

    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    const [monthlyViewsAgg, monthlyBlogsAgg, topPosts] = await Promise.all([
      Blog.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            views: { $sum: "$views" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Blog.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Blog.find({}, { title: 1, slug: 1, views: 1 })
        .sort({ views: -1 })
        .limit(5)
        .lean(),
    ]);

    const monthlyViews = Array.from({ length: 12 }, () => 0);
    monthlyViewsAgg.forEach((item) => {
      monthlyViews[item._id.month - 1] = item.views;
    });

    const monthlyBlogs = Array.from({ length: 12 }, () => 0);
    monthlyBlogsAgg.forEach((item) => {
      monthlyBlogs[item._id.month - 1] = item.count;
    });

    return NextResponse.json({
      totalViews,
      totalBlogs,
      totalCategories,
      totalMessages,
      monthlyViews,
      monthlyBlogs,
      topPosts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در دریافت آمار" }, { status: 500 });
  }
}
