import nodemailer from "nodemailer";
import type { InvitationContent, Registration } from "./invitation-content";

export type EmailConfigStatus = {
  gmailConfigured: boolean;
};

export function getEmailConfigStatus(): EmailConfigStatus {
  return {
    gmailConfigured: Boolean(
      process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD,
    ),
  };
}

function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function buildAttendeeHtml(
  content: InvitationContent,
  registration: Registration,
): string {
  const highlights = content.highlights
    .map(
      (item) =>
        `<tr><td style="padding:3px 0;color:#5d5651;font-size:13px;line-height:1.6">・${item}</td></tr>`,
    )
    .join("");

  const notes = content.notes
    .map(
      (note) =>
        `<tr><td style="padding:3px 0;color:#5d5651;font-size:13px;line-height:1.6">・${note}</td></tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8" /><title>報名確認</title></head>
<body style="font-family:'PingFang TC','Noto Sans TC',system-ui,sans-serif;background:#efeae4;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fffdfa;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(48,38,30,.14)">
    <div style="background:#c8102e;padding:30px 32px">
      <p style="color:rgba(255,255,255,.8);margin:0 0 10px;font-size:12px;letter-spacing:.08em;font-weight:700">${content.chapterName}</p>
      <h1 style="color:#fff;margin:0;font-size:24px;line-height:1.3;letter-spacing:.02em">${content.eventTitle}</h1>
      <p style="color:rgba(255,255,255,.9);margin:10px 0 0;font-size:14px;line-height:1.6">${content.topic}</p>
    </div>

    <div style="padding:30px 32px">
      <p style="margin:0 0 18px;color:#24201e;font-size:15px">親愛的 <strong>${registration.name}</strong>，您好！</p>
      <p style="margin:0 0 24px;color:#5d5651;line-height:1.8;font-size:14px">感謝您報名本場例會。以下是活動資訊與您的專屬邀請序號，敬請於報到時出示。</p>

      ${
        content.tagline
          ? `<p style="margin:0 0 24px;padding:14px 18px;border-left:3px solid #8c6a43;background:#f8f4ee;color:#6b4f30;font-size:14px;line-height:1.8">${content.tagline}</p>`
          : ""
      }

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:10px 0;border-top:1px solid #eae3da;color:#9c0f24;font-size:12px;font-weight:700;width:64px;vertical-align:top">日期</td><td style="padding:10px 0;border-top:1px solid #eae3da;color:#24201e;font-size:14px">${content.eventDate}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #eae3da;color:#9c0f24;font-size:12px;font-weight:700;vertical-align:top">時間</td><td style="padding:10px 0;border-top:1px solid #eae3da;color:#24201e;font-size:14px">${content.eventTime}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #eae3da;color:#9c0f24;font-size:12px;font-weight:700;vertical-align:top">地點</td><td style="padding:10px 0;border-top:1px solid #eae3da;color:#24201e;font-size:14px">${content.locationName}<br><span style="font-size:13px;color:#5d5651">${content.locationAddress}</span></td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #eae3da;color:#9c0f24;font-size:12px;font-weight:700;vertical-align:top">講者</td><td style="padding:10px 0;border-top:1px solid #eae3da;color:#24201e;font-size:14px"><strong>${content.speakerName}</strong><br><span style="font-size:13px;color:#5d5651">${content.speakerCompany}　${content.speakerRoles}</span></td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #eae3da;color:#9c0f24;font-size:12px;font-weight:700;vertical-align:top">費用</td><td style="padding:10px 0;border-top:1px solid #eae3da;color:#24201e;font-size:14px">${content.fee}</td></tr>
      </table>

      ${
        highlights
          ? `<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6b4f30;letter-spacing:.06em">品牌亮點</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${highlights}</table>`
          : ""
      }

      <div style="background:#f8f4ee;border:1px solid #e3d8c9;border-radius:8px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#6b4f30;letter-spacing:.06em">${content.couponTitle}</p>
        <p style="margin:0 0 12px;font-size:13px;color:#5d5651;line-height:1.7">${content.couponDescription}</p>
        <div style="background:#24201e;border-radius:6px;padding:11px 16px;display:inline-block">
          <span style="font-family:'SF Mono',Menlo,monospace;font-size:16px;font-weight:700;color:#fff;letter-spacing:.08em">${registration.couponCode}</span>
        </div>
      </div>

      ${
        notes
          ? `<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#9c0f24;letter-spacing:.06em">注意事項</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${notes}</table>`
          : ""
      }

      <p style="margin:0;font-size:13px;color:#837a73;line-height:1.7">如有任何問題，請聯繫 ${content.organizerEmail || process.env.ORGANIZER_EMAIL || "主辦單位"}。</p>
    </div>
  </div>
</body>
</html>`;
}

function buildOrganizerHtml(
  content: InvitationContent,
  registration: Registration,
): string {
  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8" /><title>新報名通知</title></head>
<body style="font-family:system-ui,sans-serif;background:#efeae4;margin:0;padding:24px">
  <div style="max-width:480px;margin:0 auto;background:#fffdfa;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(48,38,30,.14)">
    <div style="background:#24201e;padding:20px 24px">
      <h1 style="color:#fff;margin:0;font-size:16px">新報名通知 — ${content.eventTitle}</h1>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700;width:72px">姓名</td><td style="padding:8px 0;border-top:1px solid #eae3da;color:#24201e;font-weight:700">${registration.name}</td></tr>
        <tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700">LINE ID</td><td style="padding:8px 0;border-top:1px solid #eae3da;color:#24201e">${registration.lineId}</td></tr>
        <tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700">Email</td><td style="padding:8px 0;border-top:1px solid #eae3da;color:#24201e">${registration.email}</td></tr>
        <tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700">邀請序號</td><td style="padding:8px 0;border-top:1px solid #eae3da;font-family:monospace;font-weight:700;color:#c8102e">${registration.couponCode}</td></tr>
        ${registration.referrerName ? `<tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700">推薦人</td><td style="padding:8px 0;border-top:1px solid #eae3da;color:#24201e">${registration.referrerName}</td></tr>` : ""}
        <tr><td style="padding:8px 0;border-top:1px solid #eae3da;color:#5d5651;font-size:12px;font-weight:700">時間</td><td style="padding:8px 0;border-top:1px solid #eae3da;color:#24201e">${new Date(registration.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

export async function sendRegistrationEmails(
  content: InvitationContent,
  registration: Registration,
): Promise<{
  configured: boolean;
  organizerEmailSent: boolean;
  attendeeEmailSent: boolean;
}> {
  const status = getEmailConfigStatus();

  if (!status.gmailConfigured) {
    return {
      configured: false,
      organizerEmailSent: false,
      attendeeEmailSent: false,
    };
  }

  const transporter = createTransport();
  const fromAddress =
    process.env.MAIL_FROM ||
    `${content.chapterName} <${process.env.GMAIL_USER}>`;
  const organizerRecipient =
    content.organizerEmail || process.env.ORGANIZER_EMAIL;

  let organizerEmailSent = false;
  let attendeeEmailSent = false;

  if (organizerRecipient) {
    await transporter.sendMail({
      from: fromAddress,
      to: organizerRecipient,
      subject: `【新報名】${registration.name} — ${content.eventTitle}`,
      html: buildOrganizerHtml(content, registration),
    });
    organizerEmailSent = true;
  }

  await transporter.sendMail({
    from: fromAddress,
    to: registration.email,
    subject: `報名確認｜${content.eventTitle}・${content.eventDate}`,
    html: buildAttendeeHtml(content, registration),
  });
  attendeeEmailSent = true;

  return { configured: true, organizerEmailSent, attendeeEmailSent };
}
