"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type PointerEvent,
} from "react";
import confetti from "canvas-confetti";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Contact,
  Copy,
  ExternalLink,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Ticket,
  UserPlus,
  UserRound,
  X,
  ZoomIn,
} from "lucide-react";
import type { InvitationContent } from "@/lib/invitation-content";
import styles from "./InvitationExperience.module.css";

type FormState = {
  name: string;
  lineId: string;
  email: string;
  referrerName: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

type CouponState = {
  title: string;
  description: string;
  code: string;
  emailConfigured: boolean;
  attendeeEmailSent: boolean;
  organizerEmailSent: boolean;
  warning?: string;
};

const emptyForm: FormState = {
  name: "",
  lineId: "",
  email: "",
  referrerName: "",
};

const panelStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const panelItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

type CalendarLinks = { google: string; ics: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Content fields are free-text (admin-editable), so parse defensively and
// only surface calendar links when a date can be recovered.
function buildCalendarLinks(content: InvitationContent): CalendarLinks | null {
  const date = content.eventDate.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!date) {
    return null;
  }

  const [, year, month, day] = date;
  let startHour = 9;
  let startMinute = 0;
  let endHour = 10;
  let endMinute = 0;

  const time = content.eventTime.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  if (time) {
    startHour = Number(time[1]);
    startMinute = Number(time[2]);
    endHour = Number(time[3]);
    endMinute = Number(time[4]);
    if (/pm|下午/i.test(content.eventTime) && startHour < 12) {
      startHour += 12;
      endHour += 12;
    }
  }

  const day8 = `${year}${pad(Number(month))}${pad(Number(day))}`;
  const start = `${day8}T${pad(startHour)}${pad(startMinute)}00`;
  const end = `${day8}T${pad(endHour)}${pad(endMinute)}00`;
  const title = `${content.chapterName}｜${content.eventTitle}`;
  const details = content.description;
  const location = `${content.locationName} ${content.locationAddress}`.trim();

  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  const icsBody = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BNI Invitation//TW//",
    "BEGIN:VEVENT",
    `UID:bni-${day8}@meetnuva.com`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsBody)}`;

  return { google, ics };
}

// The event title carries "主標｜副標" — split on the full/half-width bar so
// the hero can render a strong main title with a lighter subtitle beneath it.
function splitEventTitle(eventTitle: string) {
  const parts = eventTitle
    .split(/[｜|]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return {
    main: parts[0] ?? eventTitle,
    sub: parts.slice(1).join(" "),
  };
}

export function InvitationExperience({
  content,
}: {
  content: InvitationContent;
}) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [posterFocused, setPosterFocused] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const couponRef = useRef<HTMLElement | null>(null);
  const openingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isRegistered = Boolean(coupon);
  const calendarLinks = useMemo(() => buildCalendarLinks(content), [content]);
  const { main: titleMain, sub: titleSub } = useMemo(
    () => splitEventTitle(content.eventTitle),
    [content.eventTitle],
  );

  const eventChips = useMemo(
    () => [
      { icon: CalendarDays, label: content.eventDate },
      { icon: Clock3, label: content.eventTime },
      { icon: MapPin, label: content.locationName },
    ],
    [content.eventDate, content.eventTime, content.locationName],
  );

  useEffect(() => {
    if (submitState !== "success" || shouldReduceMotion) {
      return;
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
      return;
    }

    confetti({
      particleCount: 72,
      spread: 58,
      origin: { y: 0.72 },
      colors: ["#b91c2b", "#ffffff", "#111111", "#e3d3bf"],
    });
  }, [shouldReduceMotion, submitState]);

  useEffect(() => {
    if (!coupon) {
      return;
    }

    couponRef.current?.focus({ preventScroll: true });
    couponRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [coupon, shouldReduceMotion]);

  useEffect(() => {
    if (!posterFocused) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPosterFocused(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [posterFocused]);

  useEffect(() => {
    return () => {
      if (openingTimerRef.current) {
        clearTimeout(openingTimerRef.current);
      }
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  function updateField(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");
    setCoupon(null);

    const startedAt = Date.now();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        source: "public-invitation",
      }),
    });

    const result = await response.json();

    // Keep the "歡迎交流商會點子" loading visible long enough to read on fast responses.
    const minVisibleMs = shouldReduceMotion ? 0 : 850;
    const elapsed = Date.now() - startedAt;
    if (elapsed < minVisibleMs) {
      await new Promise((resolve) => setTimeout(resolve, minVisibleMs - elapsed));
    }

    if (!response.ok && response.status !== 202) {
      setSubmitState("error");
      setMessage(result.error || "報名送出失敗，請稍後再試。");
      toast.error(result.error || "報名送出失敗，請稍後再試。");
      return;
    }

    setSubmitState("success");
    setMessage(result.warning || "報名完成，兌換券已建立。");
    if (result.warning) {
      toast.warning(result.warning);
    }
    setCoupon({
      title: result.coupon.title,
      description: result.coupon.description,
      code: result.coupon.code,
      emailConfigured: Boolean(result.email.configured),
      attendeeEmailSent: Boolean(result.email.attendeeEmailSent),
      organizerEmailSent: Boolean(result.email.organizerEmailSent),
      warning: result.warning,
    });
    setForm(emptyForm);
  }

  function updateLetterParallax(event: PointerEvent<HTMLButtonElement>) {
    if (opening || shouldReduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty("--letter-tilt-x", `${x * 5}deg`);
    event.currentTarget.style.setProperty("--letter-tilt-y", `${y * -4}deg`);
    event.currentTarget.style.setProperty("--letter-glow-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--letter-glow-y", `${(y + 0.5) * 100}%`);
  }

  function resetLetterParallax(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.removeProperty("--letter-tilt-x");
    event.currentTarget.style.removeProperty("--letter-tilt-y");
    event.currentTarget.style.removeProperty("--letter-glow-x");
    event.currentTarget.style.removeProperty("--letter-glow-y");
  }

  function openLinkedinPopup(event: React.MouseEvent<HTMLAnchorElement>, url: string) {
    event.preventDefault();
    const width = 800;
    const height = 900;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(url, "linkedinPopup", `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
  }

  function openInvitation() {
    if (opening) {
      return;
    }

    if (shouldReduceMotion) {
      setOpened(true);
      return;
    }

    setOpening(true);
    openingTimerRef.current = setTimeout(() => {
      setOpened(true);
    }, 1760);
  }

  async function copyCouponCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("兌換碼已複製。");
      setCopied(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), 1900);
    } catch {
      toast.error("無法複製兌換碼，請手動選取。");
    }
  }

  function registerAnotherAttendee() {
    setCoupon(null);
    setSubmitState("idle");
    setMessage("");
    setForm(emptyForm);

    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
      nameInputRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main className={styles.shell}>
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="cover"
            className={styles.coverStage}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <motion.button
              aria-busy={opening}
              aria-label="開啟邀請函，查看活動海報與報名資訊"
              className={styles.letterButton}
              data-opening={opening ? "true" : "false"}
              onClick={openInvitation}
              onPointerLeave={resetLetterParallax}
              onPointerMove={updateLetterParallax}
              whileHover={shouldReduceMotion || opening ? undefined : { y: -6 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              type="button"
            >
              <span className={styles.letterCopy}>
                <span className={styles.letterKicker}>{content.chapterName}</span>
                <span className={styles.letterTitle} data-text={titleMain}>
                  {titleMain}
                </span>
                {titleSub ? (
                  <span className={styles.letterSubtitle}>{titleSub}</span>
                ) : null}
                <span className={styles.letterMeta}>
                  {content.eventDate} / {content.eventTime}
                </span>
                <span className={styles.letterSpeaker}>
                  {content.speakerCompany} · {content.speakerName}
                </span>
                <span className={styles.letterAction}>
                  <Sparkles size={18} aria-hidden="true" />
                  {opening ? "展開邀請函" : "開啟邀請函"}
                </span>
              </span>

              <span className={styles.letterScene} aria-hidden="true">
                <span className={styles.envelopeRig}>
                  <span className={styles.letterPoster}>
                    <Image
                      src={content.posterImagePath}
                      alt=""
                      width={1076}
                      height={1522}
                      sizes="(max-width: 760px) 42vw, 240px"
                    />
                  </span>
                  <span className={styles.envelopeBack} />
                  <span className={styles.envelopeFlap}>
                    <span className={styles.envelopeSeal}>BNI</span>
                  </span>
                  <span className={styles.envelopePocket}>
                    <span className={styles.envelopeAddress}>
                      <span>{content.speakerName}</span>
                      <span>{content.topic}</span>
                    </span>
                  </span>
                  <span className={styles.envelopeLeftWing} />
                  <span className={styles.envelopeRightWing} />
                  <span className={styles.envelopeFront} />
                </span>
              </span>
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            key="experience"
            className={styles.experience}
            data-registered={isRegistered ? "true" : "false"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <section className={styles.posterColumn} aria-label="活動海報">
              <div className={styles.posterToolbar}>
                <div className={styles.posterToolbarText}>
                  <p>{content.chapterName}</p>
                  <h1 data-text={titleMain}>{titleMain}</h1>
                  {titleSub ? (
                    <p className={styles.posterSubtitle}>{titleSub}</p>
                  ) : null}
                </div>

              </div>
              <motion.button
                aria-label="放大活動海報"
                className={styles.posterFrame}
                onClick={() => setPosterFocused(true)}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
              >
                <Image
                  src={content.posterImagePath}
                  alt={`${content.eventTitle} 活動海報`}
                  width={1076}
                  height={1522}
                  sizes="(max-width: 900px) 78vw, 380px"
                  loading="eager"
                  priority
                />
              </motion.button>
            </section>

            <motion.aside
              className={styles.sidePanel}
              aria-label="活動資訊與報名"
              variants={panelStagger}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="show"
            >
              {!coupon ? (
                <>
                  <motion.section
                    className={styles.inviteSummary}
                    variants={panelItem}
                  >
                    <div className={styles.chipGrid}>
                      {eventChips.map(({ icon: Icon, label }) => (
                        <div className={styles.infoChip} key={label}>
                          <Icon size={17} aria-hidden="true" />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>

                    <section className={styles.profileBlock}>
                      <p className={styles.eyebrow}>Speaker</p>
                      <h2>{content.speakerName}</h2>
                      <p>{content.speakerCompany}</p>
                      <p className={styles.muted}>{content.speakerRoles}</p>
                    </section>

                    <div className={styles.linkRow}>
                      {content.linkedinUrl ? (
                        <a
                          className={`${styles.linkButton} ${styles.tooltipTarget}`}
                          data-tooltip="開啟 LinkedIn"
                          href={content.linkedinUrl}
                          onClick={(e) => openLinkedinPopup(e, content.linkedinUrl)}
                        >
                          <Contact size={18} aria-hidden="true" />
                          個人經歷
                          <ExternalLink size={14} aria-hidden="true" />
                        </a>
                      ) : (
                        <span className={styles.pendingLink}>
                          <Contact size={18} aria-hidden="true" />
                          個人經歷待補
                        </span>
                      )}
                    </div>
                  </motion.section>

                  <motion.form
                    className={styles.form}
                    id="rsvp"
                    onSubmit={submitRegistration}
                    ref={formRef}
                    variants={panelItem}
                  >
                    <div className={styles.formHeader}>
                      <div>
                        <p className={styles.eyebrow}>RSVP</p>
                        <h2>保留席次與兌換券</h2>
                      </div>
                      <span className={styles.formBadge}>快速報名</span>
                    </div>
                    <p className={styles.formBenefit}>
                      來賓與引薦人皆可兌換 2026 任一付費線上工作坊，或一小時 AI 諮詢服務。
                    </p>
                    <div className={styles.formGrid}>
                      <label className={styles.field} htmlFor="registration-name">
                        <span>
                          <UserRound size={16} aria-hidden="true" />
                          報名姓名
                        </span>
                        <input
                          id="registration-name"
                          aria-label="報名姓名"
                          value={form.name}
                          ref={nameInputRef}
                          onChange={updateField("name")}
                          autoComplete="name"
                          placeholder="你的姓名"
                          required
                        />
                      </label>
                      <label className={styles.field} htmlFor="registration-line">
                        <span>
                          <MessageCircle size={16} aria-hidden="true" />
                          LINE ID
                        </span>
                        <input
                          id="registration-line"
                          aria-label="LINE ID"
                          value={form.lineId}
                          onChange={updateField("lineId")}
                          placeholder="LINE ID"
                          required
                        />
                      </label>
                      <label
                        className={`${styles.field} ${styles.fieldWide}`}
                        htmlFor="registration-email"
                      >
                        <span>
                          <Mail size={16} aria-hidden="true" />
                          Email
                        </span>
                        <input
                          id="registration-email"
                          aria-label="Email"
                          value={form.email}
                          onChange={updateField("email")}
                          type="email"
                          autoComplete="email"
                          placeholder="name@example.com"
                          required
                        />
                        <small className={styles.fieldHint}>
                          報名確認與兌換券會寄到這個信箱。
                        </small>
                      </label>
                      <label
                        className={`${styles.field} ${styles.fieldWide}`}
                        htmlFor="registration-referrer"
                      >
                        <span>引薦人</span>
                        <input
                          id="registration-referrer"
                          aria-label="引薦人"
                          value={form.referrerName}
                          onChange={updateField("referrerName")}
                          placeholder="可留空"
                        />
                      </label>
                    </div>
                    <button
                      className={styles.submitButton}
                      disabled={submitState === "submitting"}
                      type="submit"
                    >
                      <Ticket size={18} aria-hidden="true" />
                      {submitState === "submitting" ? "送出中" : "完成報名"}
                    </button>
                    {message ? (
                      <p
                        aria-live="polite"
                        className={
                          submitState === "error" ? styles.errorMessage : styles.successMessage
                        }
                      >
                        {message}
                      </p>
                    ) : null}
                  </motion.form>

                  <motion.details
                    className={styles.disclosure}
                    variants={panelItem}
                  >
                    <summary>
                      <span>活動詳細資訊</span>
                      <ChevronDown
                        className={styles.disclosureIcon}
                        size={18}
                        aria-hidden="true"
                      />
                    </summary>
                    <section className={styles.detailBlock}>
                      <p>{content.description}</p>
                      <dl>
                        <div>
                          <dt>地點</dt>
                          <dd>
                            {content.locationName}
                            <br />
                            {content.locationAddress}
                          </dd>
                        </div>
                        <div>
                          <dt>費用</dt>
                          <dd>{content.fee}</dd>
                        </div>
                        <div>
                          <dt>引薦對象</dt>
                          <dd>{content.referralAudience}</dd>
                        </div>
                      </dl>
                    </section>
                  </motion.details>
                </>
              ) : null}

              {coupon ? (
                <motion.section
                  aria-live="polite"
                  className={styles.successReceipt}
                  ref={couponRef}
                  role="status"
                  tabIndex={-1}
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.99 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: "easeOut" }}
                >
                  <div className={styles.receiptHeader}>
                    <span className={styles.receiptIcon}>
                      <CheckCircle2 size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className={styles.eyebrow}>報名完成</p>
                      <h2>{coupon.title}</h2>
                    </div>
                  </div>
                  <p className={styles.receiptStatus}>
                    {coupon.emailConfigured && coupon.attendeeEmailSent
                      ? "活動資訊已寄到信箱"
                      : "兌換券已建立"}
                  </p>
                  <p className={styles.receiptMeta}>
                    {content.eventDate} · {content.eventTime} · {content.locationName}
                  </p>
                  <button
                    aria-label={`複製兌換碼 ${coupon.code}`}
                    className={`${styles.copyCodeButton} ${styles.tooltipTarget}`}
                    data-copied={copied ? "true" : "false"}
                    data-tooltip="複製兌換碼"
                    onClick={() => copyCouponCode(coupon.code)}
                    type="button"
                  >
                    <span>兌換碼</span>
                    <strong>{coupon.code}</strong>
                    <span className={styles.copyLabel}>{copied ? "已複製" : "複製"}</span>
                    {copied ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )}
                  </button>
                  <p className={styles.receiptBenefit}>
                    可兌換 2026 付費線上工作坊，或 1 小時 AI 諮詢服務。
                  </p>
                  <p className={styles.receiptApplies}>
                    <BadgeCheck size={16} aria-hidden="true" />
                    來賓與引薦人皆適用
                  </p>
                  <div className={styles.receiptActions}>
                    <button
                      className={styles.nextRegistrationButton}
                      onClick={registerAnotherAttendee}
                      type="button"
                    >
                      <UserPlus size={17} aria-hidden="true" />
                      報名下一位
                    </button>
                    <button
                      className={styles.secondaryAction}
                      onClick={() => setPosterFocused(true)}
                      type="button"
                    >
                      <ZoomIn size={17} aria-hidden="true" />
                      查看海報
                    </button>
                  </div>

                  {calendarLinks ? (
                    <div className={styles.calendarRow}>
                      <a
                        className={styles.calendarButton}
                        href={calendarLinks.google}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CalendarPlus size={16} aria-hidden="true" />
                        Google 行事曆
                      </a>
                      <a
                        className={styles.calendarButton}
                        href={calendarLinks.ics}
                        download="bni-invitation.ics"
                      >
                        <CalendarDays size={16} aria-hidden="true" />
                        Apple / Outlook
                      </a>
                    </div>
                  ) : null}

                  <div className={styles.disclosureGroup}>
                    <details className={styles.disclosure}>
                      <summary>
                        <span>活動與講者資訊</span>
                        <ChevronDown
                          className={styles.disclosureIcon}
                          size={18}
                          aria-hidden="true"
                        />
                      </summary>
                      <div className={styles.disclosureContent}>
                        <div className={styles.compactChipGrid}>
                          {eventChips.map(({ icon: Icon, label }) => (
                            <span key={label}>
                              <Icon size={15} aria-hidden="true" />
                              {label}
                            </span>
                          ))}
                        </div>
                        <section className={styles.compactProfile}>
                          <p className={styles.eyebrow}>Speaker</p>
                          <h3>{content.speakerName}</h3>
                          <p>{content.speakerCompany}</p>
                          <p className={styles.muted}>{content.speakerRoles}</p>
                        </section>
                        <div className={styles.linkRow}>
                          {content.linkedinUrl ? (
                            <a
                              className={styles.linkButton}
                              href={content.linkedinUrl}
                              onClick={(e) => openLinkedinPopup(e, content.linkedinUrl)}
                            >
                              <Contact size={18} aria-hidden="true" />
                              個人經歷
                              <ExternalLink size={14} aria-hidden="true" />
                            </a>
                          ) : (
                            <span className={styles.pendingLink}>
                              <Contact size={18} aria-hidden="true" />
                              個人經歷待補
                            </span>
                          )}
                        </div>
                      </div>
                    </details>

                    <details className={styles.disclosure}>
                      <summary>
                        <span>兌換細節</span>
                        <ChevronDown
                          className={styles.disclosureIcon}
                          size={18}
                          aria-hidden="true"
                        />
                      </summary>
                      <div className={styles.disclosureContent}>
                        <p>{coupon.description}</p>
                        <p>
                          兌換資格同時提供給完成報名的來賓與引薦人，請保留兌換碼供後續聯繫使用。
                        </p>
                        {coupon.warning ? (
                          <p className={styles.warningMessage}>{coupon.warning}</p>
                        ) : null}
                      </div>
                    </details>
                  </div>
                </motion.section>
              ) : null}
            </motion.aside>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {posterFocused ? (
          <motion.div
            className={styles.posterModal}
            onClick={() => setPosterFocused(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="活動海報放大檢視"
          >
            <button
              className={styles.closeButton}
              onClick={() => setPosterFocused(false)}
              type="button"
              aria-label="關閉海報"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div
              className={styles.modalImageWrap}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={content.posterImagePath}
                alt={`${content.eventTitle} 活動海報放大檢視`}
                width={1076}
                height={1522}
                sizes="100vw"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {submitState === "submitting" ? (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
            role="status"
            aria-live="polite"
            aria-label="報名送出中，歡迎交流商會點子"
          >
            <motion.div
              className={styles.loadingCard}
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 22 }
              }
            >
              <span className={styles.loadingHalo} aria-hidden="true" />
              <motion.span
                className={styles.loadingIcon}
                aria-hidden="true"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { y: [0, -9, 0], rotate: [-7, 7, -7] }
                }
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lightbulb size={30} aria-hidden="true" />
              </motion.span>
              <p className={styles.loadingTitle}>歡迎交流商會點子</p>
              <p className={styles.loadingHint}>正在為你保留席次與兌換券…</p>
              <span className={styles.loadingDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
