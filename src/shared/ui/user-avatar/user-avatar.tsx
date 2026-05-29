"use client";

import { useAssetsQuery } from "@/shared/api/assets";

import styles from "./user-avatar.module.css";

type UserAvatarProps = {
  "aria-label"?: string;
  className?: string;
  onClick?: () => void;
};

export function UserAvatar({
  "aria-label": ariaLabel = "Профиль",
  className,
  onClick,
}: UserAvatarProps) {
  const assetsQuery = useAssetsQuery();
  const classNames = className ? `${styles.avatar} ${className}` : styles.avatar;

  if (assetsQuery.isLoading) {
    return <div aria-hidden className={classNames} />;
  }

  const avatarSrc = assetsQuery.data?.userAvatarSrc;

  if (!avatarSrc) {
    return null;
  }

  if (onClick) {
    return (
      <button aria-label={ariaLabel} className={classNames} onClick={onClick} type="button">
        <img alt="" aria-hidden className={styles.image} draggable={false} src={avatarSrc} />
      </button>
    );
  }

  return (
    <div aria-label={ariaLabel} className={classNames} role="img">
      <img alt="" aria-hidden className={styles.image} draggable={false} src={avatarSrc} />
    </div>
  );
}
