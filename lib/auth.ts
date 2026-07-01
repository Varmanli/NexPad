import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export interface AdminPayload {
  id: string;
  email: string;
  role: "user" | "admin" | "owner";
}

export function isPrivileged(role: string | undefined) {
  return role === "admin" || role === "owner";
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    if (!isPrivileged(payload.role)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminFromCookies(): AdminPayload | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getAdminFromRequest(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
