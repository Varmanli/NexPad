/** Synchronize every Blog.slug to its current title without losing old URLs.
 *
 * Usage: npx tsx scripts/backfill-slugs.ts
 * The script is intentionally two-phase because the unique slug index can
 * otherwise reject swaps (for example, post A's old slug is post B's title).
 */
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    legacySlugs: { type: [String], default: [] },
  },
  { strict: false, timestamps: true }
);

type Post = {
  _id: mongoose.Types.ObjectId;
  title?: string;
  slug?: string;
  legacySlugs?: string[];
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");

  await mongoose.connect(uri);
  const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
  const posts = (await Blog.find({}).lean()) as unknown as Post[];

  const invalid = posts.filter((post) => !post.title?.trim());
  if (invalid.length) {
    throw new Error(`${invalid.length} blog post(s) have an empty title and cannot receive an exact-title slug.`);
  }

  const titles = posts.map((post) => post.title!.trim());
  const duplicateTitles = titles.filter((title, index) => titles.indexOf(title) !== index);
  if (duplicateTitles.length) {
    throw new Error(
      `Duplicate titles cannot satisfy both an exact-title slug and the unique slug index: ${Array.from(new Set(duplicateTitles)).join(", ")}`
    );
  }

  const changes = posts.filter((post) => post.slug !== post.title!.trim());
  if (!changes.length) {
    console.log(`All ${posts.length} blog slugs already match their titles.`);
    return;
  }

  // Move changed values out of the unique index namespace first.
  await Blog.bulkWrite(
    changes.map((post) => ({
      updateOne: {
        filter: { _id: post._id },
        update: { $set: { slug: `__slug_migration_${post._id}` } },
      },
    }))
  );

  await Blog.bulkWrite(
    changes.map((post) => {
      const title = post.title!.trim();
      const legacySlugs = Array.from(
        new Set([...(post.legacySlugs || []), ...(post.slug ? [post.slug] : [])])
      ).filter((slug) => slug && slug !== title);
      return {
        updateOne: {
          filter: { _id: post._id },
          update: { $set: { title, slug: title, legacySlugs } },
        },
      };
    })
  );

  console.log(`Synchronized ${changes.length} of ${posts.length} blog slugs; old slugs were retained as redirects.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
