# Motion, Glass, and Minimal UI Research

## 目的

這份文件整理 BNI 邀請函 microsite 下一輪視覺與互動精修方向：以簡約、清楚、可報名為優先，使用既有 `framer-motion`、`lucide-react`、`sonner` 與少量 CSS glass effect 提升質感。Magic UI、Motion Primitives、Radix primitives 等資源可作為參考，但不應預設導入整套 UI 系統。

## 快速結論

- 首選：維持 `framer-motion` + CSS Modules + lucide icons。現有前台已經有邀請函開啟、海報 modal、報名成功 coupon、confetti 與 toast，下一步應是「收斂與精修」，不是加更多效果。
- Magic UI：適合作為靈感來源，例如 subtle border beam、shimmer button、spotlight hover；但官方範例多以 Tailwind/shadcn registry 為前提，本專案未使用 Tailwind，建議只改寫 1-2 個 CSS 效果，不導入完整生態。
- Motion Primitives：同樣是好的互動參考，尤其 disclosure、dialog、morphing popover、transition panel；但也以 Tailwind + Motion 為主，建議手動借鑑互動模型。
- Glass effect：只用在浮層、工具列、coupon、admin 狀態區等「功能性容器」。避免整頁玻璃化，避免模糊降低海報可讀性。
- Tooltip / collapse / popup：用來把輔助資訊藏起來，而不是藏主流程。報名姓名、LINE ID、Email、送出按鈕、海報檢視、LinkedIn / meetnuva 連結都要保持直接可見。

## 現況觀察

### 已經做得好的地方

- `src/components/InvitationExperience.tsx` 已使用 `AnimatePresence`、`motion`、`useReducedMotion`，互動架構正確。
- 邀請函首屏已是「開啟邀請函」的實際體驗，不是 landing page。
- 海報使用 `next/image` 並保留 `1076 x 1522` intrinsic dimensions。
- 已有 poster focus modal、RSVP jump、coupon entrance、copy coupon code、`sonner` toast、`canvas-confetti`。
- lucide icons 已用於時間、地點、連結、報名欄位、copy、zoom、close 等操作。

### 可以再提升的地方

- 部分資訊可收合：活動描述、地點詳細地址、引薦對象、coupon 使用說明、email 寄送狀態。
- Icon-only button 需要更完整 tooltip，而不只依賴 `aria-label`。
- Pop up 可區分兩種：海報檢視用 full modal；講者/連結/票券細節可用小型 popover 或 mobile bottom sheet。
- Glass effect 可讓工具列和 modal 控制更有層次，但應避免套在海報本體上。
- Admin 頁可以用收合區塊降低表單長度：基本資訊、講者資訊、場地費用、連結、coupon、Email/部署。

## 資源比較

| 資源 | 本專案適配度 | 建議用法 | 是否新增依賴 |
| --- | --- | --- | --- |
| `framer-motion` | 高 | 主流程動效、進出場、hover/tap、modal、coupon、accordion height animation | 已安裝，不新增 |
| Magic UI | 中 | 借鑑 border beam、shimmer、spotlight；改寫成 CSS Modules | 暫不新增 |
| Motion Primitives | 中 | 借鑑 disclosure、dialog、transition panel、morphing popover 的互動模式 | 暫不新增 |
| Radix Tooltip | 高 | 若要專業 tooltip，新增 `@radix-ui/react-tooltip` 比自製更穩 | 視需求新增 |
| Radix Popover / Dialog / Collapsible | 中高 | Admin 或資訊簡化需要可及性更好的 popup/collapse 時使用 | 視需求新增 |
| Vaul | 低到中 | 只在 mobile bottom sheet 明顯改善海報/報名流程時考慮 | 暫不新增 |
| GSAP | 低 | 只有邀請函變成複雜 timeline 時才考慮 | 暫不新增 |
| Three.js | 低 | 現階段 CSS 3D 已足夠，避免 bundle 與驗證成本 | 暫不新增 |

## 推薦互動策略

### 1. 動效層級

將動效分成三個層級，避免全站一起動：

- 主動效：邀請函開啟、海報抽出、進入報名頁。這是網站記憶點。
- 功能動效：tooltip、popover、collapse、coupon、toast。時間短、方向一致、支援 reduced motion。
- 裝飾動效：border shimmer、light sweep、glass highlight。只放在少數重點位置，且可完全移除不影響流程。

建議 timing：

- Button hover/tap：120-180ms。
- Tooltip/popover：140-220ms。
- Collapse：220-320ms。
- Coupon entrance：300-420ms。
- 邀請函主流程：目前 1760ms 可接受，但 mobile 可略短，避免使用者等待太久。

### 2. Framer Motion 可落地項目

- 用 shared variants 統一 `fadeUp`, `scaleIn`, `slidePanel`, `couponReveal`，讓視覺語言一致。
- 對 side panel 內部區塊加入 stagger，但只在開啟後第一次出現使用。
- `layout` 用於收合區塊，避免 detail block 打開/關閉時跳動。
- `AnimatePresence` 用於 coupon/form 互換、poster modal、popover、mobile drawer。
- `useReducedMotion` 保持現有做法，所有 decorative motion 都要可跳過。

