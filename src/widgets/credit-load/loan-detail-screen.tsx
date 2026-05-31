"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { deleteDebt } from "@/shared/api/backend";
import {
  useCreditLoadLoanQuery,
  type CreditLoadLoanDetailResponse,
} from "@/shared/api/credit-load-loan";
import { queryKeys } from "@/shared/api/query-keys";
import { formatCurrencyParts } from "@/shared/lib/formatters";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryBoundary } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./loan-detail-screen.module.css";

function formatRubles(value: number) {
  return `${formatCurrencyParts(Math.round(value)).whole} ₽`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className={styles.detailRow}>
        <p className={styles.detailLabel}>{label}</p>
        <p className={styles.detailValue}>{value}</p>
      </div>
      <div aria-hidden className={styles.divider} />
    </>
  );
}

function LoanDetailContent({ loan }: { loan: CreditLoadLoanDetailResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isBackendDebt = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    loan.id,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm("Удалить этот долг?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDebt(loan.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.creditLoad });
      await queryClient.invalidateQueries({ queryKey: queryKeys.debts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.creditLoadLoan(loan.id) });
      router.push("/credit-load");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Не удалось удалить долг");
      setIsDeleting(false);
    }
  }

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.iconButton} href="/credit-load">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{loan.title}</h1>
              {isBackendDebt ? (
                <Link
                  aria-label="Редактировать долг"
                  className={styles.iconButton}
                  href={`/credit-load/${loan.id}/edit`}
                >
                  <Pencil size={24} strokeWidth={1.8} />
                </Link>
              ) : (
                <span aria-hidden className={styles.iconButton} style={{ visibility: "hidden" }} />
              )}
            </header>
          </Reveal>

          <Reveal delay={0.08}>
            <section className={styles.card}>
              <div className={styles.bankRow}>
                <p className={styles.bankLabel}>Банк кредитор</p>
                <img
                  alt=""
                  className={styles.bankLogo}
                  draggable={false}
                  height={loan.bankLogoHeight}
                  src={loan.bankLogo}
                  width={loan.bankLogoWidth}
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${loan.paidPercent}%` }} />
                </div>

                <div className={styles.paidRow}>
                  <p className={styles.paidLabel}>Выплачено</p>
                  <p className={styles.paidValue}>{loan.paidPercent}%</p>
                </div>

                <div aria-hidden className={styles.divider} />

                <DetailRow label="Ежемесячный платёж" value={formatRubles(loan.monthlyPayment)} />
                <DetailRow label="Остаток по долгу" value={formatRubles(loan.remainingBalance)} />
                <DetailRow label="Годовой процент" value={loan.annualRate} />

                <div className={styles.remainingBlock}>
                  <p className={styles.remainingLabel}>Осталось выплачивать</p>
                  <p className={styles.remainingValue}>{loan.remainingDuration}</p>
                </div>
              </div>
            </section>
          </Reveal>

          {isBackendDebt ? (
            <>
              <Reveal delay={0.12}>
                <button
                  className={styles.deleteButton}
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                  type="button"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                  <span>{isDeleting ? "Удаление..." : "Удалить долг"}</span>
                </button>
              </Reveal>

              {deleteError ? <p className={styles.errorMessage}>{deleteError}</p> : null}
            </>
          ) : null}
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function LoanDetailScreenView({ loanId }: { loanId: string }) {
  const query = useCreditLoadLoanQuery(loanId);

  return (
    <QueryBoundary loadingLabel="Загрузка кредита..." query={query}>
      {(loan) => <LoanDetailContent loan={loan} />}
    </QueryBoundary>
  );
}
