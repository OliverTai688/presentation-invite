"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import styles from "./SpeakerProfileModal.module.css";
import type { InvitationContent, Speaker } from "@/lib/invitation-content";

type Props = {
  content: InvitationContent;
  speaker: Speaker;
  onClose: () => void;
};

export function SpeakerProfileModal({ content, speaker, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const partners = content.speakers.filter((s) => s.name !== speaker.name);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.name} 講者介紹`}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.langToggle}>講者介紹</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              {speaker.photo ? (
                <Image
                  src={speaker.photo}
                  alt={speaker.name}
                  width={180}
                  height={180}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarMonogram}>
                  {speaker.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.profileTitles}>
              <h2>{speaker.name}</h2>
              <p className={styles.headline}>{speaker.role}</p>
              <p className={styles.company}>{speaker.company}</p>
            </div>
          </div>

          {speaker.bio && (
            <div className={styles.section}>
              <h3>本場分享</h3>
              <p className={styles.aboutText}>{speaker.bio}</p>
            </div>
          )}

          <div className={styles.section}>
            <h3>主題</h3>
            <p className={styles.aboutText}>{content.topic}</p>
            {content.tagline && (
              <p className={styles.tagline}>{content.tagline}</p>
            )}
          </div>

          {content.highlights.length > 0 && (
            <div className={styles.section}>
              <h3>分享重點</h3>
              <ul className={styles.highlightList}>
                {content.highlights.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {partners.length > 0 && (
            <div className={styles.section}>
              <h3>搭檔講者</h3>
              <p className={styles.aboutText}>
                {partners
                  .map((p) => `${p.company} ${p.role} ${p.name}`)
                  .join("、")}
              </p>
            </div>
          )}

          {content.referralAudience && (
            <div className={styles.section}>
              <h3>引薦對象</h3>
              <p className={styles.aboutText}>{content.referralAudience}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
