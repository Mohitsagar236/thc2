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
  return (
    <article className={`${styles.card} ${styles[status]}`} role="article">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
