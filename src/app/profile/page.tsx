import Link from "next/link";

import { DesktopSidebarLayout } from "@/shared/ui/desktop-sidebar/desktop-sidebar-layout";
import { AppTopBar } from "@/widgets/home/app-top-bar";

import styles from "../settings/settings-page.module.css";

export default function ProfilePage() {
  return (
    <>
      <div className={styles.mobileShell}>
        <main className={styles.mobileStage}>
          <AppTopBar title="Личный кабинет" />

          <section className={styles.card}>
            <h1 className={styles.title}>Личный кабинет</h1>
            <p className={styles.description}>
              Здесь будет профиль пользователя, настройки, подключение банков и управление
              аккаунтом.
            </p>
            <Link className={styles.action} href="/notifications">
              Открыть уведомления
            </Link>
          </section>
        </main>
      </div>

      <div className={styles.desktopShell}>
        <DesktopSidebarLayout>
          <main className={styles.desktopStage}>
            <section className={styles.card}>
              <h1 className={styles.title}>Личный кабинет</h1>
              <p className={styles.description}>
                Здесь будет профиль пользователя, настройки, подключение банков и управление
                аккаунтом.
              </p>
            </section>
          </main>
        </DesktopSidebarLayout>
      </div>
    </>
  );
}
