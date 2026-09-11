"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./SpeakerProfileModal.module.css";
import type { InvitationContent } from "@/lib/invitation-content";

type Props = {
  content: InvitationContent;
  onClose: () => void;
};

export function SpeakerProfileModal({ content, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

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
      aria-label={`${content.speakerName} 講者介紹`}
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
              <div className={styles.avatarMonogram}>
                {content.speakerName.charAt(0)}
              </div>
            </div>
            <div className={styles.profileTitles}>
              <h2>{content.speakerName}</h2>
              <p className={styles.headline}>{content.speakerRoles}</p>
              <p className={styles.company}>{content.speakerCompany}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3>主題</h3>
            <p className={styles.aboutText}>{content.topic}</p>
            {content.tagline && (
              <p className={styles.tagline}>{content.tagline}</p>
            )}
          </div>

          {content.speakerBio && (
            <div className={styles.section}>
              <h3>關於講者</h3>
              <p className={styles.aboutText}>{content.speakerBio}</p>
            </div>
          )}

          {content.highlights.length > 0 && (
            <div className={styles.section}>
              <h3>品牌亮點</h3>
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

          <div className={styles.section}>
            <h3>活動簡介</h3>
            <p className={styles.aboutText}>{content.description}</p>
          </div>

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
