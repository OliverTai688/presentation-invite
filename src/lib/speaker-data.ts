export type SpeakerProfile = {
  name: string;
  headline: string;
  company: string;
  about: string;
  experiences: {
    title: string;
    company: string;
  }[];
};

export const speakerData = {
  zh: {
    name: "戴宇星 (Oliver Tai)",
    headline: "執行長 / 全端工程師 / AI Agent 顧問",
    company: "圓展教育科技有限公司",
    about: "致力於教育科技領域，專注於提供數位教學設備與解決方案，協助學校與師生建立互動與協作的學習環境。擁有豐富的自主學習與創業經歷，並致力於推動 AI 時代下的教育創新與商務應用。",
    experiences: [
      { title: "執行長", company: "圓展教育科技有限公司" },
      { title: "AI Agent 顧問", company: "Freelance" },
      { title: "全端工程師", company: "Freelance" }
    ]
  } as SpeakerProfile,
  en: {
    name: "Oliver Tai",
    headline: "CEO / Full-Stack Engineer / AI Agent Consultant",
    company: "Vertex Education Technology Co., Ltd.",
    about: "Dedicated to the EdTech sector, focusing on providing digital teaching equipment and solutions to help schools and students build interactive and collaborative learning environments. Experienced in self-directed learning and entrepreneurship, committed to driving educational innovation and business applications in the AI era.",
    experiences: [
      { title: "CEO", company: "Vertex Education Technology Co., Ltd." },
      { title: "AI Agent Consultant", company: "Freelance" },
      { title: "Full-Stack Engineer", company: "Freelance" }
    ]
  } as SpeakerProfile,
};
