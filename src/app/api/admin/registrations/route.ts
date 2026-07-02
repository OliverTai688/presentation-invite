import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listRegistrations, getStorageMode } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    registrations: await listRegistrations(50),
    storageMode: getStorageMode(),
  });
}
