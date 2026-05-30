const DEVICE_ID_STORAGE_KEY = "zanachka_device_id";

function createDeviceId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return createDeviceId();
  }

  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const nextId = createDeviceId();
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextId);
  return nextId;
}
