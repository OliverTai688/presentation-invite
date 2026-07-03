"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import styles from "./BorderBeam.module.css";

type BorderBeamProps = {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
};

// Hand-ported from Magic UI's Border Beam (magicui.design/docs/components/border-beam):
// a single hairline of light traveling the border of one element via offset-path,
// recolored to the poster's crimson. Scoped to the primary CTA only — a full-bleed
// Dot/Grid Pattern background would compete with the existing mesh-gradient fog.
export function BorderBeam({
  size = 60,
  duration = 8,
  colorFrom = "#c8102e",
  colorTo = "transparent",
}: BorderBeamProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className={styles.beamMask} aria-hidden="true">
      <motion.div
        className={styles.beam}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--from": colorFrom,
            "--to": colorTo,
          } as CSSProperties
        }
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      />
    </div>
  );
}
