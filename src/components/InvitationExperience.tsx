"use client";

import {
  useState,
  useRef,
  useCallback,
  useId,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Mail,
  User,
  AtSign,
  Users,
  Info,
  ArrowRight,
  X,
  CalendarPlus,
  Ticket,
  Send,
  Scissors,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { InvitationContent, Registration } from "@/lib/invitation-content";
import { SiteBackground } from "./SiteBackground";
import { SpeakerProfileModal } from "./SpeakerProfileModal";
import { BorderBeam } from "./BorderBeam";
import styles from "./InvitationExperience.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RegistrationPayload = Pick<
  Registration,
  "name" | "lineId" | "email" | "referrerName"
> & { source: string };

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "success";
      registration: Registration;
      coupon: { title: string; description: string; code: string };
    }
  | { kind: "error"; message: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * The cover already shows the event title, so drop a repeated
 * "靜奢之境：" prefix from the topic line beneath it.
 */
function topicSubtitle(content: InvitationContent) {
  const prefix = content.eventTitle;
  if (prefix && content.topic.startsWith(prefix)) {
    return content.topic.slice(prefix.length).replace(/^[：:，,\s-—]+/, "") || content.topic;
  }
  return content.topic;
}

function calendarTitle(content: InvitationContent) {
  return `${content.chapterName}｜${content.speakerName} — ${content.eventTitle}`;
}

function calendarDetails(content: InvitationContent) {
  return [content.topic, content.tagline, content.description]
    .filter(Boolean)
    .join("\n\n");
}

/** Calendar wire format: UTC basic form, e.g. 20260916T223000Z. */
function toCalendarStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalUrl(content: InvitationContent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarTitle(content),
    details: calendarDetails(content),
    location: `${content.locationName} ${content.locationAddress}`.trim(),
  });

  const start = toCalendarStamp(content.startAt);
  const end = toCalendarStamp(content.endAt);
  if (start && end) {
    params.set("dates", `${start}/${end}`);
  }

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildIcsFile(content: InvitationContent) {
  // Escape per RFC 5545: commas, semicolons, backslashes and newlines.
  const esc = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BNI Invitation//ZH-TW//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${toCalendarStamp(content.startAt) || Date.now()}@bni-invitation`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(content.startAt)}`,
    `DTEND:${toCalendarStamp(content.endAt)}`,
    `SUMMARY:${esc(calendarTitle(content))}`,
    `DESCRIPTION:${esc(calendarDetails(content))}`,
    `LOCATION:${esc(`${content.locationName} ${content.locationAddress}`.trim())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(content: InvitationContent) {
  const blob = new Blob([buildIcsFile(content)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${content.eventTitle}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay} role="status" aria-live="polite">
      <div className={styles.loadingCard}>
        <div className={styles.loadingHalo} aria-hidden="true" />
        <div className={styles.loadingIcon} aria-hidden="true">
          <Send size={26} />
        </div>
        <p className={styles.loadingTitle}>報名送出中…</p>
        <p className={styles.loadingHint}>
          正在寄送確認信與您的邀請序號
          <br />
          請稍候片刻
        </p>
        <div className={styles.loadingDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // fall back for older browsers
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button
      id="copy-coupon-button"
      className={styles.copyCodeButton}
      onClick={handleCopy}
      data-copied={copied}
      aria-label={copied ? "已複製" : `複製邀請序號 ${code}`}
    >
      <span>邀請序號</span>
      <strong>{code}</strong>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span className={styles.copyLabel}>{copied ? "已複製" : "複製"}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function InvitationExperience({ content }: { content: InvitationContent }) {
  const [phase, setPhase] = useState<"cover" | "detail">("cover");
  const [opening, setOpening] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const [posterModal, setPosterModal] = useState(false);
  const [speakerModal, setSpeakerModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const nameId = useId();
  const lineId = useId();
  const emailId = useId();
  const referrerId = useId();

  // ── Envelope open animation ────────────────────────────────────────────────
  const handleOpen = useCallback(() => {
    if (phase !== "cover") return;
    setOpening(true);
    setTimeout(() => {
      setOpening(false);
      setPhase("detail");
    }, 1100);
  }, [phase]);

  // ── Tilt effect on envelope ────────────────────────────────────────────────
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (phase !== "cover" || opening) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      e.currentTarget.style.setProperty(
        "--letter-tilt-x",
        `${mx * 14}deg`,
      );
      e.currentTarget.style.setProperty(
        "--letter-tilt-y",
        `${-my * 8}deg`,
      );
      e.currentTarget.style.setProperty(
        "--letter-glow-x",
        `${50 + mx * 40}%`,
      );
      e.currentTarget.style.setProperty(
        "--letter-glow-y",
        `${50 + my * 30}%`,
      );
    },
    [phase, opening],
  );

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    buttonRef.current.style.setProperty("--letter-tilt-x", "0deg");
    buttonRef.current.style.setProperty("--letter-tilt-y", "0deg");
  }, []);

  // ── Form submit ────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState.kind === "loading") return;

    const data = new FormData(e.currentTarget);
    const payload: RegistrationPayload = {
      name: String(data.get("name") ?? ""),
      lineId: String(data.get("lineId") ?? ""),
      email: String(data.get("email") ?? ""),
      referrerName: String(data.get("referrerName") ?? ""),
      source: "public-invitation",
    };

    setSubmitState({ kind: "loading" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setSubmitState({ kind: "error", message: json.error ?? "發生錯誤，請稍後再試。" });
        return;
      }

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#c8102e", "#8c6a43", "#e8d9c4", "#ffffff"],
      });

      setSubmitState({
        kind: "success",
        registration: json.registration,
        coupon: json.coupon,
      });

      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        successRef.current?.focus();
      }, 120);
    } catch {
      setSubmitState({ kind: "error", message: "網路異常，請確認連線後重試。" });
    }
  }

  // ── Poster image presence ──────────────────────────────────────────────────
  const hasPoster = Boolean(content.posterImagePath);

  // ==========================================================================
  // Render: cover phase
  // ==========================================================================
  if (phase === "cover") {
    return (
      <>
        <SiteBackground />
        <main className={styles.shell}>
          <div className={styles.coverStage}>
            <button
              ref={buttonRef}
              id="open-invitation-button"
              className={styles.letterButton}
              data-opening={opening}
              onClick={handleOpen}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label="開啟邀請函"
            >
              {/* Left: copy */}
              <div className={styles.letterCopy}>
                <span className={styles.eyebrow}>{content.chapterName}</span>
                <h1 className={styles.letterTitle}>{content.eventTitle}</h1>
                <p className={styles.letterSubtitle}>
                  {topicSubtitle(content)}
                </p>
                {content.tagline && (
                  <p className={styles.letterTagline}>{content.tagline}</p>
                )}
                <p className={styles.letterMeta}>
                  {content.eventDate}・{content.eventTime}
                </p>
                <p className={styles.letterSpeaker}>
                  {content.speakerCompany}　{content.speakerRoles}　
                  <strong>{content.speakerName}</strong>
                </p>
                <span className={styles.letterAction} aria-hidden="true">
                  <Mail size={16} />
                  點擊開啟邀請函
                  <ArrowRight size={16} />
                </span>
              </div>

              {/* Right: envelope */}
              <div className={styles.letterScene} aria-hidden="true">
                <div className={styles.envelopeRig}>
                  {/* Layers back→front */}
                  <div className={styles.envelopeBack} />

                  {hasPoster && (
                    <div className={styles.letterPoster}>
                      <Image
                        src={content.posterImagePath}
                        alt="活動海報"
                        width={220}
                        height={311}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}

                  <div className={styles.envelopePocket}>
                    <div className={styles.envelopeAddress}>
                      <span>{content.chapterName}</span>
                      <span>{content.speakerName}</span>
                    </div>
                  </div>

                  <div className={styles.envelopeLeftWing} />
                  <div className={styles.envelopeRightWing} />
                  <div className={styles.envelopeFront} />

                  <div className={styles.envelopeFlap}>
                    <div className={styles.envelopeSeal}>BNI</div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </main>
      </>
    );
  }

  // ==========================================================================
  // Render: detail phase
  // ==========================================================================
  return (
    <>
      <SiteBackground />
      <main className={styles.shell}>
        <div
          className={styles.experience}
          data-registered={submitState.kind === "success"}
        >
          {/* ── Left: poster column ─────────────────────────────────────────── */}
          <aside className={styles.posterColumn}>
            {/* Poster toolbar */}
            <div className={styles.posterToolbar}>
              <div className={styles.posterToolbarText}>
                <h1>{content.eventTitle}</h1>
                <p>
                  {content.chapterName}・{content.speakerName}
                </p>
              </div>
              <div className={styles.posterActions}>
                {hasPoster && (
                  <button
                    id="zoom-poster-button"
                    className={styles.iconButton}
                    onClick={() => setPosterModal(true)}
                    aria-label="放大海報"
                    title="放大海報"
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Poster image / placeholder */}
            <div className={styles.posterFrame}>
              {hasPoster ? (
                <Image
                  src={content.posterImagePath}
                  alt={`${content.eventTitle} 活動海報`}
                  width={780}
                  height={1102}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              ) : (
                <div
                  style={{
                    aspectRatio: "1 / 1.4",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(145deg, #f5ebe0, #e8d5c4)",
                    color: "#9c8880",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    padding: "24px",
                  }}
                >
                  <span>活動海報<br />（上傳後顯示）</span>
                </div>
              )}
            </div>
          </aside>

          {/* ── Right: side panel ───────────────────────────────────────────── */}
          <div className={styles.sidePanel}>
            {/* Event summary */}
            <section className={styles.inviteSummary} aria-label="活動資訊">
              <p className={styles.eyebrow}>{content.chapterName}</p>

              <div className={styles.chipGrid} role="list">
                <div className={styles.infoChip} role="listitem">
                  <CalendarDays size={16} aria-hidden="true" />
                  {content.eventDate}
                </div>
                <div className={styles.infoChip} role="listitem">
                  <Clock size={16} aria-hidden="true" />
                  {content.eventTime}
                </div>
                <div className={styles.infoChip} role="listitem">
                  <DollarSign size={16} aria-hidden="true" />
                  {content.fee}
                </div>
              </div>

              {/* Speaker block */}
              <div className={styles.profileBlock}>
                <p className={styles.eyebrow}>講者</p>
                <h2>{content.speakerName}</h2>
                <p>{content.speakerRoles}</p>
                <p className={styles.muted}>{content.speakerCompany}</p>
                <button
                  id="view-speaker-button"
                  className={styles.rsvpButton}
                  onClick={() => setSpeakerModal(true)}
                >
                  <Info size={15} />
                  查看講者介紹
                </button>
              </div>

              {/* Detail block */}
              <div className={styles.detailBlock}>
                <p className={styles.eyebrow}>主題</p>
                <h2>{content.topic}</h2>
                {content.tagline && (
                  <p className={styles.tagline}>{content.tagline}</p>
                )}
                {content.description && (
                  <p>{content.description}</p>
                )}

                {content.highlights.length > 0 && (
                  <ul className={styles.highlightList}>
                    {content.highlights.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <dl>
                  <div>
                    <dt>
                      <MapPin size={13} aria-hidden="true" />
                      地點
                    </dt>
                    <dd>
                      {content.locationName}
                      {content.locationAddress && (
                        <span className={styles.muted}>
                          &nbsp;{content.locationAddress}
                        </span>
                      )}
                    </dd>
                  </div>
                  {content.referralAudience && (
                    <div>
                      <dt>
                        <Users size={13} aria-hidden="true" />
                        引薦對象
                      </dt>
                      <dd>{content.referralAudience}</dd>
                    </div>
                  )}
                </dl>
              </div>

            </section>

            {/* ── Registration form / success receipt ─────────────────────── */}
            {submitState.kind !== "success" ? (
              <form
                id="registration-form"
                ref={formRef}
                className={styles.form}
                onSubmit={handleSubmit}
                aria-label="活動報名表單"
                noValidate
              >
                <div className={styles.formHeader}>
                  <h2>報名出席</h2>
                  <span className={styles.formBadge}>{content.fee}・名額有限</span>
                </div>

                {content.referralAudience && (
                  <p className={styles.formBenefit}>
                    引薦對象：{content.referralAudience}
                  </p>
                )}

                <div className={styles.formGrid}>
                  <label className={styles.field} htmlFor={nameId}>
                    <span>
                      <User size={14} />
                      姓名
                    </span>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      placeholder="您的姓名"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className={styles.field} htmlFor={lineId}>
                    <span>
                      <AtSign size={14} />
                      LINE ID
                    </span>
                    <input
                      id={lineId}
                      name="lineId"
                      type="text"
                      placeholder="您的 LINE ID"
                      autoComplete="off"
                      required
                    />
                  </label>

                  <label className={`${styles.field} ${styles.fieldWide}`} htmlFor={emailId}>
                    <span>
                      <Mail size={14} />
                      Email（確認信與邀請序號將寄至此信箱）
                    </span>
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className={`${styles.field} ${styles.fieldWide}`} htmlFor={referrerId}>
                    <span>
                      <Users size={14} />
                      推薦人（選填）
                    </span>
                    <input
                      id={referrerId}
                      name="referrerName"
                      type="text"
                      placeholder="介紹您來的朋友姓名"
                      autoComplete="off"
                    />
                  </label>

                  {submitState.kind === "error" && (
                    <p className={styles.errorMessage} role="alert">
                      {submitState.message}
                    </p>
                  )}

                  <button
                    id="submit-registration-button"
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitState.kind === "loading"}
                  >
                    <BorderBeam />
                    {submitState.kind === "loading" ? (
                      "送出中…"
                    ) : (
                      <>
                        <Send size={16} />
                        確認報名並取得邀請序號
                      </>
                    )}
                  </button>
                </div>

                <p className={styles.fieldHint}>
                  提交即表示同意主辦單位以 Email 傳送確認信與活動相關資訊。
                </p>
              </form>
            ) : (
              /* ── Success receipt (ticket) ───────────────────────────────── */
              <div
                id="success-receipt"
                ref={successRef}
                className={styles.successReceipt}
                tabIndex={-1}
                role="region"
                aria-label="報名成功"
              >
                <div className={styles.ticketCard}>
                  {/* Main ticket body */}
                  <div className={styles.ticketMain}>
                    <div className={styles.receiptHeader}>
                      <div className={styles.receiptIcon} aria-hidden="true">
                        <Ticket size={22} />
                      </div>
                      <div>
                        <h2>報名成功！</h2>
                        <p className={styles.receiptStatus}>確認信已寄出</p>
                      </div>
                    </div>

                    <p className={styles.receiptMeta}>
                      {content.eventDate}・{content.eventTime}
                      <br />
                      {content.locationName}
                    </p>

                    <p className={styles.receiptBenefit}>
                      {content.couponDescription || submitState.coupon.description}
                    </p>

                    <p className={styles.receiptApplies}>
                      <Check size={16} />
                      {submitState.registration.name}，歡迎您！
                    </p>

                    <div className={styles.calendarRow}>
                      <a
                        id="add-to-google-calendar"
                        href={buildGoogleCalUrl(content)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.calendarButton}
                      >
                        <CalendarPlus size={16} />
                        加入 Google 日曆
                      </a>
                      <button
                        id="add-to-apple-calendar"
                        type="button"
                        className={styles.calendarButton}
                        aria-label="下載 .ics 行事曆檔"
                        onClick={() => downloadIcs(content)}
                      >
                        <CalendarPlus size={16} />
                        Apple 日曆
                      </button>
                    </div>
                  </div>

                  {/* Tear / perforation row */}
                  <div className={styles.ticketTear} aria-hidden="true">
                    <div className={styles.ticketTearLine} />
                    <div className={styles.ticketSealBadge}>
                      <Scissors size={12} />
                    </div>
                  </div>

                  {/* Stub */}
                  <div className={styles.ticketStub}>
                    <p className={styles.ticketWelcome}>
                      {content.eventDate}　期待與您相見
                    </p>
                    <CopyButton code={submitState.coupon.code} />

                    <div className={styles.receiptActions}>
                      <button
                        id="register-another-button"
                        className={styles.nextRegistrationButton}
                        onClick={() => {
                          setSubmitState({ kind: "idle" });
                          formRef.current?.reset();
                          setTimeout(() => {
                            formRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 60);
                        }}
                      >
                        <ArrowRight size={16} />
                        為朋友報名
                      </button>
                      <button
                        className={styles.secondaryAction}
                        onClick={() => {
                          if (content.meetNuvaUrl) {
                            window.open(content.meetNuvaUrl, "_blank");
                          }
                        }}
                      >
                        <ExternalLink size={15} />
                        活動頁面
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable notes section */}
                {content.notes.length > 0 && (
                  <div className={styles.disclosureGroup}>
                    <details className={styles.disclosure}>
                      <summary>
                        注意事項
                        <ChevronDown
                          size={18}
                          className={styles.disclosureIcon}
                          aria-hidden="true"
                        />
                      </summary>
                      <div className={styles.disclosureContent}>
                        {content.notes.map((note, i) => (
                          <p
                            key={i}
                            className={styles.successMessage}
                            style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
                          >
                            <Info size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                            {note}
                          </p>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}

            {/* Notes accordion (always shown in detail phase) */}
            {submitState.kind !== "success" && content.notes.length > 0 && (
              <div className={styles.disclosureGroup}>
                <details className={styles.disclosure}>
                  <summary>
                    注意事項
                    <ChevronDown
                      size={18}
                      className={styles.disclosureIcon}
                      aria-hidden="true"
                    />
                  </summary>
                  <div className={styles.disclosureContent}>
                    {content.notes.map((note, i) => (
                      <p
                        key={i}
                        className={styles.successMessage}
                        style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
                      >
                        <Info size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                        {note}
                      </p>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Poster lightbox ─────────────────────────────────────────────────── */}
      {posterModal && hasPoster && (
        <div
          id="poster-modal"
          className={styles.posterModal}
          role="dialog"
          aria-modal="true"
          aria-label="活動海報放大"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPosterModal(false);
          }}
        >
          <button
            className={styles.closeButton}
            onClick={() => setPosterModal(false)}
            aria-label="關閉海報"
          >
            <X size={22} />
          </button>
          <div className={styles.modalImageWrap}>
            <Image
              src={content.posterImagePath}
              alt="活動海報（全尺寸）"
              width={1920}
              height={2715}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}

      {/* ── Speaker profile modal ────────────────────────────────────────────── */}
      {speakerModal && (
        <SpeakerProfileModal
          content={content}
          onClose={() => setSpeakerModal(false)}
        />
      )}

      {/* ── Loading overlay ──────────────────────────────────────────────────── */}
      {submitState.kind === "loading" && <LoadingOverlay />}
    </>
  );
}
