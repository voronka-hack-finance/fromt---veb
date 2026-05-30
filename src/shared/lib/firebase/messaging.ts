import { getFirebaseApp } from "@/shared/lib/firebase/app";
import { getFirebaseVapidKey } from "@/shared/lib/firebase/config";

const FIREBASE_MESSAGING_SW_PATH = "/firebase-messaging-sw.js";

let messagingRegistrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

async function registerMessagingServiceWorker() {
  if (!isBrowser() || !("serviceWorker" in navigator)) {
    return null;
  }

  messagingRegistrationPromise ??= navigator.serviceWorker
    .register(FIREBASE_MESSAGING_SW_PATH)
    .then((registration) => registration)
    .catch(() => null);

  return messagingRegistrationPromise;
}

export async function getFirebaseMessaging() {
  if (!isBrowser()) {
    return null;
  }

  const { getMessaging, isSupported } = await import("firebase/messaging");

  if (!(await isSupported())) {
    return null;
  }

  return getMessaging(getFirebaseApp());
}

export async function requestFirebaseMessagingToken() {
  const vapidKey = getFirebaseVapidKey();

  if (!vapidKey) {
    console.warn(
      "[firebase] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set; push token cannot be issued.",
    );
    return null;
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return null;
  }

  const serviceWorkerRegistration = await registerMessagingServiceWorker();

  if (!serviceWorkerRegistration) {
    return null;
  }

  const { getToken } = await import("firebase/messaging");

  return getToken(messaging, {
    serviceWorkerRegistration,
    vapidKey,
  });
}

export async function subscribeToForegroundMessages(
  handler: (payload: import("firebase/messaging").MessagePayload) => void,
) {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => undefined;
  }

  const { onMessage } = await import("firebase/messaging");
  return onMessage(messaging, handler);
}
