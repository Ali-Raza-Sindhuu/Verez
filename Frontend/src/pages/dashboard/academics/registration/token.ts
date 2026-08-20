export const cx = {
  card: "rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)]",
  cardAlt: "rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface-alt)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  border: "border-[var(--color-border-hairline)]",
  borderStrong: "border-[var(--color-border-strong)]",
  accentChip: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  accentBtn:
    "bg-[var(--color-accent-primary)] text-white hover:opacity-90 transition-opacity shadow-[var(--shadow-cta-glow)]",
  ghostBtn:
    "border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors",
  dropdown: "bg-[var(--color-surface)] border-[var(--color-border-hairline)] shadow-[var(--shadow-lifted)]",
  danger: "text-[var(--color-accent-danger)]",
  dangerChip: "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)]",
  success: "text-[var(--color-accent-success)]",
  successChip: "bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]",
};

export const categoryLabel: Record<string, string> = {
  core: "Core",
  elective: "Elective",
  "gen-ed": "General Education",
};

export const categoryChipClass: Record<string, string> = {
  core: cx.accentChip,
  elective: "bg-[#9277ff]/10 text-[#9277ff]",
  "gen-ed": cx.successChip,
};