import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import Image from "next/image";
import { speakerData } from "@/lib/speaker-data";
import styles from "./SpeakerProfileModal.module.css";

type SpeakerProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  speakerImageUrl: string;
};

export default function SpeakerProfileModal({ isOpen, onClose, speakerImageUrl }: SpeakerProfileModalProps) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const profile = speakerData[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.header}>
              <div className={styles.langToggle}>
                <Globe size={16} />
                <button
                  className={`${styles.langBtn} ${lang === "zh" ? styles.active : ""}`}
                  onClick={() => setLang("zh")}
                >
                  ZH
                </button>
                <span className={styles.divider}>/</span>
                <button
                  className={`${styles.langBtn} ${lang === "en" ? styles.active : ""}`}
                  onClick={() => setLang("en")}
                >
                  EN
                </button>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={speakerImageUrl || "/assets/bni-invitation-poster-2026-07-09.png"} // fallback if needed
                    alt={profile.name}
                    width={100}
                    height={100}
                    className={styles.avatar}
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                </div>
                <div className={styles.profileTitles}>
                  <h2>{profile.name}</h2>
                  <p className={styles.headline}>{profile.headline}</p>
                  <p className={styles.company}>{profile.company}</p>
                </div>
              </div>

              <div className={styles.section}>
                <h3>{lang === "zh" ? "關於我" : "About"}</h3>
                <p className={styles.aboutText}>{profile.about}</p>
              </div>

              <div className={styles.section}>
                <h3>{lang === "zh" ? "經歷" : "Experience"}</h3>
                <ul className={styles.experienceList}>
                  {profile.experiences.map((exp, idx) => (
                    <li key={idx} className={styles.experienceItem}>
                      <div className={styles.expDot} />
                      <div className={styles.expDetails}>
                        <h4 className={styles.expTitle}>{exp.title}</h4>
                        <p className={styles.expCompany}>
                          {exp.company}
                          {exp.location ? ` · ${exp.location}` : ""}
                        </p>
                        <p className={styles.expPeriod}>{exp.period}</p>
                        {exp.highlights?.length ? (
                          <ul className={styles.expHighlights}>
                            {exp.highlights.map((highlight, hIdx) => (
                              <li key={hIdx}>{highlight}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {profile.education?.length ? (
                <div className={styles.section}>
                  <h3>{lang === "zh" ? "學歷" : "Education"}</h3>
                  <ul className={styles.experienceList}>
                    {profile.education.map((edu, idx) => (
                      <li key={idx} className={styles.experienceItem}>
                        <div className={styles.expDot} />
                        <div className={styles.expDetails}>
                          <h4 className={styles.expTitle}>{edu.school}</h4>
                          <p className={styles.expCompany}>{edu.degree}</p>
                          <p className={styles.expPeriod}>{edu.period}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
