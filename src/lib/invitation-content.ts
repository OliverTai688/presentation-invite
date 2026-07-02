export type InvitationContent = {
  eventTitle: string;
  chapterName: string;
  eventDate: string;
  eventTime: string;
  speakerName: string;
  speakerCompany: string;
  speakerRoles: string;
  topic: string;
  description: string;
  locationName: string;
  locationAddress: string;
  fee: string;
  notes: string[];
  referralAudience: string;
  posterImagePath: string;
  linkedinUrl: string;
  meetNuvaUrl: string;
  couponTitle: string;
  couponDescription: string;
  organizerEmail: string;
};

export type Registration = {
  id: string;
  createdAt: string;
  name: string;
  lineId: string;
  email: string;
  referrerName: string;
  couponCode: string;
  source: string;
};

export type RegistrationResult = {
  registration: Registration;
  organizerEmailSent: boolean;
  attendeeEmailSent: boolean;
  emailConfigured: boolean;
  storageMode: "upstash" | "local";
};

export const defaultInvitationContent: InvitationContent = {
  eventTitle: "AI 商務力｜讓專業被懂你的人看見",
  chapterName: "BNI 臺北北區長冠軍分會",
  eventDate: "2026.07.09",
  eventTime: "AM 06:30-08:30",
  speakerName: "戴宇星",
  speakerCompany: "圓展教育科技有限公司",
  speakerRoles: "執行長 / 全端工程師 / AI Agent 顧問",
  topic: "AI 商務力",
  description:
    "新商業時代，讓專業人士用 AI 被理解、被信任、被找到。",
  locationName: "台北漢普頓酒店",
  locationAddress: "臺北市中山區建國北路二段7號2F",
  fee: "1000元",
  notes: ["請攜帶100張以上名片", "請著正式服裝出席", "附設停車場"],
  referralAudience: "專業人士、企業主、AI 決策者",
  posterImagePath: "/assets/bni-invitation-poster-2026-07-09.png",
  linkedinUrl: "https://www.linkedin.com/in/olivertai/",
  meetNuvaUrl: "https://meetnuva.com/",
  couponTitle: "2026 AI 成長兌換券",
  couponDescription:
    "來參與的來賓與引薦人，皆可兌換 2026 年任一付費線上工作坊，或一小時 AI 諮詢服務。",
  organizerEmail: "",
};

export const editableInvitationFields = [
  "eventTitle",
  "chapterName",
  "eventDate",
  "eventTime",
  "speakerName",
  "speakerCompany",
  "speakerRoles",
  "topic",
  "description",
  "locationName",
  "locationAddress",
  "fee",
  "referralAudience",
  "posterImagePath",
  "linkedinUrl",
  "meetNuvaUrl",
  "couponTitle",
  "couponDescription",
  "organizerEmail",
] as const;

export function mergeInvitationContent(
  content: Partial<InvitationContent> | null | undefined,
): InvitationContent {
  return {
    ...defaultInvitationContent,
    ...content,
    notes:
      Array.isArray(content?.notes) && content.notes.length > 0
        ? content.notes
        : defaultInvitationContent.notes,
  };
}
