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

export function slugify(text: string): string {
  let s = text.trim().toLowerCase();

  // Replace Persian/Arabic characters
  for (const [char, latin] of Object.entries(persianMap)) {
    s = s.split(char).join(latin);
  }

  // Spaces and separators → hyphens
  s = s.replace(/[\s_/\\]+/g, "-");

  // Strip anything that's not alphanumeric or hyphen
  s = s.replace(/[^a-z0-9-]/g, "");

  // Collapse multiple hyphens, trim edges
  s = s.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");

  return s || "post";
}

import Blog from "@/models/Blog";
import { Types } from "mongoose";

export async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const existing = await Blog.findOne(query).lean();
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
