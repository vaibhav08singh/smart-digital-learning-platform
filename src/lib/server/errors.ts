// ============================================================
// Shared server response helpers.
// Every API route returns errors in the same shape so client
// services can rely on a single { error, code } contract.
// ============================================================

export interface ApiErrorBody {
  error: string;
  code?: string;
}

/** Build a standardized JSON error response. */
export function jsonError(error: string, status: number, code?: string): Response {
  const body: ApiErrorBody = code ? { error, code } : { error };
  return Response.json(body, { status });
}

/** Parse a JSON request body, returning undefined when it is invalid. */
export async function readJsonBody<T>(request: Request): Promise<T | undefined> {
  try {
    return (await request.json()) as T;
  } catch {
    return undefined;
  }
}
