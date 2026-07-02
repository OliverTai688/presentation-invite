import type { InvitationContent } from "./invitation-content";
import { getEmailConfigStatus } from "./mailer";
import {
  getStorageMode,
  hasPersistentStorageConfig,
} from "./storage";

export type SystemCheck = {
  key: string;
  label: string;
  ok: boolean;
  required: boolean;
  detail: string;
};

export type SystemStatus = {
  checks: SystemCheck[];
  readyRequiredCount: number;
  totalRequiredCount: number;
  readyRecommendedCount: number;
  totalRecommendedCount: number;
  storageMode: "upstash" | "local";
};

export function getSystemStatus(content: InvitationContent): SystemStatus {
  const email = getEmailConfigStatus();
  const storageMode = getStorageMode();
  const organizerEmailConfigured = Boolean(
    content.organizerEmail || process.env.ORGANIZER_EMAIL,
  );

  const checks: SystemCheck[] = [
    {
      key: "gmail",
      label: "Gmail SMTP",
      ok: email.gmailConfigured,
      required: true,
      detail: email.gmailConfigured
        ? "GMAIL_USER 與 GMAIL_APP_PASSWORD 已設定"
        : "需設定 GMAIL_USER 與 GMAIL_APP_PASSWORD",
    },
    {
      key: "organizerEmail",
      label: "主辦方收件 Email",
      ok: organizerEmailConfigured,
      required: true,
      detail: organizerEmailConfigured
        ? "可寄送報名留存通知"
        : "需設定 ORGANIZER_EMAIL 或在 admin 填寫主辦方 Email",
    },
    {
      key: "siteUrl",
      label: "SITE_URL",
      ok: Boolean(process.env.SITE_URL),
      required: true,
      detail: process.env.SITE_URL
        ? "部署網址已設定"
        : "部署到 Vercel 後請設定 SITE_URL",
    },
    {
      key: "linkedin",
      label: "LinkedIn URL",
      ok: Boolean(content.linkedinUrl),
      required: false,
      detail: content.linkedinUrl
        ? "公開頁會顯示 LinkedIn 連結"
        : "可在 admin 補上最終 LinkedIn URL",
    },
    {
      key: "adminPassword",
      label: "Admin Password Env",
      ok: Boolean(process.env.INVITATION_ADMIN_PASSWORD),
      required: false,
      detail: process.env.INVITATION_ADMIN_PASSWORD
        ? "已使用環境變數覆蓋預設密碼"
        : "目前會使用原型預設密碼 123456",
    },
    {
      key: "persistentStorage",
      label: "Vercel 持久化",
      ok: hasPersistentStorageConfig(),
      required: false,
      detail:
        storageMode === "upstash"
          ? "Upstash Redis / Vercel KV 已設定"
          : "未設定 KV 時，Vercel serverless 不保證 admin 編輯與報名列表持久保存",
    },
  ];

  const requiredChecks = checks.filter((check) => check.required);
  const recommendedChecks = checks.filter((check) => !check.required);

  return {
    checks,
    readyRequiredCount: requiredChecks.filter((check) => check.ok).length,
    totalRequiredCount: requiredChecks.length,
    readyRecommendedCount: recommendedChecks.filter((check) => check.ok).length,
    totalRecommendedCount: recommendedChecks.length,
    storageMode,
  };
}
