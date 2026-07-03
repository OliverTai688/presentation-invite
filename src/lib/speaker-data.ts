export type SpeakerExperience = {
  title: string;
  company: string;
  period: string;
  location?: string;
  highlights?: string[];
};

export type SpeakerEducation = {
  school: string;
  degree: string;
  period: string;
};

export type SpeakerProfile = {
  name: string;
  headline: string;
  company: string;
  about: string;
  experiences: SpeakerExperience[];
  education?: SpeakerEducation[];
};

// Sourced from https://www.linkedin.com/in/olivertai/ (profile PDF export).
// Keep this in sync with LinkedIn manually — there is no API access to pull it live.
export const speakerData = {
  zh: {
    name: "戴宇星 (Yu-Hsin Tai)",
    headline: "YZedtech 創辦人｜CTO as a Service 合作夥伴",
    company: "YZedtech Ltd.（圓展教育科技有限公司）",
    about:
      "嗨，我是戴宇星，YZedtech 創辦人，也以 CTO as a Service 的角色，協助企業與團隊把商業構想變成真正能上線運作的數位系統。\n\n專長橫跨全端開發、產品設計與 AI 應用，曾為教育、活動、顧問等產業打造報名系統、會員平台、自動化流程與 AI 導入方案。\n\n目前專注用 AI 幫助中小企業與專業人士提升效率、被更多人看見。很期待透過 BNI 認識更多夥伴，一起聊聊如何用科技和 AI 讓專業被看見、被信任。",
    experiences: [
      {
        title: "CTO as a Service 合作夥伴／全端技術負責人",
        company: "nuva",
        period: "2024年6月 – 至今",
        location: "台北市",
        highlights: [
          "擔任 nuva 的全端工程師與 CTO 層級技術部署夥伴，支援 AI 教育、活動體驗與數位服務平台的開發。",
          "打造並上線 nuvaClub、LINE 活動體驗、AI SAGA 相關流程，以及對外的數位學習服務核心系統。",
          "開發活動報名、QR 票證、金流證明、後台管理儀表板、CRM 相關功能、電商模組、AI 分身展示、n8n 自動化與 TapPay 金流串接。",
          "同時支援 B2B 企業培訓與 B2C 課程／活動營運，將商業與教育需求轉化為可運作的全端系統。",
          "建立涵蓋前端、後端、資料庫、自動化與雲端部署的技術基礎架構，協助 nuva 從活動型體驗迭代至可規模化的 AI 學習產品。",
          "參與 meetnuva.com 與 nuva 整體 AI 教育生態系的技術基礎建設，包含 nuvaClub、AI SAGA、學習課程、工作坊與社群體驗。",
        ],
      },
      {
        title: "執行長",
        company: "YZedtech Ltd.（圓展教育科技有限公司）",
        period: "2023年1月 – 至今",
        location: "台北市",
        highlights: [
          "主導 YZedtech Ltd. 的策略方向與營運規劃，這是一間先驅型的教育科技公司。",
          "協助將傳統職涯資料數位化建置資料庫，透過線上平台與數據儀表板，將報表產出時間縮短 90%。",
          "與教育機構、科技公司及研究單位建立策略合作關係，擴大產品服務範疇與市場觸及。",
        ],
      },
      {
        title: "軟體專案經理",
        company: "Tempest Digital Co., Ltd.",
        period: "2020年5月 – 2022年5月",
        location: "桃園市",
        highlights: [
          "主導線上人才媒合展覽平台的設計，並應用於 3 種使用情境與 12 場線上活動。",
          "建立並優化營運流程，包含流程自動化，將團隊效率提升 56%，專案交付時間縮短 48%。",
          "帶領 8 人的敏捷團隊進行日常營運，主持 Sprint 規劃、每日站會與回顧會議，將團隊生產力提升 50%。",
        ],
      },
    ],
    education: [
      {
        school: "國立中央大學",
        degree: "通訊工程學系 學士",
        period: "2016年9月 – 2020年6月",
      },
    ],
  } as SpeakerProfile,
  en: {
    name: "Yu-Hsin Tai",
    headline: "Founder at YZedtech ｜ CTO as a Service partner",
    company: "YZedtech Ltd.",
    about:
      "Hi, I'm Yu-Hsin Tai — founder of YZedtech and a CTO as a Service partner. I help businesses and teams turn ideas into digital systems that actually work.\n\nMy background spans full-stack development, product design, and AI applications — building registration systems, membership platforms, automation workflows, and AI adoption projects for education, events, and consulting.\n\nToday I focus on helping SMEs and professionals use AI to work smarter and get seen. Looking forward to connecting through BNI and exploring how technology and AI can help our expertise be seen and trusted.",
    experiences: [
      {
        title: "CTO as a Service Partner / Full-Stack Technical Lead",
        company: "nuva",
        period: "June 2024 – Present",
        location: "Taipei City",
        highlights: [
          "Served as a Full-stack Engineer and CTO-level technical deployment partner for nuva, supporting the development of AI education, event experience, and digital service platforms.",
          "Built and deployed core product systems for nuvaClub, LINE-based event experiences, AI SAGA-related workflows, and public-facing digital learning services.",
          "Developed event registration, QR ticketing, payment proof, admin dashboards, CRM-related functions, e-commerce modules, AI avatar demos, n8n automation, and TapPay payment integration.",
          "Supported both B2B corporate training and B2C course/event operations by translating business and educational requirements into working full-stack systems.",
          "Established technical infrastructure across frontend, backend, database, automation, and cloud deployment layers, enabling nuva to iterate from event-based experiences toward scalable AI learning products.",
          "Contributed to the technical foundation behind meetnuva.com and nuva's broader AI education ecosystem, including nuvaClub, AI SAGA, learning programs, workshops, and community-based experiences.",
        ],
      },
      {
        title: "Chief Executive Officer",
        company: "YZedtech Ltd.",
        period: "January 2023 – Present",
        location: "Taipei City, Taiwan",
        highlights: [
          "Spearheaded the strategic vision and operational direction of YZedtech Ltd., a pioneering educational technology firm.",
          "Collaborated to digitize traditional career data into a database, achieving a 90% reduction in report generation time through online platforms and data dashboards.",
          "Established strategic partnerships with educational institutions, tech firms, and research organizations to enhance product offerings and market reach.",
        ],
      },
      {
        title: "Software Project Manager",
        company: "Tempest Digital Co., Ltd.",
        period: "May 2020 – May 2022",
        location: "Taoyuan City, Taiwan",
        highlights: [
          "Spearheaded the design of an online talent matchmaking exhibition platform and applied it across 3 use cases and 12 online events.",
          "Established and optimized operational processes, including workflow automation, which enhanced team efficiency by 56% and reduced project delivery times by 48%.",
          "Guided an Agile team of 8 members in daily operations, facilitating sprint planning, stand-ups, and retrospectives to improve team productivity by 50%.",
        ],
      },
    ],
    education: [
      {
        school: "National Central University",
        degree: "Bachelor of Science, Telecommunications Engineering",
        period: "September 2016 – June 2020",
      },
    ],
  } as SpeakerProfile,
};
