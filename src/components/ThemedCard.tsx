/**
 * Example Component Using Theme System
 * Demonstrates proper consumption of CSS custom properties
 * MFEs must use var() instead of hardcoded values
 */

import { JSX } from "react";
import styles from "./ThemedCard.module.css";

export interface ThemedCardProps {
  title: string;
  description: string;
  status?: "success" | "error" | "warning" | "info";
}

export function ThemedCard({
  title,
  description,
  status = "info",
}: ThemedCardProps): JSX.Element {
  const statusLabel = {
    success: "Validated",
    error: "Critical",
    warning: "Attention",
    info: "Operational",
  };

  return (
    <article
      className={`${styles.card} ${styles[status]}`}
      role="article"
      tabIndex={0}
    >
      <div className={styles.statusRow}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span className={styles.statusLabel}>{statusLabel[status]}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
