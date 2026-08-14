import { executeCode, ExecutionError, listRuntimes } from "@/lib/server/code-execution";
import { jsonError, readJsonBody } from "@/lib/server/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// Code execution — proxied through the server so API keys/base
// URLs (EXECUTE_API_URL, EXECUTE_API_KEY) never reach the client.
// Thin route handler; the Piston client lives in
// @/lib/server/code-execution.
// ============================================================

export async function GET(): Promise<Response> {
  try {
    const runtimes = await listRuntimes();
    return Response.json({ runtimes });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonError(`Execution service unavailable: ${message}`, 502);
  }
}

interface ExecuteRequest {
  language: string;
  code: string;
  stdin?: string;
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody<ExecuteRequest>(request);
  if (!body) return jsonError("Invalid JSON body.", 400);

  const { language, code, stdin } = body;
  if (!language || typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Missing 'language' or 'code'.", 400);
  }

  try {
    const result = await executeCode({ language, code, stdin });
    return Response.json(result);
  } catch (error) {
    if (error instanceof ExecutionError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : String(error);
    return jsonError(`Execution failed: ${message}`, 502);
  }
}
