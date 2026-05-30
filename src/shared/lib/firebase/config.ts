export const firebaseConfig = {
  apiKey: "AIzaSyAS1wKGO6QQYp479HKuDU9q5pw-oKX44f8",
  authDomain: "bahe4ka-hackathon-finance.firebaseapp.com",
  projectId: "bahe4ka-hackathon-finance",
  storageBucket: "bahe4ka-hackathon-finance.firebasestorage.app",
  messagingSenderId: "469975911291",
  appId: "1:469975911291:web:4653cc230f4545f9c18bde",
  measurementId: "G-7CQK57HWF8",
} as const;

export const firebaseNotificationIcon = "/dashboard/nav/notification.svg";
export const firebaseNotificationTitle = "Zanachka";

export function getFirebaseVapidKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() ?? "";
}
