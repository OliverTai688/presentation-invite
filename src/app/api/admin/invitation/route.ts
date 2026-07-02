import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getInvitationContent, saveInvitationContent, getStorageMode } from "@/lib/storage";
import { parseJsonRequest, validateInvitationContent } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({
    content: await getInvitationContent(),
    storageMode: getStorageMode(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await parseJsonRequest(request);
  const validation = validateInvitationContent(payload);

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  await saveInvitationContent(validation.value);

  return Response.json({
    content: validation.value,
    storageMode: getStorageMode(),
  });
}
