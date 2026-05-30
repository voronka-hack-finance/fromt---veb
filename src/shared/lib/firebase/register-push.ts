import {
  registerNotificationDevice,
  updateNotificationPermission,
} from "@/shared/api/backend";
import { getOrCreateDeviceId } from "@/shared/lib/firebase/device-id";
import { requestFirebaseMessagingToken } from "@/shared/lib/firebase/messaging";

let registrationPromise: Promise<string | null> | null = null;

export async function registerPushNotifications() {
  registrationPromise ??= registerPushNotificationsInternal().finally(() => {
    registrationPromise = null;
  });

  return registrationPromise;
}

async function registerPushNotificationsInternal() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  if (!window.isSecureContext) {
    console.warn("[firebase] Push notifications require HTTPS or localhost.");
    return null;
  }

  const permission = await Notification.requestPermission();

  await updateNotificationPermission({
    push_enabled: permission === "granted",
  });

  if (permission !== "granted") {
    return null;
  }

  const firebaseToken = await requestFirebaseMessagingToken();

  if (!firebaseToken) {
    return null;
  }

  await registerNotificationDevice({
    device_id: getOrCreateDeviceId(),
    firebase_token: firebaseToken,
    platform: "web",
  });

  return firebaseToken;
}
