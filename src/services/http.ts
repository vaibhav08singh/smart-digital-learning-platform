// ============================================================
// Shared client-side API client.
// Every server call from the browser goes through these helpers
// so headers, error mapping and JSON parsing live in one place.
// Server routes reply with a consistent { error, code } body;
// that contract is mapped here to ApiClientError.
// ============================================================

export class ApiClientError extends Error {
  /** HTTP status, or 0 when the network request itself failed. */
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    if (init?.signal?.aborted) throw error;
    throw new ApiClientError("Could not reach the server.", 0, "NETWORK");
  }

  if (res.ok) {
    return (await res.json()) as T;
  }

  let error = `Request failed (HTTP ${res.status}).`;
  let code: string | undefined;
  try {
    const body = (await res.json()) as { error?: string; code?: string };
    if (body.error) error = body.error;
    if (body.code) code = body.code;
  } catch {
    // non-JSON error body — keep the default message
  }
  throw new ApiClientError(error, res.status, code);
}

export function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, init);
}

export function postJson<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...init,
    method: "POST",
    headers: { "content-type": "application/json", ...init?.headers },
    body: JSON.stringify(body),
  });
}
