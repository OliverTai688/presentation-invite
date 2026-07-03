# UI/UX Polish Round + External Resource Scan (2026-07-03)

## 目的

延續 docs 08（motion/glass/minimal UI）與 docs 09（mobile success flow）的研究，做一輪新的外部資源掃描並落地實作。重點：不新增依賴、維持 BNI 紅白炭灰商務語氣、避免藍紫 SaaS 漸層，只挑「明確加值」的精修。

## 外部資源結論（2026-07 掃描）

參考 Luma / Partiful / Framer 範例與 2026 motion 指南、View Transitions / scroll-driven animation baseline 狀態、framer-motion 在 mobile Safari 的 backdrop-filter 已知問題。

決策：**現有 stack（framer-motion / lucide / sonner / canvas-confetti / CSS Modules）已足夠，不新增任何依賴。** 不導入 Magic UI / reactbits 套件（假設 Tailwind + shadcn，會與 CSS Modules 衝突）；需要的效果用 ~15 行 CSS 手工移植。

### 明確跳過

- Cross-document View Transitions（Firefox 尚未支援；本站單一 SPA route 無需）。
- 在 framer 內動畫化 `backdrop-filter`（flicker / double-fire bug）。
- GSAP / Lenis / three。
- 磁吸按鈕、scroll-driven parallax、sticky mobile CTA bar、social-proof 人數列（留待產品決策）。

## 本輪已實作（零依賴）

| 項目 | 來源 punch-list | 說明 |
| --- | --- | --- |
| `-webkit-backdrop-filter` 前綴 | P0.4 | 玻璃層在 iOS/Safari 實際會失效；補上 webkit 前綴與 `@supports` OR 條件 |
| 加入行事曆（Google + `.ics`） | P0.3 | 成功收據新增行事曆連結；`buildCalendarLinks` 防禦式解析 free-text 日期/時間，解析失敗則不顯示 |
| 側欄 stagger 進場 | P1.1 | 共用 `panelStagger` / `panelItem` variants，spring 進場；`prefers-reduced-motion` 直接 `initial={false}` |
| 成功收據暖色 shine sweep | P1.3 | 一次性 `::after` 光掃，reduced-motion 下 `display:none` |
| 兌換碼 Copy→Check 變形 | P1.5 | `data-copied` 綠色 tint + icon 切換 + toast，1.9s 後復原 |
| 主要 CTA 觸感按壓 | P0.5 | submit / 報名下一位 / 複製 / 行事曆按鈕 `:active { scale }`（純 CSS，避免 framer 巢狀 variant 衝突） |
| 死碼清理 | — | 移除未使用的 `.coupon` / `.couponAudience` / `.couponStatus`（TSX 已改用 successReceipt） |

## 驗證

- `npm run lint` ✅
- `npm run build` ✅（TypeScript + 13 static pages）
- `buildCalendarLinks` 單元測試四種情境（AM / 下午 PM / 缺時間 / 缺日期）皆正確。
- 待人工視覺 QA：桌機 stagger、成功 shine、複製變形、mobile 375/390/430 行事曆單欄與收據密度。

## 追加：玻璃質感 + 科技霧感背景（使用者指定）

使用者要求把卡片/按鈕改為透明玻璃，並加入「柔和科技霧感漸層」背景，主色取自海報。

- **外部套件（已安裝）**：`@paper-design/shaders-react` 的 `MeshGradient`（WebGL 動態網格漸層，React 19 相容，0 漏洞）。使用者在純 CSS / WebGL 套件 / Stripe canvas 三選一中，選了 **WebGL 套件**。
- **主漸層色（使用者選）**：BNI 緋紅 `#c8102e` × 西裝炭墨藍 `#1c2230`，浮在冷霧中性色上；上方再疊一層 CSS 光幕 veil 讓紅/藍柔化成「霧感」並確保玻璃卡片上的深色文字可讀。
- **元件**：`SiteBackground.tsx`（client，`useReducedMotion` → `speed=0` 靜態）+ `SiteBackground.module.css`，在 `layout.tsx` body 最底層 `position:fixed` 掛載；`globals.css` body 透明、html 留冷霧 fallback（WebGL 未載入/失敗時仍是柔和冷霧底）。
- **玻璃系統**：`.shell` 新增 `--glass* / --brand-glass*` tokens，品牌色更新為海報緋紅。CSS 末端集中一段「Glass refactor」：所有卡片與按鈕改半透明玻璃，先給 no-backdrop 的 opaque fallback，再用 `@supports` 疊 `backdrop-filter` 霜面；主要 CTA 用霜面緋紅玻璃（維持白字對比），兌換碼用深色玻璃當視覺焦點。全部 `prefers-reduced-motion` 友善。

待人工視覺 QA：WebGL 背景實際呈現、玻璃卡片在深色 mesh 區塊上的文字可讀性、首屏信封文字在霧上的對比。

