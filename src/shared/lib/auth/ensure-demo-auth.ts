import { login } from "@/shared/api/backend";
import { getAccessToken } from "@/shared/api/client";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "secret123";

let authPromise: Promise<boolean> | null = null;

export async function ensureDemoAuth() {
  if (process.env.NEXT_PUBLIC_API_TOKEN?.trim()) {
    return true;
  }

  if (!authPromise) {
    authPromise = login({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
      .then(() => Boolean(getAccessToken()))
      .catch(() => false)
      .finally(() => {
        authPromise = null;
      });
  }

  return authPromise;
}
