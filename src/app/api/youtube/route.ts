import { jsonError } from "@/lib/server/errors";
import { searchYoutubeVideos, YoutubeSearchError } from "@/lib/server/youtube";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// YouTube search proxy — SERVER ONLY.
// Thin route handler: parsing + validation + error mapping.
// The actual YouTube work (search, video details, cache) lives in
// @/lib/server/youtube so the API key never reaches the browser.
// ============================================================

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const order = searchParams.get("order") === "date" ? "date" : "relevance";
  const maxResults = Number(searchParams.get("maxResults")) || 15;

  try {
    const videos = await searchYoutubeVideos({ query: q, order, maxResults });
    return Response.json({ videos });
  } catch (error) {
    if (error instanceof YoutubeSearchError) {
      return jsonError(error.message, error.status, error.code);
    }
    return jsonError("YouTube request failed.", 502, "API_ERROR");
  }
}
