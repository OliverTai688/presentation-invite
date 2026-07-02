import crypto from "crypto";
import { cookies } from "next/headers";

export const adminCookieName = "bni_invitation_admin";

export function getAdminPassword() {
  return process.env.INVITATION_ADMIN_PASSWORD || "123456";
}

export function adminCookieValue() {
  return crypto
    .createHmac("sha256", getAdminPassword())
    .update("bni-invitation-admin")
    .digest("hex");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === adminCookieValue();
}
