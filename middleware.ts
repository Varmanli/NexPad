import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_API_MUTATE = [
  "/api/blogs",
  "/api/categories",
  "/api/messages",
  "/api/stats",
];

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

function secret() {
  return new TextEncoder().encode(JWT_SECRET);
}

async function getRole(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

function isPrivileged(role: string | null) {
  return role === "admin" || role === "owner";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get("token")?.value;

  // ── dashboard pages ──────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    const role = await getRole(token);
    if (!isPrivileged(role)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // ── admin API mutations ──────────────────────────────────────────────────
  const isAdminApi = ADMIN_API_MUTATE.some((r) => pathname.startsWith(r));
  if (isAdminApi && method !== "GET") {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = await getRole(token);
    if (!isPrivileged(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/blogs/:path*",
    "/api/categories/:path*",
    "/api/messages/:path*",
    "/api/stats",
  ],
};
