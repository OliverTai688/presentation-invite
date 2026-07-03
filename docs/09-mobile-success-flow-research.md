# Mobile RSVP Success Flow Research

## 目的

這份文件針對手機版報名成功後的畫面重新研究與定義。重點不是再加更多動畫或玻璃效果，而是把完成報名後的資訊量降到最低：讓使用者立刻知道「已成功、兌換碼在哪、下一步是什麼」，其餘活動、講者、票券細節都改為可展開或次要入口。

## 截圖問題摘要

參考使用者提供的手機截圖，成功狀態目前同時顯示：

- 日期、時間、地點三列。
- Speaker 區塊與講者公司/角色。
- 代表作品、個人經歷兩個大型外連。
- 完整 voucher 卡：eyebrow、標題、長描述、來賓/引薦人兩個 pill、兌換碼、email 狀態。
- 下方仍有「報名」跳轉按鈕。
- 海報與 zoom button 接著出現。

問題不是單一元素不好，而是成功後任務已完成，畫面仍維持報名前的資訊密度。手機版第一屏應該像「報名收據」，不是完整活動詳情頁。

## 研究結論

- 成功後手機第一屏只保留 3 件事：成功狀態、兌換碼、下一步。
- 日期/時間/地點可以保留，但要壓縮成一行或一個 compact summary，不再是三個高間距 rows。
- Speaker、作品、個人經歷在成功後不是主要任務，應收合到「活動與講者資訊」。
- Voucher 描述太長，應改成短句 + details disclosure。使用者需要的是兌換碼，不是重新讀完整優惠條款。
- 「來賓可兌換 / 引薦人可兌換」兩個 pill 可合併成一句：`來賓與引薦人皆適用`。
- 成功後不應再顯示「報名」主按鈕。它應改為 `查看海報`、`複製兌換碼`、或直接移除。
- Tooltip 在手機上價值有限，因為沒有 hover；手機應優先用清楚文字、icon + label、toast 與 disclosure。
- Glass effect 只能用於輕量層次，不應讓成功卡變成更大、更裝飾性的區塊。

## UX 原則

### 1. 成功狀態是收據，不是新頁面

報名完成後，使用者的心智問題變成：

- 我成功了嗎？
- 我的兌換碼是什麼？
- 有寄信嗎？
- 我還需要做什麼？

所以 mobile success UI 應以 receipt pattern 呈現，而不是完整 voucher poster layout。

### 2. Progressive disclosure

NN/g 對 progressive disclosure 的核心建議是先顯示少數最重要選項，再讓使用者按需展開次要資訊。套用到本案：

- Primary：成功、兌換碼、寄送狀態。
- Secondary：活動詳情、講者、連結、兌換條款、引薦人說明。
- Tertiary：海報放大、外部網站、LinkedIn。

### 3. 手機內容要修剪

NN/g 的 mobile UX study guide 指出手機內容更難記憶與理解，行動版需要留下核心內容，次要資訊延後顯示。這張截圖最明顯的風險就是「使用者完成報名後還要在一長串資訊中找兌換碼」。

### 4. 觸控目標要大，但目標數量要少

W3C WCAG 2.5.8 的最低觸控目標是 24 x 24 CSS px；web.dev / Lighthouse 建議 mobile tap targets 約 48 x 48 px 並保持間距。這不代表手機要放很多大型按鈕。反過來說，每個大型觸控目標都會吃掉垂直空間，所以成功狀態應減少按鈕數量。

### 5. 成功訊息要可被輔助科技讀到

成功狀態適合用 `role="status"` 或 `aria-live="polite"`。MDN 指出 `status` 是不需要打斷使用者的 advisory live region；W3C WCAG 4.1.3 也要求狀態訊息能以程式方式被識別。

## 手機成功畫面資訊架構

### 第一屏必留

1. 成功標題
   - `報名完成`
   - icon：`CheckCircle2`
   - 補充狀態：`活動資訊已寄到信箱` 或 `兌換券已建立`

2. 兌換碼
   - 大字 code：`AI2026-...`
   - 單一明確操作：`複製`
   - 點擊後用 `sonner` toast：`兌換碼已複製`

3. 最小票券說明
   - `可兌換 2026 付費線上工作坊或 1 小時 AI 諮詢`
   - `來賓與引薦人皆適用`

4. 下一步
   - 優先：`查看海報`
   - 次要：`活動與講者資訊`
   - 不顯示：`報名`

### 第一屏應移除或收合

- Speaker 詳細身份。
- 代表作品 / 個人經歷兩個大型 pill。
- 長 voucher 描述。
- 來賓/引薦人兩個分開 pill。
- 重複的 RSVP jump button。
- 大型 poster 直接接在成功卡下方。

## 建議成功狀態版型

### Mobile Default

```text
[check] 報名完成
活動資訊已寄到信箱

2026 AI 成長兌換券
AI2026-1QUZHZ        [複製]
可兌換工作坊或 1 小時 AI 諮詢
來賓與引薦人皆適用

[查看海報]

[活動與講者資訊 v]
[兌換細節 v]
```

### Mobile With Email Warning

```text
[check] 報名完成
兌換券已建立，Email 尚未寄出

AI2026-1QUZHZ        [複製]

[查看海報]
[聯絡主辦方或查看兌換細節 v]
```

### Desktop

桌面可以保留較完整 voucher card，但仍建議將「來賓可兌換 / 引薦人可兌換」合併成更輕的狀態列。桌面不必完全跟手機一致。

## 元件調整建議

### `InvitationExperience.tsx`

