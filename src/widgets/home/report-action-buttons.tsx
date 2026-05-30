import { cn } from "@/shared/lib/cn";

import styles from "./report-action-buttons.module.css";

const assets = {
  exportIcon: "/desktop/actions/export-icon.svg",
  importIcon: "/desktop/actions/import-icon.svg",
} as const;

type ReportActionButtonsProps = {
  className?: string;
  variant?: "row" | "stack" | "panel";
};

export function ReportActionButtons({ className, variant = "row" }: ReportActionButtonsProps) {
  return (
    <div
      className={cn(
        styles.actions,
        variant === "stack" && styles.stack,
        variant === "panel" && styles.panel,
        className,
      )}
    >
      <button className={styles.primary} type="button">
        <img alt="" aria-hidden className={styles.icon} draggable={false} src={assets.importIcon} />
        <span className={styles.label}>Загрузить отчеты с банков</span>
      </button>
      <button className={styles.secondary} type="button">
        <img alt="" aria-hidden className={styles.icon} draggable={false} src={assets.exportIcon} />
        <span className={styles.label}>Выгрузить отчеты с Заначки</span>
      </button>
    </div>
  );
}
