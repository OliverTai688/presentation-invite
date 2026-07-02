import nodemailer from "nodemailer";
import type { InvitationContent, Registration } from "./invitation-content";

export type EmailSendResult = {
  configured: boolean;
  organizerEmailSent: boolean;
  attendeeEmailSent: boolean;
};

export type EmailConfigStatus = {
  gmailUserConfigured: boolean;
  gmailAppPasswordConfigured: boolean;
  mailFromConfigured: boolean;
  gmailConfigured: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const from = process.env.MAIL_FROM || user;

  if (!user || !pass || !from) {
    return null;
  }

  return { user, pass, from };
}

export function getEmailConfigStatus(): EmailConfigStatus {
  const gmailUserConfigured = Boolean(process.env.GMAIL_USER);
  const gmailAppPasswordConfigured = Boolean(process.env.GMAIL_APP_PASSWORD);
  const mailFromConfigured = Boolean(process.env.MAIL_FROM);

  return {
    gmailUserConfigured,
    gmailAppPasswordConfigured,
    mailFromConfigured,
    gmailConfigured: gmailUserConfigured && gmailAppPasswordConfigured,
  };
}

function makeTransporter() {
  const config = emailConfig();

  if (!config) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function organizerHtml(content: InvitationContent, registration: Registration) {
  return `
    <div style="font-family:Arial,'Noto Sans TC',sans-serif;line-height:1.65;color:#242120">
      <h2>新的 BNI 邀請函報名</h2>
      <p><strong>活動：</strong>${escapeHtml(content.eventTitle)}</p>
      <p><strong>姓名：</strong>${escapeHtml(registration.name)}</p>
      <p><strong>LINE ID：</strong>${escapeHtml(registration.lineId)}</p>
      <p><strong>Email：</strong>${escapeHtml(registration.email)}</p>
      <p><strong>引薦人：</strong>${escapeHtml(registration.referrerName || "未填寫")}</p>
      <p><strong>兌換碼：</strong>${escapeHtml(registration.couponCode)}</p>
      <p><strong>時間：</strong>${escapeHtml(registration.createdAt)}</p>
    </div>
  `;
}

function attendeeHtml(content: InvitationContent, registration: Registration) {
  return `
    <div style="font-family:Arial,'Noto Sans TC',sans-serif;line-height:1.65;color:#242120">
      <h2>${escapeHtml(content.eventTitle)}</h2>
      <p>${escapeHtml(registration.name)} 您好，已收到您的報名資料。</p>
      <p><strong>活動時間：</strong>${escapeHtml(content.eventDate)} ${escapeHtml(content.eventTime)}</p>
      <p><strong>地點：</strong>${escapeHtml(content.locationName)}，${escapeHtml(content.locationAddress)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <h3>${escapeHtml(content.couponTitle)}</h3>
      <p>${escapeHtml(content.couponDescription)}</p>
      <p><strong>兌換碼：</strong>${escapeHtml(registration.couponCode)}</p>
      <p>期待在活動現場見到您。</p>
    </div>
  `;
}

export async function sendRegistrationEmails(
  content: InvitationContent,
  registration: Registration,
): Promise<EmailSendResult> {
  const transporter = makeTransporter();
  const config = emailConfig();

  if (!transporter || !config) {
    return {
      configured: false,
      organizerEmailSent: false,
      attendeeEmailSent: false,
    };
  }

  const organizerEmail = content.organizerEmail || process.env.ORGANIZER_EMAIL;
  let organizerEmailSent = false;
  let attendeeEmailSent = false;

  if (organizerEmail) {
    await transporter.sendMail({
      from: config.from,
      to: organizerEmail,
      subject: `新的 BNI 活動報名：${registration.name}`,
      html: organizerHtml(content, registration),
      text: [
        `活動：${content.eventTitle}`,
        `姓名：${registration.name}`,
        `LINE ID：${registration.lineId}`,
        `Email：${registration.email}`,
        `引薦人：${registration.referrerName || "未填寫"}`,
        `兌換碼：${registration.couponCode}`,
        `時間：${registration.createdAt}`,
      ].join("\n"),
    });
    organizerEmailSent = true;
  }

  await transporter.sendMail({
    from: config.from,
    to: registration.email,
    subject: `BNI 活動報名確認與 ${content.couponTitle}`,
    html: attendeeHtml(content, registration),
    text: [
      `${registration.name} 您好，已收到您的報名資料。`,
      `活動：${content.eventTitle}`,
      `時間：${content.eventDate} ${content.eventTime}`,
      `地點：${content.locationName}，${content.locationAddress}`,
      `${content.couponTitle}：${content.couponDescription}`,
      `兌換碼：${registration.couponCode}`,
    ].join("\n"),
  });
  attendeeEmailSent = true;

  return {
    configured: true,
    organizerEmailSent,
    attendeeEmailSent,
  };
}
