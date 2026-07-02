import {
  adminCookieName,
  adminCookieValue,
  getAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { parseJsonRequest } from "@/lib/validation";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ authenticated: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
  const payload = await parseJsonRequest(request);
  const password =
    payload && typeof payload === "object" && "password" in payload
      ? String(payload.password)
      : "";

  if (password !== getAdminPassword()) {
    return Response.json({ error: "密碼不正確。" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ authenticated: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);

  return Response.json({ authenticated: false });
}