## 追加：主標／副標字體系統 + Magic UI 手工移植（使用者指定）

使用者指定主標「AI商務力」、副標「讓專業被懂你的人看見」（`eventTitle` 以 `｜` 分隔）。派 subagent 研究 Magic UI 標題元件 + 2025-2026 邀請函字體排印慣例，結論：

- **字體**：新增 `next/font` 自架 Traditional Chinese 字體 —— `Noto Sans TC`（UI/內文，`display:"swap"` + `preload:false` 避免大檔案卡首繪）、`Noto Serif TC`（僅主標使用，襯線更顯質感）。CSS 變數 `--font-sans-tc` / `--font-serif-tc`，Latin 字族排在 CJK 前面（Noto 官方建議）。
- **主標／副標拆分**：`splitEventTitle()` 依全形/半形槓拆出 `titleMain` / `titleSub`，套用到首屏信封與海報工具列的標題區。
- **標題視覺**：採用研究建議的 P1「Animated Gradient Text」手工移植（緋紅家族漸層 `#c8102e → #86122a → --ink`，非藍紫），`background-clip:text` + 7s 緩慢 `background-position` sheen，`prefers-reduced-motion` 下停止動畫（保留漸層底色）。
- **CJK 排印規則**（依研究)：標題 `word-break:keep-all; line-break:strict; text-wrap:balance` 避免斷字孤字；追蹤（letter-spacing）只用 0 或微正值，絕不收緊；kicker/eyebrow 用 `0.06em` 追蹤，meta/speaker 維持 `0`；日期時間 chip 加 `font-variant-numeric: tabular-nums` 對齊數字。
- **Border Beam（唯一新增裝飾元件）**：手工移植 Magic UI Border Beam（`magicui.design/docs/components/border-beam`），只套在「完成報名」主要 CTA 上（`BorderBeam.tsx` + `.module.css`），緋紅→透明沿邊框緩慢繞行；`useReducedMotion` 時整個不渲染。**明確不採用** Dot Pattern / Grid Pattern —— 會與既有 WebGL mesh-gradient 霧感背景打架。

待人工視覺 QA：主標漸層 sheen 節奏、CJK 換行是否孤字、Border Beam 在玻璃 CTA 上的可見度。

## 追加：報名成功卡改為實體票券樣式（使用者指定）

使用者要求報名成功卡改成「像一張票券」，並加上「期待與您交流」的溫暖訊息讓來賓感受賓至如歸。派 subagent 研究票券/登機證 CSS 手法（不裝套件），結論採用 `mask-image` 雙 radial-gradient 缺口（而非顏色相符的圓點），因為背景是會移動的 WebGL mesh-gradient，只有真正的透明鏤空才能在任何背景狀態下正確顯示。

- **結構**：`successReceipt` 內新增 `ticketCard`（`ticketMain` 主聯 + `ticketTear` 撕線列 + `ticketStub` 存根），取代原本扁平堆疊的 receipt 元素。主聯保留報名狀態/日期/福利說明；存根放兌換碼 + 新增的「期待與您交流，祝您賓至如歸。」歡迎句（`Noto Serif TC`，緋紅字）。
- **缺口做法**：`ticketMain` 只在自身底邊鏤空、`ticketStub` 只在自身頂邊鏤空——各自相對自己的邊界定位，不受動態內容高度影響，避免要用 JS 量測撕線的 Y 座標。用 `mask-size:51% 100%` 雙圖層各佔一半寬度（而非 `mask-composite:intersect`），相容性更好，包在 `@supports` 裡優雅降級（不支援時仍是正常圓角票卡，只是沒有鏤空圓點)。
- **撕線列**：`ticketTear` 是介於主聯與存根之間的獨立小列（非絕對定位疊加在遮罩元素上），裡面放虛線 + 剪刀圖示徽章（`lucide-react` 的 `Scissors`，已確認存在），避免了「徽章疊在遮罩元素邊界上可能被裁切」的邊界情況。
- **視覺區隔**：票券本體用近不透明「紙感」白/米色，跟外層玻璃殼形成對比（紙票夾在玻璃資料夾裡的感覺）；存根用極淡緋紅色調，暗示「這是你要保留的部分」。

待人工視覺 QA：此環境沒有 headless 瀏覽器，無法截圖確認缺口/撕線實際渲染效果，需要人工在瀏覽器檢查（尤其 Safari 的 mask 相容性）與行動裝置寬度下的間距。

## 參考來源

- Luma / Partiful RSVP patterns、add-to-calendar：party.pro、calendarlink.com
- View Transitions baseline：web.dev、MDN、caniuse
- scroll-driven animations：webkit.org、caniuse
- framer-motion backdrop-filter gotchas：github.com/framer/motion issues #711 #1837 #2049
- motion micro-interactions：motion.dev、framer.com/motion
- shine / border-beam 手工移植技法：magicui.design
