import assert from "node:assert/strict";
import test from "node:test";
import Blog from "../models/Blog";
import { blogApiPath, blogPath, decodeBlogParam, slugify } from "../lib/slugify";

const titles = [
  "آموزش ساخت اپلیکیشن با هوش مصنوعی",
  "How to Build AI Apps",
  "A title with spaces 42",
  "Release 2.0: AI & Web #101?",
  "فارسی، English & ۱۲۳!",
];

test("every supported title is retained verbatim as its slug", () => {
  for (const title of titles) {
    assert.equal(slugify(title), title);
  }
});

test("blog routes URL-encode Unicode, spaces, and URL-reserved characters", () => {
  for (const title of titles) {
    const path = blogPath(title);
    assert.equal(decodeURIComponent(path.slice("/blogs/".length)), title);
    assert.ok(!path.slice("/blogs/".length).includes("/"));
    assert.ok(!path.includes("%25"));
  }
});

test("already encoded slugs are normalized without producing %25", () => {
  const title = "معرفی سیستم مدیریت محتوای جدید قفسه";
  const encoded = encodeURIComponent(title);
  assert.equal(blogPath(encoded), `/blogs/${encoded}`);
  assert.equal(blogApiPath(encoded), `/api/blogs/${encoded}`);
  assert.equal(decodeBlogParam(encoded), title);
});

test("model validation rejects a manually supplied slug and synchronizes title changes", async () => {
  const blog = new Blog({
    title: "  عنوان اصلی  ",
    slug: "admin-chosen-slug",
    content: "content",
    category: "507f1f77bcf86cd799439011",
  });

  await blog.validate();
  assert.equal(blog.title, "عنوان اصلی");
  assert.equal(blog.slug, "عنوان اصلی");
  assert.deepEqual(blog.legacySlugs, ["admin-chosen-slug"]);

  blog.title = "عنوان جدید";
  await blog.validate();
  assert.equal(blog.slug, "عنوان جدید");
  assert.deepEqual(blog.legacySlugs, ["admin-chosen-slug", "عنوان اصلی"]);
});
