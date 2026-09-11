// Types and default values for the invitation content system.

export type InvitationContent = {
  eventTitle: string;
  chapterName: string;
  eventDate: string;
  eventTime: string;
  /** ISO 8601 with offset, e.g. 2026-09-17T06:30:00+08:00 — powers the calendar buttons. */
  startAt: string;
  endAt: string;
  speakerName: string;
  speakerCompany: string;
  speakerRoles: string;
  topic: string;
  tagline: string;
  description: string;
  highlights: string[];
  speakerBio: string;
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
  eventTitle: "靜奢之境",
  chapterName: "BNI 臺北北區長冠軍分會",
  eventDate: "2026 年 9 月 17 日（週四）",
  eventTime: "AM 06:30 – 08:30",
  startAt: "2026-09-17T06:30:00+08:00",
  endAt: "2026-09-17T08:30:00+08:00",
  speakerName: "黃嘉琪",
  speakerCompany: "睿琪有限公司",
  speakerRoles: "執行長",
  topic: "靜奢之境：霽雲的精品之路，與頂層生活圈的共創",
  tagline: "燕窩不僅是滋補品，而是個人品味與極致講究的延伸。",
  description:
    "從一盞燕窩開始，談精品如何走進頂層生活圈：品味的門檻、信任的建立，以及品牌與客戶共創的方式。",
  highlights: [
    "源自大馬 2% 頂規原盞",
    "台灣唯一雙重無塵室精密生產",
    "純淨無染，定義燕窩新標竿",
  ],
  speakerBio:
    "睿琪有限公司執行長，精品燕窩品牌「霽雲」創辦經營者。以大馬 2% 頂規原盞為選料標準，於台灣唯一雙重無塵室完成精密生產，堅持純淨無染的製程。她將燕窩從傳統滋補品重新定位為靜奢生活的一部分，並與室內設計、藝術、茶道、花藝等領域共創頂層生活圈的品味場景。",
  locationName: "台北漢普頓酒店",
  locationAddress: "台北市中山區建國北路二段 7 號 2F",
  fee: "1,000 元",
  notes: [
    "請攜帶 100 張以上名片",
    "請著正式服裝出席",
    "附設停車場",
    "會議 AM 06:30 開始，建議提前 15 分鐘抵達",
  ],
  referralAudience: "室內設計師／藝廊／藝術家／茶師／花藝老師",
  posterImagePath: "/poster.jpg",
  linkedinUrl: "",
  meetNuvaUrl: "https://app.meetnuva.com",
  couponTitle: "來賓專屬邀請禮遇",
  couponDescription:
    "出示此邀請序號完成現場報到，並可於會後領取霽雲來賓禮遇。",
  organizerEmail: "",
};
