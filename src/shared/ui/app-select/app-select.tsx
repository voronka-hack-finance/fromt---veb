"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import styles from "./app-select.module.css";

type AppSelectProps<T extends string> = {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
};

export function AppSelect<T extends string>({
  ariaLabel,
  onChange,
  options,
  value,
}: AppSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

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

  return (
    <div className={[styles.wrap, open ? styles.wrapOpen : ""].join(" ")} ref={wrapRef}>
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={[styles.trigger, open ? styles.triggerOpen : ""].join(" ")}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className={styles.label}>{value}</span>
        <span aria-hidden className={[styles.icon, open ? styles.iconOpen : ""].join(" ")}>
          <ChevronDown size={14} strokeWidth={1.8} />
        </span>
      </button>

      {open ? (
        <ul className={styles.list} id={listboxId} role="listbox">
          {options.map((option) => {
            const selected = option === value;

            return (
              <li key={option} role="presentation">
                <button
                  aria-selected={selected}
                  className={selected ? styles.optionSelected : styles.option}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
