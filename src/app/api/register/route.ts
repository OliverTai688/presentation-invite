import { getInvitationContent, saveRegistration, getStorageMode } from "@/lib/storage";
import { sendRegistrationEmails } from "@/lib/mailer";
import { parseJsonRequest, validateRegistrationInput } from "@/lib/validation";
import type { Registration } from "@/lib/invitation-content";

export const runtime = "nodejs";

function makeCouponCode(name: string, lineId: string) {
  const seed = `${name}:${lineId}:${Date.now()}`;
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return `AI2026-${Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padEnd(6, "0")}`;
}

export async function POST(request: Request) {
  const payload = await parseJsonRequest(request);
  const validation = validateRegistrationInput(payload);

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const content = await getInvitationContent();
  const input = validation.value;
  const registration: Registration = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: input.name,
    lineId: input.lineId,
    email: input.email,
    referrerName: input.referrerName,
    couponCode: makeCouponCode(input.name, input.lineId),
    source: input.source,
  };

  await saveRegistration(registration);

  try {
    const emailResult = await sendRegistrationEmails(content, registration);

    return Response.json({
      registration,
      coupon: {
        title: content.couponTitle,
        description: content.couponDescription,
        code: registration.couponCode,
      },
      email: emailResult,
      storageMode: getStorageMode(),
    });
  } catch (error) {
    console.error("Failed to send registration email", error);

    return Response.json(
      {
        registration,
        coupon: {
          title: content.couponTitle,
          description: content.couponDescription,
          code: registration.couponCode,
        },
        email: {
          configured: true,
          organizerEmailSent: false,
          attendeeEmailSent: false,
        },
        storageMode: getStorageMode(),
        warning:
          "報名已儲存，但 Email 寄送失敗。請檢查 Gmail 應用程式密碼與環境變數。",
      },
      { status: 202 },
    );
  }
}
