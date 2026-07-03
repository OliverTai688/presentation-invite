import type { InvitationContent, Registration } from "./invitation-content";
import { buildCalendarLinks } from "./calendar";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function organizerHtml(content: InvitationContent, registration: Registration) {
  const rows: Array<[string, string]> = [
    ["活動", content.eventTitle],
    ["姓名", registration.name],
    ["LINE ID", registration.lineId],
    ["Email", registration.email],
    ["引薦人", registration.referrerName || "未填寫"],
    ["兌換碼", registration.couponCode],
    ["時間", registration.createdAt],
  ];

  return `
    <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans TC', sans-serif;line-height:1.6;color:#232a33;max-width:480px">
      <div style="border-left:4px solid #c8102e;padding-left:14px;margin-bottom:20px">
        <h2 style="color:#1a1c20;margin:0;font-size:18px">新的 BNI 邀請函報名</h2>
      </div>
      <table role="presentation" style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value], index) => `
        <tr>
          <td style="padding:10px 0;${index > 0 ? "border-top:1px solid #ece9e2;" : ""}color:#8a8f98;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;vertical-align:top;width:88px">${escapeHtml(label)}</td>
          <td style="padding:10px 0;${index > 0 ? "border-top:1px solid #ece9e2;" : ""}color:#1a1c20;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;
}

