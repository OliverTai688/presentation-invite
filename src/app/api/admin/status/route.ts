import { getInvitationContent } from "@/lib/storage";
import { getSystemStatus } from "@/lib/system-status";

export const runtime = "nodejs";

const DEFAULT_PASSWORD = "123456";

function checkAuth(request: Request): boolean {
  const pwd =
    request.headers.get("x-admin-password") ??
    new URL(request.url).searchParams.get("password") ??
    "";
  const expected =
    process.env.INVITATION_ADMIN_PASSWORD || DEFAULT_PASSWORD;
  return pwd === expected;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getInvitationContent();
  const status = getSystemStatus(content);
  return Response.json(status);
}
