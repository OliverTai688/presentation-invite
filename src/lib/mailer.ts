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
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(content.eventTitle)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans TC', sans-serif; line-height: 1.6; color: #333333;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-top: 40px; margin-bottom: 40px;">
        <!-- Header -->
        <tr>
          <td style="background-color: #242120; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">
              ${escapeHtml(content.eventTitle)}
            </h1>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <p style="margin-top: 0; font-size: 16px;">
              <strong>${escapeHtml(registration.name)}</strong> 您好，已收到您的報名資料。
            </p>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #CF2030; padding: 20px; margin: 24px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 0 0 12px 0;">
                <strong style="color: #555;">活動時間：</strong><br/>
                <span style="font-size: 18px; color: #242120; font-weight: 500;">${escapeHtml(content.eventDate)} ${escapeHtml(content.eventTime)}</span>
              </p>
              <p style="margin: 0;">
                <strong style="color: #555;">活動地點：</strong><br/>
                <span style="font-size: 16px; color: #242120;">${escapeHtml(content.locationName)}</span><br/>
                <span style="font-size: 14px; color: #666;">${escapeHtml(content.locationAddress)}</span>
              </p>
            </div>

            <!-- Pre-event Form -->
            <div style="background-color: #fff0f1; border: 1px solid #fbdcde; border-radius: 6px; padding: 24px; margin: 32px 0; text-align: center;">
              <h3 style="color: #CF2030; margin-top: 0; margin-bottom: 12px; font-size: 18px;">會前重要事項</h3>
              <p style="margin-bottom: 20px; font-size: 15px; color: #444;">
                來賓參加前填寫表單，這是為了讓BNI夥伴有機會認識你：
              </p>
              <a href="https://forms.gle/4Q72NPfVdeVX7QQC8" style="display: inline-block; background-color: #CF2030; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 16px; transition: background-color 0.2s;">
                填寫會前表單
              </a>
            </div>

            <!-- Coupon Section -->
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0;" />
            
            <h3 style="color: #242120; margin-top: 0; font-size: 18px;">${escapeHtml(content.couponTitle)}</h3>
            <p style="font-size: 15px; color: #555; margin-bottom: 16px;">
              ${escapeHtml(content.couponDescription)}
            </p>
            
            <div style="background-color: #242120; color: #ffffff; padding: 16px 20px; border-radius: 6px; display: inline-block;">
              <span style="font-size: 14px; opacity: 0.8; display: block; margin-bottom: 4px;">您的專屬兌換碼</span>
              <strong style="font-size: 20px; letter-spacing: 1px;">${escapeHtml(registration.couponCode)}</strong>
            </div>

            <p style="margin-top: 40px; margin-bottom: 0; font-size: 16px; color: #242120;">
              期待在活動現場見到您。
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f0f0f0; padding: 20px 30px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #888888;">
              此為系統自動發送的報名確認信，請勿直接回覆。
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
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
