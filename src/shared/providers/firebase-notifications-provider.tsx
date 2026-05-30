"use client";

import { useEffect } from "react";

import { hasStoredAccessToken } from "@/shared/api/client";
import { initializeFirebaseAnalytics } from "@/shared/lib/firebase/app";
import {
  firebaseNotificationIcon,
  firebaseNotificationTitle,
} from "@/shared/lib/firebase/config";
import { subscribeToForegroundMessages } from "@/shared/lib/firebase/messaging";
import { registerPushNotifications } from "@/shared/lib/firebase/register-push";

type FirebaseNotificationsProviderProps = {
  children: React.ReactNode;
};

export function FirebaseNotificationsProvider({
  children,
}: FirebaseNotificationsProviderProps) {
  useEffect(() => {
    void initializeFirebaseAnalytics();

    if (!hasStoredAccessToken()) {
      return;
    }

    let unsubscribeForeground: (() => void) | undefined;

    void registerPushNotifications();

    void subscribeToForegroundMessages((payload) => {
      const title = payload.notification?.title ?? firebaseNotificationTitle;
      const body = payload.notification?.body;

      if (typeof document === "undefined" || !body) {
        return;
      }

      if (document.visibilityState === "visible" && Notification.permission === "granted") {
        new Notification(title, { body, icon: firebaseNotificationIcon });
      }
    }).then((unsubscribe) => {
      unsubscribeForeground = unsubscribe;
    });

    return () => {
      unsubscribeForeground?.();
    };
  }, []);

  return children;
}
