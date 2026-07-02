import {
  defaultInvitationContent,
  type InvitationContent,
} from "./invitation-content";

export type RegistrationInput = {
  name: string;
  lineId: string;
  email: string;
  referrerName: string;
  source: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMultiline(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function cleanUrl(value: unknown, maxLength = 300) {
  const text = cleanText(value, maxLength);

  if (!text) {
    return "";
  }

  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

export async function parseJsonRequest(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function validateRegistrationInput(
  input: unknown,
): ValidationResult<RegistrationInput> {
  const payload =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const name = cleanText(payload.name, 80);
  const lineId = cleanText(payload.lineId, 80);
  const email = cleanText(payload.email, 160).toLowerCase();
  const referrerName = cleanText(payload.referrerName ?? payload.referrer, 80);
  const source = cleanText(payload.source, 80) || "public-invitation";

  if (name.length < 2) {
    return { ok: false, error: "請填寫報名姓名。" };
  }

  if (lineId.length < 2) {
    return { ok: false, error: "請填寫 LINE ID。" };
  }

  if (!emailPattern.test(email)) {
    return { ok: false, error: "請填寫可接收確認信的 Email。" };
  }

  return {
    ok: true,
    value: {
      name,
      lineId,
      email,
      referrerName,
      source,
    },
  };
}

export function validateInvitationContent(
  input: unknown,
): ValidationResult<InvitationContent> {
  const payload =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const notesValue = Array.isArray(payload.notes)
    ? payload.notes
    : cleanMultiline(payload.notes, 500)
        .split("\n")
        .map((note) => note.trim())
        .filter(Boolean);

  const content: InvitationContent = {
    eventTitle: cleanText(payload.eventTitle, 120),
    chapterName: cleanText(payload.chapterName, 120),
    eventDate: cleanText(payload.eventDate, 40),
    eventTime: cleanText(payload.eventTime, 60),
    speakerName: cleanText(payload.speakerName, 80),
    speakerCompany: cleanText(payload.speakerCompany, 120),
    speakerRoles: cleanText(payload.speakerRoles, 160),
    topic: cleanText(payload.topic, 80),
    description: cleanText(payload.description, 220),
    locationName: cleanText(payload.locationName, 120),
    locationAddress: cleanText(payload.locationAddress, 180),
    fee: cleanText(payload.fee, 40),
    notes: notesValue
      .map((note) => cleanText(note, 80))
      .filter(Boolean)
      .slice(0, 8),
    referralAudience: cleanText(payload.referralAudience, 160),
    posterImagePath:
      cleanText(payload.posterImagePath, 220) ||
      defaultInvitationContent.posterImagePath,
    linkedinUrl: cleanUrl(payload.linkedinUrl),
    meetNuvaUrl:
      cleanUrl(payload.meetNuvaUrl) || defaultInvitationContent.meetNuvaUrl,
    couponTitle: cleanText(payload.couponTitle, 100),
    couponDescription: cleanText(payload.couponDescription, 260),
    organizerEmail: cleanText(payload.organizerEmail, 160).toLowerCase(),
  };

  if (!content.eventTitle || !content.speakerName || !content.topic) {
    return { ok: false, error: "活動標題、講者姓名與主題為必填。" };
  }

  if (content.organizerEmail && !emailPattern.test(content.organizerEmail)) {
    return { ok: false, error: "主辦方 Email 格式不正確。" };
  }

  if (content.notes.length === 0) {
    content.notes = defaultInvitationContent.notes;
  }

  return { ok: true, value: content };
}
