"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { addCreditScreenData } from "@/shared/data/add-credit";
import { AppDatePicker } from "@/shared/ui/app-date-picker/app-date-picker";
import { AppSelect } from "@/shared/ui/app-select/app-select";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./add-credit-screen.module.css";

const { title, debtTypes, banks, defaults, placeholders, labels, actions } = addCreditScreenData;

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

export function AddCreditScreenView() {
  const [loanAmount, setLoanAmount] = useState<string>(defaults.loanAmount);
  const [debtType, setDebtType] = useState<(typeof debtTypes)[number]>(defaults.debtType as (typeof debtTypes)[number]);
  const [loanName, setLoanName] = useState<string>(defaults.loanName);
  const [bank, setBank] = useState<(typeof banks)[number]>(defaults.bank as (typeof banks)[number]);
  const [remainingDebt, setRemainingDebt] = useState<string>(defaults.remainingDebt);
  const [monthlyPayment, setMonthlyPayment] = useState<string>(defaults.monthlyPayment);
  const [paymentDay, setPaymentDay] = useState<string>(defaults.paymentDay);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(defaults.nextPaymentDate);
  const [interestRate, setInterestRate] = useState<string>(defaults.interestRate);
  const [issueDate, setIssueDate] = useState<string>(defaults.issueDate);
  const [initialAmount, setInitialAmount] = useState<string>(defaults.initialAmount);
  const [principalRemaining, setPrincipalRemaining] = useState<string>(defaults.principalRemaining);

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/credit-load">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{title}</h1>
            </header>
          </Reveal>

          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
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
                <AppSelect ariaLabel={labels.bank} onChange={setBank} options={banks} value={bank} />
              </FormCard>
            </Reveal>

            <div className={styles.detailsGroup}>
              <Reveal delay={0.19}>
                <FormCard label={labels.remainingDebt}>
                  <CurrencyField
                    ariaLabel={labels.remainingDebt}
                    onChange={setRemainingDebt}
                    placeholder={placeholders.remainingDebt}
                    value={remainingDebt}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.22}>
                <FormCard label={labels.monthlyPayment}>
                  <CurrencyField
                    ariaLabel={labels.monthlyPayment}
                    onChange={setMonthlyPayment}
                    placeholder={placeholders.monthlyPayment}
                    value={monthlyPayment}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.25}>
                <FormCard label={labels.paymentDay}>
                  <TextField
                    ariaLabel={labels.paymentDay}
                    onChange={setPaymentDay}
                    placeholder={placeholders.paymentDay}
                    value={paymentDay}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.28}>
                <FormCard label={labels.nextPaymentDate}>
                  <AppDatePicker
                    ariaLabel={labels.nextPaymentDate}
                    onChange={setNextPaymentDate}
                    placeholder={placeholders.nextPaymentDate}
                    value={nextPaymentDate}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.31}>
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

              <Reveal delay={0.34}>
                <FormCard label={labels.issueDate}>
                  <AppDatePicker
                    ariaLabel={labels.issueDate}
                    onChange={setIssueDate}
                    placeholder={placeholders.issueDate}
                    value={issueDate}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.37}>
                <FormCard label={labels.initialAmount}>
                  <CurrencyField
                    ariaLabel={labels.initialAmount}
                    onChange={setInitialAmount}
                    placeholder={placeholders.initialAmount}
                    value={initialAmount}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.4}>
                <FormCard label={labels.principalRemaining}>
                  <CurrencyField
                    ariaLabel={labels.principalRemaining}
                    onChange={setPrincipalRemaining}
                    placeholder={placeholders.principalRemaining}
                    value={principalRemaining}
                  />
                </FormCard>
              </Reveal>

              <Reveal delay={0.43}>
                <button className={styles.saveButton} type="submit">
                  <span>{actions.save}</span>
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
