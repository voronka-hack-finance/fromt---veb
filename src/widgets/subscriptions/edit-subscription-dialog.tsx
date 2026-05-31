"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import { queryKeys } from "@/shared/api/query-keys";
import type { SubscriptionsResponse } from "@/shared/api/subscriptions";
import { updateRegularExpenseOnBackend } from "@/shared/lib/regular-expenses";

import styles from "./create-subscription-dialog.module.css";

type EditSubscriptionDialogProps = {
  open: boolean;
  subscription: SubscriptionsResponse["subscriptions"][number] | null;
  onClose: () => void;
};

function parseAmount(value: string) {
  const normalized = Number.parseInt(value.replace(/\s/g, ""), 10);
  return Number.isFinite(normalized) ? normalized : 0;
}

export function EditSubscriptionDialog({
  open,
  subscription,
  onClose,
}: EditSubscriptionDialogProps) {
  const titleId = useId();
  const priceId = useId();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!subscription || !open) {
      return;
    }

    setName(subscription.name);
    setMonthlyPrice(String(subscription.monthlyPrice));
    setErrorMessage(null);
  }, [open, subscription]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted || !subscription) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const expenseId = subscription?.id;

    if (!expenseId) {
      return;
    }

    const trimmedName = name.trim();
    const price = parseAmount(monthlyPrice);

    if (!trimmedName || price <= 0 || isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateRegularExpenseOnBackend(expenseId, {
        monthlyPrice: price,
        name: trimmedName,
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      onClose();
    } catch {
      setErrorMessage("Не удалось сохранить изменения. Попробуйте ещё раз.");
    } finally {
      setIsSaving(false);
    }
  }

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            Редактировать подписку
          </h2>
          <button aria-label="Закрыть" className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
          <label className={styles.field}>
            <span>Название</span>
            <input
              autoFocus
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </label>

          <label className={styles.field} htmlFor={priceId}>
            <span>Стоимость, ₽/месяц</span>
            <input
              id={priceId}
              inputMode="numeric"
              min={1}
              onChange={(event) => setMonthlyPrice(event.target.value)}
              required
              type="text"
              value={monthlyPrice}
            />
          </label>

          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

          <button
            className={styles.submitButton}
            disabled={!name.trim() || parseAmount(monthlyPrice) <= 0 || isSaving}
            type="submit"
          >
            {isSaving ? "Сохраняем..." : "Сохранить"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
