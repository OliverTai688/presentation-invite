# BNI Invitation Microsite Brief

## Goal

Create a web invitation experience for a BNI event. The invitation opens into the event poster, includes adjacent LinkedIn and `meetnuva.com` information, accepts registration details, sends confirmation/record emails, and displays a redeemable UI coupon.

## Captured Poster Asset

- Source image supplied by user: `/var/folders/qn/pqc95r_50cn_4kbdc4zs2zd80000gn/T/codex-clipboard-95dc96d0-71e5-4f6c-be96-7f2898b009d2.png`
- Project asset path: `public/assets/bni-invitation-poster-2026-07-09.png`
- Dimensions: `1076 x 1522`
- Public URL in Next app: `/assets/bni-invitation-poster-2026-07-09.png`

## Poster Text Inventory

- BNI
- 臺北北區長冠軍分會
- Date: 2026/7/9
- Time: AM 06:30-08:30
- Speaker/company: 圓展教育科技有限公司
- Roles: 執行長 / 全端工程師 / AI Agent 顧問
- Speaker name: 戴宇星
- Topic: AI 商務力｜讓專業被懂你的人看見
- Description: 新商業時代，讓專業人士用 AI 被理解、被信任、被找到。
- Location: 台北漢普頓酒店，臺北市中山區建國北路二段7號2F
- Fee: 1000元
- Notes: 請攜帶100張以上名片、請著正式服裝出席、附設停車場
- Referral audience: 專業人士、企業主、AI 決策者

## Desired User Flow

1. Visitor lands on an invitation-first page.
2. Visitor clicks the invitation and the poster is revealed.
3. Visitor can inspect the poster and open side links for LinkedIn and `meetnuva.com`.
4. Visitor enters registration details.
5. System records the registration and sends a copy to the organizer.
6. System sends a confirmation to the attendee if an attendee email is collected.
7. Visitor sees a UI coupon after successful registration.

## Coupon Offer Copy

來參與的來賓與引薦人，皆可兌換 2026 年任一付費線上工作坊，或一小時 AI 諮詢服務。

## Admin Requirement

- Admin route: `/admin`
- Prototype password: `123456`
- Admin can edit invitation content, link URLs, event details, coupon copy, and email settings where appropriate.

## Open Questions

- Organizer email address is not yet provided.
- Attendee confirmation email requires an attendee email field; current requested fields only include name and LINE ID.
- LinkedIn URL confirmed: https://www.linkedin.com/in/olivertai/
- Confirm whether `meetnuva.com` is the intended partner link or whether the poster company should link to another site as well.
