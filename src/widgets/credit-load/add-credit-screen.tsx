"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";

import { fetchAccounts, fetchDebt, type AccountResponse, type DebtResponse } from "@/shared/api/backend";
import {
  saveCreditAsCategoryLimit,
  updateCreditDebt,
} from "@/shared/api/category-mutations";
import { queryKeys } from "@/shared/api/query-keys";
import { addCreditScreenData } from "@/shared/data/add-credit";
import { AppDatePicker } from "@/shared/ui/app-date-picker/app-date-picker";
import { AppSelect } from "@/shared/ui/app-select/app-select";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { QueryError, QueryLoading } from "@/shared/ui/query-state/query-state";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./add-credit-screen.module.css";

const { title, debtTypes, banks, defaults, placeholders, labels, actions } = addCreditScreenData;
const NO_ACCOUNT_VALUE = "__none__";

function FormCard({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>{label}</h2>
      {children}
    </section>
  );
}

function CurrencyField({
  ariaLabel,
  onChange,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className={styles.fieldWrap}>
      <input
        aria-label={ariaLabel}
        className={styles.fieldInput}
        inputMode="numeric"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <span className={styles.fieldSuffix}>₽</span>
    </div>
  );
}

function TextField({
  ariaLabel,
  onChange,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className={styles.fieldWrap}>
      <input
        aria-label={ariaLabel}
        className={styles.fieldInput}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </div>
  );
}

function formatMoneyInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "";
  }

  return Math.round(amount).toLocaleString("ru-RU");
}

function formatRateInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value.replace(".", ",");
  }

  return amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

function resolveDebtTypeOption(debt: DebtResponse) {
  const source = `${debt.title} ${debt.description ?? ""}`.toLowerCase();

  if (debt.debt_type === "credit_card") {
    return debtTypes[0];
  }

  if (source.includes("ипот")) {
    return debtTypes[1];
  }

  if (source.includes("авто")) {
    return debtTypes[3];
  }

  return debtTypes[2];
}

function extractBankName(description: string | null | undefined) {
  const match = description?.match(/\((.+)\)/);
  return match?.[1]?.trim() || "";
}

function getAccountOptionLabel(account: AccountResponse) {
  const suffix = account.card_last4?.trim() || account.id.slice(-4);
  return `${account.display_name} • ${suffix}`;
}

function AccountSelect({
  accounts,
  ariaLabel,
  onChange,
  value,
}: {
  accounts: AccountResponse[];
  ariaLabel: string;
  onChange: (value: string | null) => void;
  value: string | null;
}) {
  return (
    <div className={styles.fieldWrap}>
      <select
        aria-label={ariaLabel}
        className={styles.fieldSelect}
        onChange={(event) =>
          onChange(event.target.value === NO_ACCOUNT_VALUE ? null : event.target.value)
        }
        value={value ?? NO_ACCOUNT_VALUE}
      >
        <option value={NO_ACCOUNT_VALUE}>Без привязки</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {getAccountOptionLabel(account)}
          </option>
        ))}
      </select>
    </div>
  );
}

