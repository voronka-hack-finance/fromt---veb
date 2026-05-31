"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import {
  buildCalendarCells,
  formatDisplayDate,
  isSameDay,
  monthNames,
  parseDisplayDate,
  weekdayNames,
} from "@/shared/lib/date-format";

import styles from "./app-date-picker.module.css";

type AppDatePickerProps = {
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function AppDatePicker({ ariaLabel, onChange, placeholder, value }: AppDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDisplayDate(value);
  const today = new Date();
  const initialView = selectedDate ?? today;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());
  const wrapRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const parsed = parseDisplayDate(value);

    if (parsed) {
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const cells = buildCalendarCells(viewYear, viewMonth);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleSelect = (date: Date) => {
    onChange(formatDisplayDate(date));
    setOpen(false);
  };

  return (
    <div
      className={[styles.row, open ? styles.rowOpen : ""].join(" ")}
      data-overlay-open={open ? "true" : undefined}
      ref={wrapRef}
    >
      <div className={styles.fieldWrap}>
        <input
          aria-label={ariaLabel}
          className={styles.input}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />

        {open ? (
          <div aria-label={ariaLabel} className={styles.popover} id={calendarId} role="dialog">
            <div className={styles.header}>
              <p className={styles.monthLabel}>
                {monthNames[viewMonth]} {viewYear}
              </p>
              <div className={styles.navGroup}>
                <button
                  aria-label="Предыдущий месяц"
                  className={styles.navButton}
                  onClick={() => shiftMonth(-1)}
                  type="button"
                >
                  <ChevronLeft size={16} strokeWidth={1.8} />
                </button>
                <button
                  aria-label="Следующий месяц"
                  className={styles.navButton}
                  onClick={() => shiftMonth(1)}
                  type="button"
                >
                  <ChevronRight size={16} strokeWidth={1.8} />
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

            <div className={styles.grid}>
              {cells.map(({ date, inCurrentMonth }) => {
                const selected = selectedDate ? isSameDay(date, selectedDate) : false;
                const isToday = isSameDay(date, today);

                return (
                  <button
                    className={[
                      styles.dayButton,
                      !inCurrentMonth ? styles.dayOutside : "",
                      isToday ? styles.dayToday : "",
                      selected ? styles.daySelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={date.toISOString()}
                    onClick={() => handleSelect(date)}
                    type="button"
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className={styles.footer}>
              <button
                className={styles.footerButton}
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                type="button"
              >
                Очистить
              </button>
              <button
                className={styles.footerButton}
                onClick={() => handleSelect(today)}
                type="button"
              >
                Сегодня
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <button
        aria-controls={calendarId}
        aria-expanded={open}
        aria-label={`Открыть календарь: ${ariaLabel.toLowerCase()}`}
        className={[styles.calendarButton, open ? styles.calendarButtonActive : ""].join(" ")}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Calendar size={24} strokeWidth={1.8} />
      </button>
    </div>
  );
}
