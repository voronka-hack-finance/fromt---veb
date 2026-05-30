import { getApp, getApps, initializeApp } from "firebase/app";

import { firebaseConfig } from "@/shared/lib/firebase/config";

export function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export async function initializeFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const { getAnalytics, isSupported } = await import("firebase/analytics");

  if (!(await isSupported())) {
    return null;
  }

  return getAnalytics(getFirebaseApp());
}
