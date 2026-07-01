/**
 * Backfill slugs for existing blog posts that have no slug or an invalid one.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/backfill-slugs.ts
 *
 * Or with tsx:
 *   npx tsx scripts/backfill-slugs.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Inline slug generator (avoids importing Next.js modules)
const persianMap: Record<string, string> = {
  آ: "a", ا: "a", أ: "a", إ: "a", ب: "b", پ: "p", ت: "t", ث: "s",
  ج: "j", چ: "ch", ح: "h", خ: "kh", د: "d", ذ: "z", ر: "r", ز: "z",
  ژ: "zh", س: "s", ش: "sh", ص: "s", ض: "z", ط: "t", ظ: "z", ع: "a",
  غ: "gh", ف: "f", ق: "gh", ک: "k", گ: "g", ل: "l", م: "m", ن: "n",
  و: "v", ه: "h", ی: "y", ئ: "y", ء: "", ة: "h", ؤ: "v",
  "ـ": "", "ً": "", "ٌ": "", "ٍ": "", "َ": "",
  "ُ": "", "ِ": "", "ّ": "", "ْ": "",
  "‌": "-", "‍": "",
};

function slugify(text: string): string {
  let s = text.trim().toLowerCase();
  for (const [char, latin] of Object.entries(persianMap)) {
    s = s.split(char).join(latin);
  }
  s = s.replace(/[\s_/\\]+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  s = s.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  return s || "post";
}

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    content: mongoose.Schema.Types.Mixed,
    author: String,
    tags: [String],
    category: mongoose.Schema.Types.ObjectId,
    coverImage: String,
    views: Number,
  },
  { timestamps: true }
);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const Blog =
    mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

  const posts = (await Blog.find({}).lean()) as unknown as Array<{
    _id: mongoose.Types.ObjectId;
    title: string;
    slug?: string;
  }>;
  console.log(`Found ${posts.length} posts`);

  const slugCounts: Record<string, number> = {};
  let updated = 0;
  let skipped = 0;

  // First pass: collect existing valid slugs so we don't collide with them
  const existingSlugs = new Set<string>();
  for (const post of posts) {
    if (post.slug && /^[a-z0-9-]+$/.test(post.slug)) {
      existingSlugs.add(post.slug);
    }
  }

  for (const post of posts) {
    const isValidSlug =
      post.slug &&
      /^[a-z0-9-]+$/.test(post.slug) &&
      post.slug !== post.title; // old code set slug = title

    if (isValidSlug) {
      skipped++;
      continue;
    }

    const base = slugify(post.title);
    slugCounts[base] = (slugCounts[base] || 0) + 1;

    let slug = base;
    if (slugCounts[base] > 1) {
      slug = `${base}-${slugCounts[base]}`;
    }

    // If still collides with an existing valid slug, increment further
    while (existingSlugs.has(slug)) {
      slugCounts[base] = (slugCounts[base] || 0) + 1;
      slug = `${base}-${slugCounts[base]}`;
    }

    existingSlugs.add(slug);

    await Blog.updateOne({ _id: post._id }, { $set: { slug } });
    console.log(`  ✓ "${post.title}" → "${slug}"`);
    updated++;
  }

  console.log(`\nDone: ${updated} updated, ${skipped} already had valid slugs`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
