import { getInvitationContent, saveInvitationContent } from "@/lib/storage";
import { validateInvitationContent } from "@/lib/validation";

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
  return Response.json(content);
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateInvitationContent(body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  await saveInvitationContent(result.value);
  return Response.json({ ok: true });
}