function CreditDebtForm({
  debtId,
  initialDebt,
}: {
  debtId?: string;
  initialDebt?: DebtResponse;
}) {
  const isEditMode = Boolean(debtId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const accountsQuery = useQuery({
    queryKey: [...queryKeys.bankAccounts, "raw"],
    queryFn: () => fetchAccounts({ page_size: 100 }),
  });
  const accounts = useMemo(
    () => (accountsQuery.data?.items ?? []).filter((account) => !account.is_archived),
    [accountsQuery.data?.items],
  );
  const [loanAmount, setLoanAmount] = useState<string>(defaults.loanAmount);
  const [debtType, setDebtType] = useState<(typeof debtTypes)[number]>(
    defaults.debtType as (typeof debtTypes)[number],
  );
  const [loanName, setLoanName] = useState<string>(defaults.loanName);
  const [bank, setBank] = useState<string>(defaults.bank);
  const [remainingDebt, setRemainingDebt] = useState<string>(defaults.remainingDebt);
  const [monthlyPayment, setMonthlyPayment] = useState<string>(defaults.monthlyPayment);
  const [paymentDay, setPaymentDay] = useState<string>(defaults.paymentDay);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(defaults.nextPaymentDate);
  const [interestRate, setInterestRate] = useState<string>(defaults.interestRate);
  const [issueDate, setIssueDate] = useState<string>(defaults.issueDate);
  const [initialAmount, setInitialAmount] = useState<string>(defaults.initialAmount);
  const [principalRemaining, setPrincipalRemaining] = useState<string>(defaults.principalRemaining);
  const [linkedAccountId, setLinkedAccountId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!initialDebt || isHydrated) {
      return;
    }

    setLoanAmount(formatMoneyInput(initialDebt.credit_limit ?? initialDebt.remaining_balance));
    setDebtType(resolveDebtTypeOption(initialDebt));
    setLoanName(initialDebt.title);
    setBank(extractBankName(initialDebt.description) || defaults.bank);
    setRemainingDebt(formatMoneyInput(initialDebt.remaining_balance));
    setMonthlyPayment(formatMoneyInput(initialDebt.monthly_payment));
    setPaymentDay(initialDebt.payment_day ? String(initialDebt.payment_day) : "");
    setInterestRate(formatRateInput(initialDebt.interest_rate));
    setInitialAmount(formatMoneyInput(initialDebt.credit_limit));
    setPrincipalRemaining(formatMoneyInput(initialDebt.remaining_balance));
    setLinkedAccountId(initialDebt.account_id ?? null);
    setIsHydrated(true);
  }, [initialDebt, isHydrated]);

  const bankOptions = useMemo(() => {
    const normalized = bank.trim();
    return normalized && !banks.includes(normalized as (typeof banks)[number])
      ? ([normalized, ...banks] as readonly string[])
      : banks;
  }, [bank]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        bank,
        debtType,
        initialAmount,
        interestRate,
        linkedAccountId,
        loanAmount,
        loanName,
        monthlyPayment,
        paymentDay,
        principalRemaining,
        remainingDebt,
      };

      if (debtId) {
        await updateCreditDebt(debtId, payload);
      } else {
        await saveCreditAsCategoryLimit(payload);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.creditLoad });
      await queryClient.invalidateQueries({ queryKey: queryKeys.debts });

      if (debtId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.creditLoadLoan(debtId) });
        router.push(`/credit-load/${debtId}`);
        return;
      }

      router.push("/credit-load");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось сохранить долг");
      setIsSaving(false);
    }
  }

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href={debtId ? `/credit-load/${debtId}` : "/credit-load"}>
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{isEditMode ? "Редактировать долг" : title}</h1>
            </header>
          </Reveal>

          <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
            <Reveal delay={0.07}>
              <FormCard label={labels.loanAmount}>
                <CurrencyField
                  ariaLabel={labels.loanAmount}
                  onChange={setLoanAmount}
                  placeholder={placeholders.loanAmount}
                  value={loanAmount}
                />
              </FormCard>
            </Reveal>

            <Reveal delay={0.1}>
              <FormCard label={labels.debtType}>
                <AppSelect
                  ariaLabel={labels.debtType}
                  onChange={setDebtType}
                  options={debtTypes}
                  value={debtType}
                />
              </FormCard>
            </Reveal>

            <Reveal delay={0.13}>
              <FormCard label={labels.loanName}>
                <TextField
                  ariaLabel={labels.loanName}
                  onChange={setLoanName}
                  placeholder={placeholders.loanName}
                  value={loanName}
                />
              </FormCard>
            </Reveal>

            <Reveal delay={0.16}>
              <FormCard label={labels.bank}>
                <AppSelect ariaLabel={labels.bank} onChange={setBank} options={bankOptions} value={bank} />
              </FormCard>
            </Reveal>

            <Reveal delay={0.19}>
              <FormCard label="Связанный счёт">
                <AccountSelect
                  accounts={accounts}
                  ariaLabel="Связанный счёт"
                  onChange={setLinkedAccountId}
                  value={linkedAccountId}
                />
              </FormCard>
            </Reveal>

            <div className={styles.detailsGroup}>
              <Reveal delay={0.22}>
                <FormCard label={labels.remainingDebt}>
                  <CurrencyField
                    ariaLabel={labels.remainingDebt}
                    onChange={setRemainingDebt}
                    placeholder={placeholders.remainingDebt}
                    value={remainingDebt}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.25}>
                <FormCard label={labels.monthlyPayment}>
                  <CurrencyField
                    ariaLabel={labels.monthlyPayment}
                    onChange={setMonthlyPayment}
                    placeholder={placeholders.monthlyPayment}
                    value={monthlyPayment}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.28}>
                <FormCard label={labels.paymentDay}>
                  <TextField
                    ariaLabel={labels.paymentDay}
                    onChange={setPaymentDay}
                    placeholder={placeholders.paymentDay}
                    value={paymentDay}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.31}>
                <FormCard label={labels.nextPaymentDate}>
                  <AppDatePicker
                    ariaLabel={labels.nextPaymentDate}
                    onChange={setNextPaymentDate}
                    placeholder={placeholders.nextPaymentDate}
                    value={nextPaymentDate}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.34}>
                <FormCard label={labels.interestRate}>
                  <div className={styles.fieldWrap}>
                    <input
                      aria-label={labels.interestRate}
                      className={styles.fieldInput}
                      inputMode="decimal"
                      onChange={(event) => setInterestRate(event.target.value)}
                      placeholder={placeholders.interestRate}
                      type="text"
                      value={interestRate}
                    />
                    <span className={styles.fieldSuffix}>%</span>
                  </div>
                </FormCard>
              </Reveal>

              <Reveal delay={0.37}>
                <FormCard label={labels.issueDate}>
                  <AppDatePicker
                    ariaLabel={labels.issueDate}
                    onChange={setIssueDate}
                    placeholder={placeholders.issueDate}
                    value={issueDate}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.4}>
                <FormCard label={labels.initialAmount}>
                  <CurrencyField
                    ariaLabel={labels.initialAmount}
                    onChange={setInitialAmount}
                    placeholder={placeholders.initialAmount}
                    value={initialAmount}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.43}>
                <FormCard label={labels.principalRemaining}>
                  <CurrencyField
                    ariaLabel={labels.principalRemaining}
                    onChange={setPrincipalRemaining}
                    placeholder={placeholders.principalRemaining}
                    value={principalRemaining}
                  />
                </FormCard>
              </Reveal>

              {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

              <Reveal delay={0.46}>
                <button className={styles.saveButton} disabled={isSaving} type="submit">
                  <span>{isSaving ? "Сохранение..." : isEditMode ? "Сохранить изменения" : actions.save}</span>
                  <Check size={24} strokeWidth={2} />
                </button>
              </Reveal>
            </div>
          </form>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}

export function AddCreditScreenView({ debtId }: { debtId?: string }) {
  const debtQuery = useQuery({
    enabled: Boolean(debtId),
    queryKey: debtId ? queryKeys.debtDetail(debtId) : ["debts", "detail", "new"],
    queryFn: () => fetchDebt(debtId!),
  });

  if (!debtId) {
    return <CreditDebtForm />;
  }

  if (debtQuery.isLoading) {
    return <QueryLoading label="Загрузка долга..." />;
  }

  if (debtQuery.isError || !debtQuery.data) {
    return <QueryError message="Не удалось загрузить долг" onRetry={() => debtQuery.refetch()} />;
  }

  return <CreditDebtForm debtId={debtId} initialDebt={debtQuery.data} />;
}
