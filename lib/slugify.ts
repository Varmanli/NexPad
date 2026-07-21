/**
 * A blog slug is deliberately not a conventional URL slug.  It is the exact
 * stored title, which keeps Persian, Unicode, whitespace, and punctuation
 * intact.  URL encoding happens only at the routing boundary.
 */
export function slugify(title: string): string {
  return title.trim();
}

/** Decode a route parameter once. Next normally supplies decoded params, but
 * this also handles params passed through a pre-encoded client href. */
export function decodeBlogParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Encode a slug exactly once, including when a caller accidentally passes an
 * already encoded route segment. */
export function encodeBlogSegment(value: string): string {
  return encodeURIComponent(decodeBlogParam(value));
}

export function blogPath(slug: string): string {
  return `/blogs/${encodeBlogSegment(slug)}`;
}

export function blogApiPath(slug: string): string {
  return `/api/blogs/${encodeBlogSegment(slug)}`;
}
