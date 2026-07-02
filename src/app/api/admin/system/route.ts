import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSystemStatus } from "@/lib/system-status";
import { getInvitationContent } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getInvitationContent();

  return Response.json(getSystemStatus(content));
}
