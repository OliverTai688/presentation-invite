"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Contact,
  Copy,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Ticket,
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

export function InvitationExperience({
  content,
}: {
  content: InvitationContent;
}) {
  const [opened, setOpened] = useState(false);
  const [posterFocused, setPosterFocused] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const couponRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

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

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        source: "public-invitation",
      }),
    });

    const result = await response.json();

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
    } else {
      toast.success("報名完成，兌換券已建立。");
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

  function scrollToForm() {
    formRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  async function copyCouponCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("兌換碼已複製。");
    } catch {
      toast.error("無法複製兌換碼，請手動選取。");
    }
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
              className={styles.invitationCard}
              onClick={() => setOpened(true)}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              type="button"
            >
              <span className={styles.cardTopline}>{content.chapterName}</span>
              <span className={styles.cardTitle}>{content.eventTitle}</span>
              <span className={styles.cardMeta}>
                {content.eventDate} / {content.eventTime}
              </span>
              <span className={styles.cardSpeaker}>
                {content.speakerCompany} · {content.speakerName}
              </span>
              <span className={styles.cardAction}>
                <Sparkles size={18} aria-hidden="true" />
                開啟邀請函
              </span>
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            key="experience"
            className={styles.experience}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <section className={styles.posterColumn} aria-label="活動海報">
              <div className={styles.posterToolbar}>
                <div>
                  <p>{content.chapterName}</p>
                  <h1>{content.eventTitle}</h1>
                </div>
                <button
                  className={styles.iconButton}
                  onClick={() => setPosterFocused(true)}
                  type="button"
                  aria-label="放大海報"
                >
                  <ZoomIn size={18} aria-hidden="true" />
                </button>
                <button
                  className={styles.rsvpButton}
                  onClick={scrollToForm}
                  type="button"
                >
                  <ArrowDown size={17} aria-hidden="true" />
                  報名
                </button>
              </div>
              <motion.button
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
                  sizes="(max-width: 900px) 100vw, 58vw"
                  loading="eager"
                  priority
                />
              </motion.button>
            </section>

            <aside className={styles.sidePanel} aria-label="活動資訊與報名">
              <div className={styles.chipGrid}>
                {eventChips.map(({ icon: Icon, label }) => (
                  <div className={styles.infoChip} key={label}>
                    <Icon size={18} aria-hidden="true" />
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

              <div className={styles.linkRow}>
                <a
                  className={styles.linkButton}
                  href={content.meetNuvaUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe2 size={18} aria-hidden="true" />
                  meetnuva.com
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                {content.linkedinUrl ? (
                  <a
                    className={styles.linkButton}
                    href={content.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Contact size={18} aria-hidden="true" />
                    LinkedIn
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <span className={styles.pendingLink}>
                    <Contact size={18} aria-hidden="true" />
                    LinkedIn 待補
                  </span>
                )}
              </div>

              <form
                className={styles.form}
                id="rsvp"
                onSubmit={submitRegistration}
                ref={formRef}
              >
                <div className={styles.formHeader}>
                  <p className={styles.eyebrow}>RSVP</p>
                  <h2>保留席次與兌換券</h2>
                </div>
                <label htmlFor="registration-name">
                  <span>
                    <UserRound size={16} aria-hidden="true" />
                    報名姓名
                  </span>
                  <input
                    id="registration-name"
                    aria-label="報名姓名"
                    value={form.name}
                    onChange={updateField("name")}
                    autoComplete="name"
                    required
                  />
                </label>
                <label htmlFor="registration-line">
                  <span>
                    <MessageCircle size={16} aria-hidden="true" />
                    LINE ID
                  </span>
                  <input
                    id="registration-line"
                    aria-label="LINE ID"
                    value={form.lineId}
                    onChange={updateField("lineId")}
                    required
                  />
                  <small className={styles.fieldHint}>
                    用於活動前聯繫與報到確認。
                  </small>
                </label>
                <label htmlFor="registration-email">
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
                    required
                  />
                  <small className={styles.fieldHint}>
                    會寄送報名確認與兌換券資訊。
                  </small>
                </label>
                <label htmlFor="registration-referrer">
                  <span>引薦人</span>
                  <input
                    id="registration-referrer"
                    aria-label="引薦人"
                    value={form.referrerName}
                    onChange={updateField("referrerName")}
                  />
                </label>
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
              </form>

              {coupon ? (
                <motion.section
                  className={styles.coupon}
                  ref={couponRef}
                  tabIndex={-1}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div>
                    <p className={styles.eyebrow}>Voucher</p>
                    <h2>{coupon.title}</h2>
                  </div>
                  <p>{coupon.description}</p>
                  <div className={styles.couponAudience}>
                    <span>
                      <UserRound size={15} aria-hidden="true" />
                      來賓可兌換
                    </span>
                    <span>
                      <MessageCircle size={15} aria-hidden="true" />
                      引薦人可兌換
                    </span>
                  </div>
                  <button
                    className={styles.copyCodeButton}
                    onClick={() => copyCouponCode(coupon.code)}
                    type="button"
                  >
                    <strong>{coupon.code}</strong>
                    <Copy size={16} aria-hidden="true" />
                  </button>
                  <span className={styles.couponStatus}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {coupon.emailConfigured && coupon.attendeeEmailSent
                      ? "確認信已寄出"
                      : "兌換券已建立"}
                  </span>
                </motion.section>
              ) : null}
            </aside>
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
    </main>
  );
}
