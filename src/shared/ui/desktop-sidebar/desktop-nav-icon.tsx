import { cn } from "@/shared/lib/cn";

import styles from "./desktop-nav-icon.module.css";

export type DesktopNavIconId =
  | "home"
  | "categories"
  | "goals"
  | "accounts"
  | "ai"
  | "settings"
  | "logout";

type DesktopNavIconProps = {
  active?: boolean;
  className?: string;
  id: DesktopNavIconId;
};

export function DesktopNavIcon({ active = false, className, id }: DesktopNavIconProps) {
  const suffix = active ? "active" : "inactive";

  return (
    <img
      alt=""
      aria-hidden
      className={cn(styles.icon, className)}
      draggable={false}
      src={`/desktop/nav/${id}-${suffix}.svg`}
    />
  );
}
