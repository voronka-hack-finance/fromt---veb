import Link from "next/link";

import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import styles from "./settings-page.module.css";

export default function SettingsPage() {
  return (
    <>
      <div className={styles.mobileShell}>
        <main className={styles.mobileStage}>
          <AppTopBar title="Настройки" />

          <section className={styles.card}>
            <h1 className={styles.title}>Настройки</h1>
            <p className={styles.description}>
              Этот экран пока остается заглушкой из дизайна.
            </p>
            <Link className={styles.action} href="/">
              Вернуться на главную
            </Link>
          </section>
        </main>
      </div>

      <div className={styles.desktopShell}>
        <DesktopSidebarLayout>
          <main className={styles.desktopStage}>
            <section className={styles.card}>
              <h1 className={styles.title}>Настройки</h1>
              <p className={styles.description}>
                Этот экран пока остается заглушкой из дизайна.
              </p>
            </section>
          </main>
        </DesktopSidebarLayout>
      </div>
    </>
  );
}
