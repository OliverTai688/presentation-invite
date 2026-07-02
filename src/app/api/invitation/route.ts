import { getInvitationContent, getStorageMode } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const content = await getInvitationContent();

  return Response.json({
    content,
    storageMode: getStorageMode(),
  });
}
