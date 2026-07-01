import { notFound, redirect } from "next/navigation";
import { Types } from "mongoose";
import BlogPostClient from "./BlogPostClient";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  category?: string;
  createdAt?: string;
}

interface Category {
  _id: string;
  name: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL;

async function getBlogByParam(param: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${BASE}/api/blogs/${param}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getCategory(id: string): Promise<Category | null> {
  try {
    const res = await fetch(`${BASE}/api/categories/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlogByParam(params.slug);
  if (!blog) return {};

  return {
    title: blog.title,
    alternates: { canonical: `${BASE}/blogs/${blog.slug}` },
    openGraph: {
      title: blog.title,
      url: `${BASE}/blogs/${blog.slug}`,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlogByParam(params.slug);
  if (!blog) return notFound();

  // If this was an old ObjectId URL and the blog has a proper slug, redirect permanently
  if (
    Types.ObjectId.isValid(params.slug) &&
    blog.slug &&
    blog.slug !== params.slug
  ) {
    redirect(`/blogs/${blog.slug}`);
  }

  let categoryName: string | null = null;
  if (blog.category) {
    const category = await getCategory(blog.category);
    categoryName = category?.name ?? null;
  }

  return <BlogPostClient blog={blog} categoryName={categoryName} />;
}
