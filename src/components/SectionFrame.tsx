import { JSX, ReactNode } from "react";

interface SectionFrameProps {
  children: ReactNode;
  className?: string;
}

export function SectionFrame({
  children,
  className = "",
}: SectionFrameProps): JSX.Element {
  return (
    <div
      className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
