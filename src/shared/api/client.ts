const DEFAULT_MOCK_DELAY_MS = 200;
const DEFAULT_API_BASE_URL = "https://zanachka.avenir-team.ru";
const ACCESS_TOKEN_STORAGE_KEY = "zanachka_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "zanachka_refresh_token";

type PrimitiveQueryValue = string | number | boolean | Date;
type QueryValue =
  | PrimitiveQueryValue
  | PrimitiveQueryValue[]
  | null
  | undefined;

export type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  auth?: boolean;
  formData?: FormData;
  json?: unknown;
  query?: Record<string, QueryValue>;
  skipJsonParse?: boolean;
  headers?: HeadersInit;
};

export type StoredAuthTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<string | null> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function getLocalStorageItem(key: string) {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(key);
}

function setLocalStorageItem(key: string, value: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, value);
}

function removeLocalStorageItem(key: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function appendQueryValue(params: URLSearchParams, key: string, value: QueryValue) {
  if (value == null) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendQueryValue(params, key, item));
    return;
  }

  const normalized =
    value instanceof Date ? value.toISOString() : String(value);

  params.append(key, normalized);
}

async function parseErrorDetails(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

async function buildResponseError(path: string, response: Response) {
  const details = await parseErrorDetails(response);
  const message =
    typeof details === "object" &&
    details !== null &&
    "detail" in details &&
    typeof details.detail === "string"
      ? details.detail
      : `Request failed: ${path}`;

  return new ApiError(message, response.status, details);
}

async function refreshAccessTokenInternal() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearStoredAuthTokens();
    return null;
  }

  try {
    const nextTokens = await apiRequest<{
      access_token: string;
      refresh_token?: string | null;
    }>("/api/v1/auth/refresh", {
      auth: false,
      json: { refresh_token: refreshToken },
      method: "POST",
    });

    storeAuthTokens({
      accessToken: nextTokens.access_token,
      refreshToken: nextTokens.refresh_token ?? refreshToken,
    });

    return nextTokens.access_token;
  } catch {
    clearStoredAuthTokens();
    return null;
  }
}

async function getRefreshedAccessToken() {
  refreshPromise ??= refreshAccessTokenInternal().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function performRequest(
  path: string,
  options: ApiRequestOptions,
  accessToken: string | null,
) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiError(`API base URL is not configured for ${path}`, 503);
  }

  const url = new URL(path, `${normalizeBaseUrl(baseUrl)}/`);
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    appendQueryValue(url.searchParams, key, value);
  });

  const body =
    options.formData ??
    (options.json !== undefined ? JSON.stringify(options.json) : undefined);

  return fetch(url.toString(), {
    ...options,
    body,
    headers,
  });
}

export async function mockDelay(ms = DEFAULT_MOCK_DELAY_MS) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function getApiBaseUrl() {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return envBaseUrl || DEFAULT_API_BASE_URL;
}

export function getAccessToken() {
  return (
    process.env.NEXT_PUBLIC_API_TOKEN?.trim() ||
    getLocalStorageItem(ACCESS_TOKEN_STORAGE_KEY)
  );
}

export function getRefreshToken() {
  return getLocalStorageItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function hasStoredAccessToken() {
  return Boolean(getAccessToken());
}

export function storeAuthTokens(tokens: StoredAuthTokens) {
  if (tokens.accessToken) {
    setLocalStorageItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  }

  if (tokens.refreshToken) {
    setLocalStorageItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  }
}

export function clearStoredAuthTokens() {
  removeLocalStorageItem(ACCESS_TOKEN_STORAGE_KEY);
  removeLocalStorageItem(REFRESH_TOKEN_STORAGE_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const initialAccessToken = options.auth === false ? null : getAccessToken();
  let response = await performRequest(path, options, initialAccessToken);

  if (
    response.status === 401 &&
    options.auth !== false &&
    !path.endsWith("/auth/login") &&
    !path.endsWith("/auth/refresh")
  ) {
    const refreshedAccessToken = await getRefreshedAccessToken();

    if (refreshedAccessToken) {
      response = await performRequest(path, options, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw await buildResponseError(path, response);
  }

  if (options.skipJsonParse || response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return (await response.text()) as T;
  }

  return response.json() as Promise<T>;
}
