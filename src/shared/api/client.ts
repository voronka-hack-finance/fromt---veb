const DEFAULT_MOCK_DELAY_MS = 200;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function mockDelay(ms = DEFAULT_MOCK_DELAY_MS) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new ApiError(`API base URL is not configured for ${path}`, 503);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(`Request failed: ${path}`, response.status);
  }

  return response.json() as Promise<T>;
}
