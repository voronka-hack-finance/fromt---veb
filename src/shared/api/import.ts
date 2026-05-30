import { fetchImportStatus, uploadFile, type UploadResponse } from "./backend";

const TERMINAL_STATUSES = new Set([
  "completed",
  "failed",
  "partially_completed",
]);

type WaitForImportOptions = {
  delayMs?: number;
  maxAttempts?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForImportCompletion(
  importId: string,
  { delayMs = 1500, maxAttempts = 40 }: WaitForImportOptions = {},
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await fetchImportStatus(importId);

    if (TERMINAL_STATUSES.has(status.status)) {
      if (status.status === "failed") {
        throw new Error(status.error_message || "Импорт не удался");
      }

      return status;
    }

    await sleep(delayMs);
  }

  throw new Error("Превышено время ожидания импорта");
}

export async function uploadFileAndWaitForImport(file: File): Promise<UploadResponse> {
  const upload = await uploadFile(file);
  await waitForImportCompletion(upload.import_id);
  return upload;
}
