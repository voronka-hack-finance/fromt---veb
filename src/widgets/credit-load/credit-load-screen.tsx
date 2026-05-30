"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Plus,
  Wallet,
} from "lucide-react";

import {
  useCreditLoadQuery,
  type CreditLoadPaymentIcon,
  type CreditLoadResponse,
  type CreditLoadUpcomingPayment,
} from "@/shared/api/credit-load";
import {
  buildCalendarCells,
  isSameDay,
  monthNames,
  weekdayNames,
} from "@/shared/lib/date-format";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/cn";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./credit-load-screen.module.css";

const paymentIconSources: Record<"mts" | "vk", string> = {
  mts: "/subscriptions/mts-premium.png",
  vk: "/subscriptions/vk-music.png",
};

function formatPaymentAmount(value: number) {
  const amount = formatCurrencyParts(Math.abs(value));
  return `–${amount.whole} ₽`;
}

function PaymentIcon({ icon }: { icon: CreditLoadPaymentIcon }) {
  if (icon === "education") {
    return (
      <span className={styles.paymentIconFallback} aria-hidden>
        <GraduationCap size={16} strokeWidth={1.8} />
      </span>
    );
  }

  if (icon === "yandex") {
    return (
      <span aria-hidden className={styles.paymentIconBadge}>
        Я+
      </span>
    );
  }

  if (icon === "generic") {
    return (
      <span className={styles.paymentIconFallback} aria-hidden>
        <Wallet size={16} strokeWidth={1.8} />
      </span>
    );
  }

  return (
    <img
      alt=""
      aria-hidden
      className={styles.paymentIconImage}
      draggable={false}
      src={paymentIconSources[icon]}
    />
  );
}

function PaymentCard({ payment }: { payment: CreditLoadUpcomingPayment }) {
  return (
    <article className={styles.paymentCard}>
      <div className={styles.paymentRow}>
        <div className={styles.paymentIconWrap}>
          <PaymentIcon icon={payment.icon} />
        </div>

        <div className={styles.paymentText}>
          <p className={styles.paymentDate}>{payment.dateLabel}</p>
          <p className={styles.paymentTitle}>{payment.title}</p>
        </div>

        <p className={styles.paymentAmount}>{formatPaymentAmount(payment.amount)}</p>
      </div>
    </article>
  );
}

function CreditLoadCalendar({
  paymentDays,
  selectedDate,
  viewMonth,
  viewYear,
  onSelectDate,
  onShiftMonth,
}: {
  paymentDays: number[];
  selectedDate: Date;
  viewMonth: number;
  viewYear: number;
  onSelectDate: (date: Date) => void;
  onShiftMonth: (delta: number) => void;
}) {
  const cells = buildCalendarCells(viewYear, viewMonth);
  const paymentDaySet = useMemo(() => new Set(paymentDays), [paymentDays]);

  return (
    <section className={styles.calendarCard}>
      <div className={styles.calendarHeader}>
        <p className={styles.calendarMonth}>
          {monthNames[viewMonth]} {viewYear}
        </p>
        <div className={styles.calendarNav}>
          <button
            aria-label="Предыдущий месяц"
            className={styles.calendarNavButton}
            onClick={() => onShiftMonth(-1)}
            type="button"
          >
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
          <button
            aria-label="Следующий месяц"
            className={styles.calendarNavButton}
            onClick={() => onShiftMonth(1)}
            type="button"
          >
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {weekdayNames.map((weekday) => (
          <span className={styles.weekday} key={weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {cells.map(({ date, inCurrentMonth }) => {
          const selected = isSameDay(date, selectedDate);
          const hasPayment =
            inCurrentMonth &&
            date.getMonth() === viewMonth &&
            paymentDaySet.has(date.getDate());

          return (
            <button
              className={cn(
                styles.dayButton,
                !inCurrentMonth && styles.dayOutside,
                selected && styles.daySelected,
              )}
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              type="button"
            >
              <span className={styles.dayLabel}>{date.getDate()}</span>
              {hasPayment ? <span aria-hidden className={styles.dayDot} /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function CreditLoadScreenView() {
  const query = useCreditLoadQuery();

  return (
    <QueryBoundary loadingLabel="Загрузка нагрузки..." query={query}>
      {(screenData) => <CreditLoadScreenContent screenData={screenData} />}
    </QueryBoundary>
  );
}

function CreditLoadScreenContent({ screenData }: { screenData: CreditLoadResponse }) {
  const initialSelectedDate = useMemo(
    () =>
      new Date(
        screenData.calendar.year,
        screenData.calendar.month,
        screenData.calendar.selectedDay,
      ),
    [screenData.calendar.month, screenData.calendar.selectedDay, screenData.calendar.year],
  );

  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [viewYear, setViewYear] = useState(screenData.calendar.year);
  const [viewMonth, setViewMonth] = useState(screenData.calendar.month);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{screenData.title}</h1>
              <span aria-hidden className={styles.backButton} style={{ visibility: "hidden" }} />
            </header>
          </Reveal>

          <div className={styles.content}>
            <Reveal delay={0.07}>
              <CreditLoadCalendar
                onSelectDate={setSelectedDate}
                onShiftMonth={shiftMonth}
                paymentDays={screenData.calendar.paymentDays}
                selectedDate={selectedDate}
                viewMonth={viewMonth}
                viewYear={viewYear}
              />
            </Reveal>

            <Reveal delay={0.11}>
              <section className={styles.paymentsSection}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionLine} />
                  <h2 className={styles.sectionTitle}>Ближайшие платежи</h2>
                  <span className={styles.sectionLine} />
                </div>

                <Link className={styles.addButton} href="/credit-load/add">
                  <span>Добавить кредит</span>
                  <Plus size={20} strokeWidth={2} />
                </Link>

                <div className={styles.paymentsList}>
                  {screenData.upcomingPayments.map((payment, index) => (
                    <Reveal delay={0.14 + index * 0.04} key={payment.id}>
                      <PaymentCard payment={payment} />
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
