import nodemailer from "nodemailer";
import type { InvitationContent, Registration } from "./invitation-content";
import { attendeeHtml, organizerHtml } from "./email-template";

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
      ``,
      `【活動資訊】`,
      `活動：${content.eventTitle}`,
      `時間：${content.eventDate} ${content.eventTime}`,
      `地點：${content.locationName}，${content.locationAddress}`,
      ``,
      `【會前重要事項】`,
      `來賓參加前請填寫表單，這是為了讓BNI夥伴有機會認識你：`,
      `https://forms.gle/4Q72NPfVdeVX7QQC8`,
      ``,
      `【${content.couponTitle}】`,
      `${content.couponDescription}`,
      `兌換碼：${registration.couponCode}`,
      ``,
      `期待在活動現場見到您。`,
    ].join("\n"),
  });
  attendeeEmailSent = true;

  return {
    configured: true,
    organizerEmailSent,
    attendeeEmailSent,
  };
}
