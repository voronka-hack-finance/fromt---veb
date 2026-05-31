"use client";

import { useEffect, useId, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import { queryKeys } from "@/shared/api/query-keys";
import { createGoalOnBackend } from "@/shared/lib/goals-screen";

import styles from "./create-goal-dialog.module.css";

type CreateGoalDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateGoalDialog({ open, onClose }: CreateGoalDialogProps) {
  const titleId = useId();
  const targetId = useId();
  const currentId = useId();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createGoalOnBackend({
        currentAmount: Number(currentAmount.replace(/\s/g, "")) || 0,
        targetAmount: Number(targetAmount.replace(/\s/g, "")),
        title,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      setTitle("");
      setTargetAmount("");
      setCurrentAmount("");
      setErrorMessage(null);
      onClose();
    },
    onError: () => {
      setErrorMessage("Не удалось создать цель. Попробуйте ещё раз.");
    },
  });

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

  if (!open) {
    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = Number(targetAmount.replace(/\s/g, ""));

    if (!title.trim() || !Number.isFinite(target) || target <= 0 || mutation.isPending) {
      return;
    }

    setErrorMessage(null);
    mutation.mutate();
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <dialog
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        open
      >
        <div className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            Новая цель
          </h2>
          <button aria-label="Закрыть" className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Название</span>
            <input
              autoFocus
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, отпуск"
              required
              type="text"
              value={title}
            />
          </label>

          <label className={styles.field} htmlFor={targetId}>
            <span>Сумма цели, ₽</span>
            <input
              id={targetId}
              inputMode="numeric"
              min={1}
              onChange={(event) => setTargetAmount(event.target.value)}
              placeholder="250 000"
              required
              type="text"
              value={targetAmount}
            />
          </label>

          <label className={styles.field} htmlFor={currentId}>
            <span>Уже накоплено, ₽</span>
            <input
              id={currentId}
              inputMode="numeric"
              min={0}
              onChange={(event) => setCurrentAmount(event.target.value)}
              placeholder="0"
              type="text"
              value={currentAmount}
            />
          </label>

          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

          <button className={styles.submitButton} disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Сохраняем..." : "Создать цель"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
