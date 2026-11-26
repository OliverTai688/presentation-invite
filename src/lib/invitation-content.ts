// Types and default values for the invitation content system.

/**
 * Identifies the current event. Storage keys are namespaced by it so a new
 * event never inherits the previous event's admin edits or registration list.
 */
export const EVENT_KEY = "2026-12-03";

export type Speaker = {
  name: string;
  role: string;
  company: string;
  bio: string;
  /** Public path to a square portrait, e.g. /speakers/ku-yu-fan.jpg. */
  photo: string;
};

export type InvitationContent = {
  eventTitle: string;
  chapterName: string;
  eventDate: string;
  eventTime: string;
  /** ISO 8601 with offset, e.g. 2026-12-03T06:30:00+08:00 — powers the calendar buttons. */
  startAt: string;
  endAt: string;
  speakers: Speaker[];
  topic: string;
  tagline: string;
  description: string;
  highlights: string[];
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

export const defaultInvitationContent: InvitationContent = {
  // NBSP keeps "從募資 2,000 萬" together; the zero-width space is the one
  // place the display title may wrap, giving two clean lines on every screen.
  eventTitle: "從募資\u00a02,000\u00a0萬\u200b到企業成長",
  chapterName: "BNI 臺北北區長冠軍分會",
  eventDate: "2026 年 12 月 3 日（四）",
  eventTime: "AM 06:30 – 08:30",
  startAt: "2026-12-03T06:30:00+08:00",
  endAt: "2026-12-03T08:30:00+08:00",
  speakers: [
    {
      name: "古又帆",
      role: "會計師",
      company: "千向曜帆合署會計師事務所",
      bio: "千向曜帆合署會計師事務所會計師。本場從財務專業出發，分享如何以商情分析與財務預測協助企業募資 2,000 萬元，並在募資後導入內控制度，讓企業成長走得穩。",
      photo: "/speakers/ku-yu-fan.jpg",
    },
    {
      name: "陳宜均",
      role: "品牌顧問",
      company: "鑫判科技股份有限公司",
      bio: "鑫判科技股份有限公司品牌顧問。本場從經營專業出發，分享如何優化營運流程與策略、協助企業進行國際合作，與財務專業攜手提升企業競爭力。",
      photo: "/speakers/chen-yi-chun.jpg",
    },
  ],
  topic: "從募資 2,000 萬到企業成長：雙顧問如何打造企業競爭力",
  tagline: "企業成長，不只靠資金，更靠經營管理。",
  description:
    "會計師與品牌顧問分享實際合作案例：從商情分析、財務預測協助企業募資 2,000 萬，到導入內控、優化營運、推動國際合作，看財務與經營雙專業如何讓企業穩健成長。",
  highlights: [
    "商情分析 × 財務預測，成功協助企業募資 2,000 萬元",
    "導入內控制度，優化營運流程與策略",
    "協助企業國際合作，財務與經營雙專業攜手",
  ],
  locationName: "台北漢普頓酒店",
  locationAddress: "臺北市中山區建國北路二段 7 號 2F",
  fee: "1,000 元",
  notes: [
    "請攜帶 60 張以上名片",
    "請著正式服裝出席",
    "附設停車場",
    "會議 AM 06:30 開始，建議提前 15 分鐘抵達",
  ],
  referralAudience: "有募資或引進投資人需求的企業主、準備擴張營運的成長型企業主",
  posterImagePath: "/poster-20261203.jpg",
  linkedinUrl: "",
  meetNuvaUrl: "",
  couponTitle: "來賓專屬邀請序號",
  couponDescription: "請於現場報到時出示此邀請序號，工作人員將為您快速完成報到。",
  organizerEmail: "",
};

/** "古又帆 × 陳宜均" — used wherever the old single speaker name appeared. */
export function speakerNames(content: Pick<InvitationContent, "speakers">) {
  return content.speakers.map((s) => s.name).filter(Boolean).join(" × ");
}

/** "古又帆 會計師、陳宜均 品牌顧問" */
export function speakerCredits(content: Pick<InvitationContent, "speakers">) {
  return content.speakers
    .filter((s) => s.name)
    .map((s) => `${s.name} ${s.role}`.trim())
    .join("、");
}

/** eventTitle without the NBSP / zero-width wrap hints — for subjects, calendars, filenames. */
export function plainTitle(content: Pick<InvitationContent, "eventTitle">) {
  return content.eventTitle.replace(/ /g, " ").replace(/​/g, "");
}
