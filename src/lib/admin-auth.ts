import { cookies } from "next/headers";

export const adminCookieName = "invitation-admin-session";

export function getAdminPassword(): string {
  return process.env.INVITATION_ADMIN_PASSWORD || "123456";
}

export function adminCookieValue(): string {
  // A simple signed token: base64 of "admin:<password>"
  return Buffer.from(`admin:${getAdminPassword()}`).toString("base64");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(adminCookieName);
    if (!session) return false;
    return session.value === adminCookieValue();
  } catch {
    return false;
  }
}
