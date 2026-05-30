/* global firebase */
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAS1wKGO6QQYp479HKuDU9q5pw-oKX44f8",
  authDomain: "bahe4ka-hackathon-finance.firebaseapp.com",
  projectId: "bahe4ka-hackathon-finance",
  storageBucket: "bahe4ka-hackathon-finance.firebasestorage.app",
  messagingSenderId: "469975911291",
  appId: "1:469975911291:web:4653cc230f4545f9c18bde",
  measurementId: "G-7CQK57HWF8",
});

const messaging = firebase.messaging();
const DEFAULT_TITLE = "Zanachka";
const DEFAULT_ICON = "/dashboard/nav/notification.svg";

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? DEFAULT_TITLE;
  const options = {
    body: payload.notification?.body ?? "",
    data: payload.data,
    icon: DEFAULT_ICON,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client && client.url.startsWith(self.location.origin)) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});
