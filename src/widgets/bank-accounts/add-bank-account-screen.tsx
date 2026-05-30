"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import {
  addBankAccountScreenData,
  type AddBankAccountOption,
} from "@/shared/data/add-bank-account";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./add-bank-account-screen.module.css";

const { title, searchPlaceholder, bankLabel, banks, cta } = addBankAccountScreenData;

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function matchesBank(bank: AddBankAccountOption, query: string) {
  if (!query) {
    return true;
  }

  const displayName = bank.name ?? "";
  const haystack = [displayName, ...bank.searchTerms].join(" ").toLowerCase();
  return haystack.includes(query);
}

function BankCard({ bank }: { bank: AddBankAccountOption }) {
  return (
    <button className={styles.bankCard} type="button">
      <div className={styles.bankCardInner}>
        <div className={styles.bankLogoWrap}>
          <img alt="" aria-hidden className={styles.bankLogo} draggable={false} height={55} src={bank.logo} width={55} />
        </div>
        <div className={styles.bankInfo}>
          <p className={styles.bankLabel}>{bankLabel}</p>
          {bank.name ? <p className={styles.bankName}>{bank.name}</p> : null}
          {bank.nameImage ? (
            <img alt="" aria-hidden className={styles.bankNameImage} draggable={false} src={bank.nameImage} />
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function AddBankAccountScreenView() {
  const [search, setSearch] = useState("");

  const filteredBanks = useMemo(() => {
    const query = normalizeSearch(search);
    return banks.filter((bank) => matchesBank(bank, query));
  }, [search]);

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <Reveal delay={0.03}>
            <header className={styles.header}>
              <Link aria-label="Назад" className={styles.backButton} href="/bank-accounts">
                <ArrowLeft size={24} strokeWidth={1.9} />
              </Link>
              <h1 className={styles.title}>{title}</h1>
            </header>
          </Reveal>

          <Reveal delay={0.06}>
            <label className={styles.searchBar}>
              <Search aria-hidden className={styles.searchIcon} size={24} strokeWidth={1.8} />
              <input
                className={styles.searchInput}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                type="search"
                value={search}
              />
            </label>
          </Reveal>

          <Reveal delay={0.09}>
            <div className={styles.bankList}>
              {filteredBanks.length > 0 ? (
                filteredBanks.map((bank) => <BankCard bank={bank} key={bank.id} />)
              ) : (
                <p className={styles.emptyState}>Банки не найдены. Попробуйте другой запрос.</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <section className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <p className={styles.ctaTitle}>
                  {cta.prefix}
                  <span className={styles.ctaHighlight}>{cta.highlight}</span>
                  {cta.suffix}
                </p>
                <button className={styles.ctaButton} type="button">
                  {cta.button}
                </button>
              </div>
              <img alt="" aria-hidden className={styles.ctaImage} draggable={false} src={cta.image} />
            </section>
          </Reveal>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
