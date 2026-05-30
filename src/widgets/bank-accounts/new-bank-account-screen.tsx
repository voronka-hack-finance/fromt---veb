"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";

import { uploadFileAndWaitForImport } from "@/shared/api/import";
import { newBankAccountScreenData } from "@/shared/data/new-bank-account";
import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { Reveal } from "@/shared/ui/reveal/reveal";

import styles from "./new-bank-account-screen.module.css";

const { title, uploadSectionTitle, uploadPlaceholder, actions, acceptedFileTypes } =
  newBankAccountScreenData;

const assets = {
  tableIcon: "/bank-accounts/new/table-icon.svg",
} as const;

export function NewBankAccountScreenView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function handleSave() {
    if (!selectedFile || isSaving) {
      return;
    }

    setIsSaving(true);
    setStatusMessage("Загрузка файла...");

    try {
      setStatusMessage("Импорт данных...");
      await uploadFileAndWaitForImport(selectedFile);
      await queryClient.invalidateQueries();
      router.push("/bank-accounts");
    } catch {
      setStatusMessage("Не удалось импортировать файл. Попробуйте ещё раз.");
      setIsSaving(false);
    }
  }

  return (
    <DesktopSidebarLayout>
      <main className={styles.stage}>
        <div className={styles.shell}>
          <div>
            <Reveal delay={0.03}>
              <header className={styles.header}>
                <Link aria-label="Назад" className={styles.backButton} href="/bank-accounts/add">
                  <ArrowLeft size={24} strokeWidth={1.9} />
                </Link>
                <h1 className={styles.title}>{title}</h1>
              </header>
            </Reveal>

            <Reveal delay={0.06}>
              <section className={styles.content}>
                <div className={styles.uploadSection}>
                  <h2 className={styles.uploadTitle}>{uploadSectionTitle}</h2>

                  <button
                    aria-label={uploadPlaceholder}
                    className={`${styles.uploadZone} ${selectedFile ? styles.uploadZoneHasFile : ""}`}
                    onClick={openFilePicker}
                    type="button"
                  >
                    <img
                      alt=""
                      aria-hidden
                      className={styles.uploadIcon}
                      draggable={false}
                      src={assets.tableIcon}
                    />
                    {selectedFile ? (
                      <p className={styles.fileName}>{selectedFile.name}</p>
                    ) : (
                      <p className={styles.uploadPlaceholder}>{uploadPlaceholder}</p>
                    )}
                  </button>

                  <input
                    accept={acceptedFileTypes}
                    aria-hidden
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    tabIndex={-1}
                    type="file"
                  />
                </div>
              </section>
            </Reveal>
          </div>

          <Reveal delay={0.09}>
            <footer className={styles.footer}>
              <button
                className={styles.saveButton}
                disabled={!selectedFile || isSaving}
                onClick={handleSave}
                type="button"
              >
                <span>{isSaving ? statusMessage ?? "Сохранение..." : actions.save}</span>
                <Check size={24} strokeWidth={2} />
              </button>
            </footer>
          </Reveal>
        </div>
      </main>
    </DesktopSidebarLayout>
  );
}