export function attendeeHtml(content: InvitationContent, registration: Registration) {
  const calendarLinks = buildCalendarLinks(content);

  // Palette mirrors the live invitation UI's design tokens
  // (src/components/InvitationExperience.module.css): warm ivory surfaces,
  // charcoal ink for body text/names, and brand red reserved for small
  // uppercase "eyebrow" labels + the primary CTA fill — never for large
  // blocks or personal names.
  return `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(content.eventTitle)}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #e9edf3;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans TC', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        table { border-collapse: collapse; }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #e9edf3;
          padding: 40px 20px;
        }
        .main {
          background-color: #fffdf8;
          margin: 0 auto;
          width: 100%;
          max-width: 600px;
          border: 1px solid rgba(53, 47, 42, 0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(20, 26, 40, 0.1), 0 1px 3px rgba(20, 26, 40, 0.05);
        }
        .header {
          padding: 40px 36px 8px;
          text-align: center;
        }
        .eyebrow {
          display: block;
          color: #9c0f24;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin: 0 0 10px;
        }
        .header h1 {
          color: #232a33;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.2px;
          line-height: 1.45;
        }
        .rule {
          width: 44px;
          height: 3px;
          background-color: #c8102e;
          border-radius: 2px;
          margin: 20px auto 0;
          font-size: 0;
          line-height: 0;
        }
        .content {
          padding: 28px 36px 40px;
          color: #232a33;
          line-height: 1.6;
        }
        .greeting {
          margin: 0;
          font-size: 16px;
          color: #5b6470;
        }
        .greeting strong {
          color: #232a33;
          font-weight: 800;
        }
        .info-card {
          background-color: #faf6ef;
          border: 1px solid rgba(53, 47, 42, 0.1);
          border-radius: 14px;
          padding: 24px 26px;
          margin: 24px 0;
        }
        .info-row {
          margin-bottom: 18px;
        }
        .info-row:last-child {
          margin-bottom: 0;
        }
        .info-value {
          color: #232a33;
          font-size: 16.5px;
          font-weight: 700;
          margin: 0;
        }
        .info-subvalue {
          color: #5b6470;
          font-size: 13.5px;
          margin-top: 2px;
          display: block;
        }
        .calendar-actions {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(53, 47, 42, 0.1);
          text-align: center;
        }
        .btn {
          display: inline-block;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 800;
          text-decoration: none;
          margin: 0 5px 10px 5px;
        }
        .btn-primary {
          background-color: #c8102e;
          color: #ffffff !important;
        }
        .btn-secondary {
          background-color: #fffdf8;
          color: #232a33 !important;
          border: 1px solid rgba(53, 47, 42, 0.16);
          padding: 11px 21px;
        }
        .form-callout {
          background-color: #faf6ef;
          border: 1px solid rgba(53, 47, 42, 0.1);
          border-radius: 14px;
          padding: 26px 24px;
          margin: 32px 0;
          text-align: center;
        }
        .form-callout h3 {
          color: #232a33;
          margin: 0 0 10px;
          font-size: 17px;
          font-weight: 800;
        }
        .form-callout p {
          color: #5b6470;
          font-size: 14.5px;
          line-height: 1.7;
          margin: 0 0 20px;
        }
        .coupon-section {
          margin-top: 40px;
          text-align: center;
        }
        .coupon-title {
          font-size: 19px;
          font-weight: 800;
          color: #232a33;
          margin: 0 0 8px 0;
        }
        .coupon-desc {
          color: #5b6470;
          font-size: 14.5px;
          margin: 0 auto 22px auto;
          max-width: 420px;
        }
        .ticket {
          margin: 0 auto;
          width: 320px;
          max-width: 100%;
          border: 1px solid rgba(53, 47, 42, 0.12);
          border-radius: 16px;
          overflow: hidden;
        }
        .ticket-welcome {
          background-color: #fffdf8;
          padding: 20px 22px 16px;
          color: #9c0f24;
          font-size: 14.5px;
          font-weight: 700;
          line-height: 1.5;
        }
        .ticket-tear {
          padding: 0 22px;
        }
        .ticket-tear hr {
          border: none;
          border-top: 2px dashed rgba(53, 47, 42, 0.24);
          margin: 0;
        }
        .ticket-stub {
          background-color: #232a33;
          padding: 18px 22px 20px;
          text-align: center;
        }
        .coupon-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
          display: block;
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .coupon-code {
          font-family: 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #ffffff;
        }
        .signoff {
          margin-top: 40px;
          margin-bottom: 0;
          text-align: center;
          color: #5b6470;
        }
        .footer {
          text-align: center;
          padding: 24px 30px;
          background-color: #faf6ef;
          border-top: 1px solid rgba(53, 47, 42, 0.1);
          color: #7c8590;
          font-size: 12.5px;
        }
        .footer p {
          margin: 0;
        }
        @media only screen and (max-width: 480px) {
          .header { padding: 32px 24px 4px; }
          .header h1 { font-size: 19px; }
          .content { padding: 24px 22px 32px; }
          .info-card { padding: 20px; }
          .btn { display: block; width: 100%; box-sizing: border-box; margin: 0 0 10px 0; }
          .form-callout .btn { margin-bottom: 0; }
          .ticket { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="main" align="center" role="presentation">
          <tr>
            <td class="header">
              <span class="eyebrow">${escapeHtml(content.chapterName)}</span>
              <h1>${escapeHtml(content.eventTitle)}</h1>
              <div class="rule">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td class="content">
              <p class="greeting">
                <strong>${escapeHtml(registration.name)}</strong> 您好，已為您保留席位。
              </p>

              <div class="info-card">
                <div class="info-row">
                  <span class="eyebrow">活動時間</span>
                  <p class="info-value">${escapeHtml(content.eventDate)} ${escapeHtml(content.eventTime)}</p>
                </div>
                <div class="info-row">
                  <span class="eyebrow">活動地點</span>
                  <p class="info-value">${escapeHtml(content.locationName)}</p>
                  <span class="info-subvalue">${escapeHtml(content.locationAddress)}</span>
                </div>

                ${calendarLinks ? `
                <div class="calendar-actions">
                  <a href="${calendarLinks.google}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">加入 Google 行事曆</a>
                  <a href="${calendarLinks.ics}" class="btn btn-secondary">加入 Apple / Outlook</a>
                </div>
                ` : ''}
              </div>

              <div class="form-callout">
                <span class="eyebrow">會前提醒</span>
                <h3>請於活動前填寫表單</h3>
                <p>讓 BNI 夥伴能預先認識您，為您準備更好的交流體驗。</p>
                <a href="https://forms.gle/4Q72NPfVdeVX7QQC8" class="btn btn-primary">填寫會前表單</a>
              </div>

              <div class="coupon-section">
                <h3 class="coupon-title">${escapeHtml(content.couponTitle)}</h3>
                <p class="coupon-desc">${escapeHtml(content.couponDescription)}</p>
                <table class="ticket" role="presentation" align="center">
                  <tr>
                    <td class="ticket-welcome">期待與您交流，祝您商運亨通。</td>
                  </tr>
                  <tr>
                    <td class="ticket-tear"><hr></td>
                  </tr>
                  <tr>
                    <td class="ticket-stub">
                      <span class="coupon-label">專屬兌換碼</span>
                      <span class="coupon-code">${escapeHtml(registration.couponCode)}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p class="signoff">期待在活動現場與您見面！</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>此為系統自動發送的報名確認信，請勿直接回覆。</p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
}