- 新增 derived state：`const isRegistered = Boolean(coupon)`。
- 成功後將 side panel 切換到 `SuccessReceipt`，不要只把 form 換成 coupon。
- `posterToolbar` 的 mobile CTA 在成功後不要顯示 `報名`；改為 `查看海報` 或只保留 zoom icon。
- 將 event summary、speaker links、detail block 包入 collapsible sections，成功後預設關閉。
- `couponStatus` 使用 `role="status"`，或在 success receipt root 使用 `role="status"` / `aria-live="polite"`。

### `InvitationExperience.module.css`

- 在 `@media (max-width: 640px)` 下給 success receipt 更小 padding 與更緊密 gap。
- Coupon mobile 不要使用大型對角線背景，改為純白或淡紅上緣線，降低視覺噪音。
- Code button mobile 改滿寬或兩欄：code 左、copy icon 右，至少 48px 高。
- 移除 mobile 成功狀態裡的雙 pill 高度；若保留，改成單行 caption。
- Poster 在成功後使用 collapsed preview 或 `查看海報` button，不要自動佔據成功卡下一屏。

## Framer Motion 建議

成功畫面只需要一個短入口動效：

- receipt root：`opacity 0 -> 1`, `y 10 -> 0`, 220-300ms。
- code strip：可微 scale `0.98 -> 1`，不要閃爍。
- details disclosure：用 `AnimatePresence` 或 CSS grid height transition，220ms 內完成。
- 不要在成功狀態使用 confetti + shimmer + border beam + entrance 同時出現。保留 confetti 或保留 subtle entrance，二選一。

Reduced motion：

- confetti 不播放。
- receipt 直接出現。
- disclosure 不做 height animation 或縮短到 0ms。

## Glass / Magic UI 取捨

手機成功狀態不建議再加入 Magic UI border beam。原因：

- 成功卡已經有兌換碼、狀態與行動按鈕，動畫邊框會增加注意力競爭。
- 手機第一屏空間有限，裝飾效果會讓 receipt 看起來更像廣告卡。
- BNI 商務邀請語氣需要可信、清楚，而不是遊戲化。

可保留的質感：

- 成功卡使用非常淡的 glass：`rgb(255 255 255 / 0.86)`。
- 紅色只用在上緣線、check icon 或 code focus，不做大面積斜切背景。
- Copy code button 使用深色實底，讓兌換碼是視覺焦點。

## Tooltip / Pop Up / Bottom Sheet

### Tooltip

手機無 hover，不應依賴 tooltip 解釋成功狀態。icon-only button 要有 `aria-label`，但畫面上盡量顯示短文字，例如 `複製`、`海報`。

### Pop Up

保留 poster modal，因為海報檢視是明確任務。其他資訊不建議用 popover，手機 popover 容易遮住內容。

### Bottom Sheet

可考慮用 bottom sheet 顯示「兌換細節」或「活動與講者資訊」，但目前不建議新增 Vaul。Apple HIG 與 Material 都將 sheet/bottom sheet 視為 mobile secondary content 的常見容器；本案可以先用原生 disclosure 達成 80% 效果。

## 成功後內容優先級

| 優先級 | 內容 | 呈現方式 |
| --- | --- | --- |
| P0 | 報名完成 | 顯示 |
| P0 | 兌換碼 | 顯示、可複製 |
| P0 | Email 是否寄出 | 一行 status |
| P1 | 兌換內容 | 一句短文 |
| P1 | 來賓與引薦人皆適用 | 一句 caption |
| P1 | 查看海報 | 單一 button |
| P2 | 日期/時間/地點 | compact summary 或收合 |
| P2 | 講者/公司/角色 | 收合 |
| P2 | meetnuva / LinkedIn | 收合內連結 |
| P3 | 完整活動描述、費用、引薦對象 | 收合 |

## Mobile 驗收標準

- 報名成功後，375px 寬度第一屏內看得到：成功狀態、兌換碼、複製操作、email 狀態。
- 成功後不再出現主要文字為 `報名` 的 CTA。
- 第一屏內大型互動目標不超過 3 個。
- 每個主要 tap target 至少 44px 高；理想值 48px。
- 不使用 hover-only tooltip 傳達必要資訊。
- 活動/講者/票券細節可展開，但預設不搶佔成功畫面。
- 海報仍可檢視，但不在成功後自動把第一屏推長。
- `role="status"` 或 `aria-live="polite"` 能宣告報名成功。
- Reduced motion 下無 confetti，成功 receipt 仍清楚。

## 建議實作順序

1. 新增 `SuccessReceipt` 子元件，手機與桌面可共用資料但不同密度。
2. 成功後隱藏或替換 `報名` CTA。
3. 將 coupon mobile 版改為 compact receipt。
4. 將 speaker links 與 detail block 成功後預設收合。
5. 再決定是否增加 Radix Tooltip / Collapsible；第一輪可不新增依賴。
6. 用 in-app Browser 驗證 375 x 812、390 x 844、430 x 932 三個手機尺寸。

## 參考來源

- NN/g Progressive Disclosure：https://www.nngroup.com/articles/progressive-disclosure/
- NN/g Mobile UX Study Guide：https://www.nngroup.com/articles/mobile-ux-study-guide/
- Material Design 3 Snackbar：https://m3.material.io/components/snackbar/guidelines
- Material Design 3 Bottom Sheets：https://m3.material.io/components/bottom-sheets
- Apple HIG Sheets：https://developer.apple.com/design/human-interface-guidelines/sheets
- W3C WCAG 2.5.8 Target Size Minimum：https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C WCAG 2.5.5 Target Size Enhanced：https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- web.dev Accessible Tap Targets：https://web.dev/articles/accessible-tap-targets
- Chrome Lighthouse Tap Targets：https://developer.chrome.com/docs/lighthouse/seo/tap-targets
- W3C WCAG 4.1.3 Status Messages：https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- MDN ARIA `status` role：https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role
