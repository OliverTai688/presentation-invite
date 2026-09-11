"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import styles from "./SiteBackground.module.css";

export function SiteBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <MeshGradient
        className={styles.mesh}
        /* Warm ivory ground with a breath of crimson and champagne —
           the quiet-luxury tone of the 靜奢之境 poster. */
        colors={["#efeae4", "#f6efe6", "#e6d9d2", "#f3e7dc", "#e4dcd4"]}
        speed={0.6}
      />
      <div className={styles.veil} />
    </div>
  );
}
