"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";
import styles from "./SiteBackground.module.css";

// Poster-matched "tech fog" gradient: BNI crimson (#c8102e) and suit
// charcoal-navy (#1c2230) as the two feature colors, floated over cool
// fog neutrals so the overall feel stays soft rather than saturated.
const FOG_COLORS = [
  "#eef1f6",
  "#dde3ec",
  "#c8102e",
  "#1c2230",
  "#e7ebf1",
];

export function SiteBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <MeshGradient
        className={styles.mesh}
        colors={FOG_COLORS}
        distortion={0.72}
        swirl={0.34}
        grainOverlay={0.1}
        speed={shouldReduceMotion ? 0 : 0.28}
      />
      <div className={styles.veil} />
    </div>
  );
}
