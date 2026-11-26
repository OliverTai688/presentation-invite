"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import styles from "./SiteBackground.module.css";

export function SiteBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <MeshGradient
        className={styles.mesh}
        /* Warm ivory ground with a breath of crimson and champagne —
           the warm ivory / crimson tone of the event poster. */
        colors={["#efeae4", "#f6efe6", "#e6d9d2", "#f3e7dc", "#dfe6e5"]}
        speed={0.6}
      />
      <div className={styles.veil} />
    </div>
  );
}