範例方向：

```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};
```

### 3. Magic UI 可借鑑項目

不建議直接安裝 Magic UI registry，因為本專案不是 Tailwind/shadcn 架構。可借鑑以下效果並改為 CSS Modules：

- Border Beam：只用於 coupon 或 RSVP form submit success，不放在所有卡片上。
- Shimmer Button：用於「開啟邀請函」或「完成報名」，但 hover/idle 狀態要很克制。
- Spotlight Hover：可用於 LinkedIn / meetnuva 連結按鈕，滑過時出現很淡的白色光感。
- Animated Beam：不適合目前 BNI 邀請函，容易變成科技展示感，除非未來要表達 AI 顧問服務流程。

### 4. Glass Effect 使用規範

Glass effect 應該像「清楚的透明控制層」，不是一整頁霧面。建議：

- Poster toolbar：半透明白、細 border、`backdrop-filter`，讓它浮在背景上但不遮海報。
- Poster modal close button：目前已接近，可加 blur 與更穩定的 contrast。
- Side panel form/coupon：可用 `rgb(255 255 255 / 0.82)` + `backdrop-filter: blur(18px)`，但保持文字區背景足夠實。
- Admin header action chips：適合 glass，因為是工具性狀態。

CSS 原則：

```css
.glassSurface {
  background: rgb(255 255 255 / 0.78);
  border: 1px solid rgb(33 28 28 / 0.1);
  box-shadow: 0 18px 48px rgb(33 28 28 / 0.08);
}

@supports (backdrop-filter: blur(16px)) {
  .glassSurface {
    background: rgb(255 255 255 / 0.64);
    backdrop-filter: blur(16px) saturate(1.12);
  }
}
```

避免：

- 不要讓海報本體有 blur、透明或 overlay。
- 不要加入大型漸層光球、bokeh、purple/blue SaaS 風格。
- 不要所有卡片都 glass，會降低資訊層級。

## Tooltip / 收合 / Pop Up 簡化建議

### Tooltip

適合：

- 海報放大 icon：`放大海報`
- RSVP jump：`前往報名表`
- Copy coupon code：`複製兌換碼`
- 外連 icon：`在新分頁開啟`
- Admin refresh/logout/save icon：`重新讀取最新內容`、`登出後台`、`儲存變更`

不適合：

- 表單欄位必填說明。必填資訊應直接顯示，不藏在 tooltip。
- 核心 CTA。按鈕文案本身應清楚。

若要正式導入，建議新增 `@radix-ui/react-tooltip`，因為 Radix Tooltip 有 collision-aware positioning 與可及性基礎。若只做少量非關鍵 tooltip，可先做輕量 CSS tooltip + `aria-label`，但 keyboard/focus 體驗較弱。

### Collapse

前台適合收合：

- `活動詳細資訊`：描述、地點地址、費用、引薦對象。
- `兌換券使用方式`：email 狀態、如何兌換、來賓/引薦人適用說明。
- `講者更多資訊`：speaker roles、代表作品、LinkedIn。

前台不應收合：

- 日期、時間、地點名稱。
- RSVP 表單的姓名、LINE ID、Email。
- Coupon code。

Admin 適合收合：

- 基本活動資訊
- 講者與連結
- 地點/費用/引薦對象
- Coupon 與 Email
- 系統部署狀態
- 近期報名

若需要依賴，優先考慮 `@radix-ui/react-collapsible`；若只在單一頁面使用，也可用原生 `<details>` 搭配 CSS 和 lucide chevron。

### Pop Up

前台 popup 分工：

- Poster modal：維持 full-screen modal，讓海報可檢視。
- Speaker popover：桌面可用小 popover，mobile 可變成 inline collapse。
- Coupon detail popover：顯示兌換規則與寄送狀態。
- Copy toast：繼續用 `sonner`，不要另外做自製通知。

若新增依賴：

- `@radix-ui/react-dialog`：可取代自製 poster modal，強化 focus trap、escape、aria。
- `@radix-ui/react-popover`：用於桌面講者/票券細節。
- Vaul：目前不建議，因官方 GitHub README 顯示專案暫時 unmaintained；除非 mobile bottom sheet 的手勢體驗是明確需求。

## Lucide Icon Map

