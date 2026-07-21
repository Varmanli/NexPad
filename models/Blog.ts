import { Schema, model, models, Document, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  legacySlugs: string[];
  content: string | any;
  author?: string;
  tags?: string[];
  category: Types.ObjectId;
  coverImage?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    // Blog slugs are an exact copy of title. Do not lowercase, transliterate,
    // or otherwise normalize this value.
    slug: { type: String, required: true, unique: true },
    // Allows old generated URLs and URLs from a previous title to redirect.
    legacySlugs: { type: [String], default: [] },
    content: { type: Schema.Types.Mixed, required: true },
    author: { type: String, default: "ناشناس" },
    tags: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    coverImage: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Keep the invariant true even when a Blog document is saved outside the API.
BlogSchema.pre("validate", function () {
  const title = this.title?.trim();
  if (!title) return;

  const previousSlug = this.slug;
  this.title = title;
  this.slug = title;

  if (previousSlug && previousSlug !== title) {
    this.legacySlugs = Array.from(
      new Set([...(this.legacySlugs || []), previousSlug])
    );
  }
});

const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);
export default Blog;
