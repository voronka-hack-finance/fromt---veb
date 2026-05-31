"use client";

import Link from "next/link";

import { spendingCalendarMockGroups } from "@/shared/data/spending-calendar";
import type { SpendingCalendarGroup } from "@/shared/lib/spending-calendar";

type SpendingCalendarGroupsProps = {
  groups?: ReadonlyArray<SpendingCalendarGroup> | null;
  styles: Record<string, string>;
  dateTag?: "span" | "strong";
  totalTag?: "span" | "strong";
};

export function SpendingCalendarGroups({
  dateTag: DateTag = "span",
  groups,
  styles,
  totalTag: TotalTag = "strong",
}: SpendingCalendarGroupsProps) {
  const safeGroups =
    groups && groups.length > 0 ? groups : spendingCalendarMockGroups;

  return (
    <div className={styles.calendarGroups}>
      {safeGroups.map((group) => (
        <div className={styles.calendarGroup} key={`${group.date}-${group.total}`}>
          <div className={styles.calendarGroupHeader}>
            <DateTag>{group.date}</DateTag>
            <div className={styles.calendarDivider} />
            <TotalTag>{group.total}</TotalTag>
          </div>

          <div className={styles.calendarList}>
            {group.items.map((item) => {
              const content = (
                <>
                  <div className={styles.calendarItemMeta}>
                    <div className={styles.calendarBadge}>{item.badge}</div>
                    {styles.calendarTextBlock ? (
                      <div className={styles.calendarTextBlock}>
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                      </div>
                    ) : (
                      <div>
                        <div className={styles.calendarCategory}>{item.category}</div>
                        <div className={styles.calendarTitle}>{item.title}</div>
                      </div>
                    )}
                  </div>
                  <strong className={styles.calendarAmount}>{item.amount}</strong>
                </>
              );

              if (item.id && !item.id.startsWith("mock-")) {
                return (
                  <Link
                    className={styles.calendarItem}
                    href={`/operations/${item.id}`}
                    key={item.id}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div className={styles.calendarItem} key={item.id}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