| 用途 | 建議 icon | 備註 |
| --- | --- | --- |
| 開啟邀請函 | `Sparkles` 或 `MailOpen` | 目前 `Sparkles` 可保留，若要更直覺可改 `MailOpen` |
| 日期 | `CalendarDays` | 已使用 |
| 時間 | `Clock3` | 已使用 |
| 地點 | `MapPin` | 已使用 |
| 放大海報 | `ZoomIn` | 已使用，補 tooltip |
| 報名跳轉 | `ArrowDown` 或 `Ticket` | mobile 可用 `Ticket` 更直接 |
| LINE ID | `MessageCircle` | 已使用 |
| Email | `Mail` | 已使用 |
| LinkedIn / profile | `Contact` 或 `Linkedin` | 若 lucide 版本有 `Linkedin`，可更精準 |
| 外部連結 | `ExternalLink` | 已使用 |
| 複製 | `Copy` | 已使用 |
| Coupon | `Ticket`, `BadgeCheck` | coupon 區可加 `BadgeCheck` 強化完成感 |
| 收合 | `ChevronDown` | 搭配旋轉 180deg |
| Admin | `LockKeyhole`, `ShieldCheck`, `Save`, `RefreshCw`, `LogOut` | 已使用 |

## 頁面分區建議

### 首屏邀請函

- 保留現有 3D envelope 作為唯一主要特效。
- 可加入極淡的 envelope surface highlight，不新增背景裝飾。
- 開啟按鈕保持大而清楚；不要增加次要 CTA。
- Reduced motion：直接淡入最終 poster + RSVP，不播放抽出動畫。

### Poster + Side Panel

- Poster toolbar 使用輕 glass surface；放大與報名按鈕加 tooltip。
- Side panel 首屏只顯示三個 chips、講者姓名、兩個外連、RSVP 表單。
- 詳細活動資訊移入 collapse，預設可關閉，避免右側太長。
- Desktop 保持 poster sticky；mobile 順序可維持 side panel 在上、poster 在下，但提供清楚「看海報」與「報名」切換。

### RSVP Form

- 動效只用在 submit pending、錯誤訊息、成功切換 coupon。
- 欄位 focus 可用 CSS，不需要 Motion。
- Email 必填提示保持 inline，不放 tooltip。
- Submit button 可用很淡 shimmer，僅 hover 或 enabled idle 低頻，不要一直閃。

### Coupon

- Coupon 是最適合加入一個 Magic UI 風格微特效的位置。
- 建議用一次性的 `motion.section` entrance + optional CSS border beam。
- Copy code 後只用 `sonner` toast，不再新增彈窗。
- 「來賓可兌換 / 引薦人可兌換」可維持 pill，詳細條款放 collapse。

### Admin

- 以操作效率為優先，不做華麗動效。
- 表單分組收合，減少一次看到 19 個欄位的壓迫感。
- Save / refresh / logout 補 tooltip。
- Deployment 與 registrations 使用清楚 icon + 狀態色，不加 decorative motion。

## 建議實作階段

### Phase 1：不新增依賴的精修

- 抽出共用 motion variants。
- Poster toolbar、form、coupon 加入克制 glass surface。
- 詳細活動資訊改為 `<details>` 或 local collapse。
- Copy / zoom / external / admin action 補 tooltip 樣式。
- Coupon 增加一次性的 subtle shine 或 border accent。

### Phase 2：可及性元件

- 若 tooltip / popover 使用增加，新增 `@radix-ui/react-tooltip`。
- 若 poster modal 要更完整 focus management，新增 `@radix-ui/react-dialog`。
- Admin 表單收合若需要更穩定控制，新增 `@radix-ui/react-collapsible`。

### Phase 3：只在必要時導入第三方 motion 元件

- 只挑 Magic UI 或 Motion Primitives 的單一效果手動改寫。
- 不導入 Tailwind，只為一個效果增加 Tailwind 會讓系統變混雜。
- 不加入 GSAP/Three.js，除非邀請函互動需求明確升級成複雜 timeline 或真 3D 場景。

## 驗證清單

- `npm run lint`
- `npm run build`
- Desktop：邀請函開啟、poster sticky、side panel、tooltip、collapse、coupon。
- Mobile：首屏 envelope 不溢出、poster 可檢視、RSVP 欄位不被 popup 遮住、collapse 易點。
- Reduced motion：主要內容仍可快速到達，confetti 和 decorative effect 不播放。
- Accessibility：icon-only button 有 `aria-label`，tooltip 不承載必要資訊，modal 可 Esc 關閉，focus state 清楚。
- Visual QA：海報文字沒有被 glass/overlay 蓋住；紅白炭灰仍是主色；沒有紫藍漸層或大型裝飾背景。

## 參考來源

- Motion for React 官方文件：https://motion.dev/docs/react
- Motion `AnimatePresence` 官方文件：https://motion.dev/docs/react-animate-presence
- Magic UI Border Beam：https://magicui.design/docs/components/border-beam
- Magic UI Animated Beam：https://magicui.design/docs/components/animated-beam
- Motion Primitives Installation：https://motion-primitives.com/docs/installation
- Radix Tooltip 官方文件：https://www.radix-ui.com/primitives/docs/components/tooltip
- Lucide React 官方文件：https://lucide.dev/guide/react
- Sonner / shadcn 文件：https://ui.shadcn.com/docs/components/radix/sonner
- Vaul Getting Started：https://vaul.emilkowal.ski/getting-started
- Vaul GitHub 狀態：https://github.com/emilkowalski/vaul
