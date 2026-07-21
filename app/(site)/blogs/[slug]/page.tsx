import { notFound, redirect } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { blogApiPath, blogPath, decodeBlogParam } from "@/lib/slugify";

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
    const res = await fetch(`${BASE}${blogApiPath(param)}`, {
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
  const slug = decodeBlogParam(params.slug);
  const blog = await getBlogByParam(slug);
  if (!blog) return {};

  return {
    title: blog.title,
    alternates: { canonical: `${BASE}${blogPath(blog.slug)}` },
    openGraph: {
      title: blog.title,
      url: `${BASE}${blogPath(blog.slug)}`,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeBlogParam(params.slug);
  const blog = await getBlogByParam(slug);
  if (!blog) return notFound();

  // ObjectId and historic slugs resolve, then move visitors to the canonical
  // URL whose decoded segment exactly equals the current title.
  if (blog.slug && blog.slug !== slug) {
    redirect(blogPath(blog.slug));
  }

  let categoryName: string | null = null;
  if (blog.category) {
    const category = await getCategory(blog.category);
    categoryName = category?.name ?? null;
  }

  return <BlogPostClient blog={blog} categoryName={categoryName} />;
}
