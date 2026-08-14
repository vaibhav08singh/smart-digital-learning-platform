import { getJson } from "@/services/http";
import type { YouTubeVideo } from "@/types";

// ============================================================
// YouTube video search — talks ONLY to our server proxy
// (/api/youtube). The API key never reaches the browser.
// ============================================================

export interface YoutubeSearchParams {
  query: string;
  order?: "relevance" | "date";
  maxResults?: number;
}

/** In-browser cache so toggling sort / re-opening a subject reuses results
 * instead of burning YouTube API quota (each search costs ~100 units). */
const clientCache = new Map<string, { expires: number; videos: YouTubeVideo[] }>();
const CLIENT_CACHE_TTL_MS = 10 * 60 * 1000;

export async function searchYoutubeVideos({
  query,
  order = "relevance",
  maxResults = 15,
}: YoutubeSearchParams): Promise<YouTubeVideo[]> {
  const key = `${query.toLowerCase()}|${order}|${maxResults}`;
  const hit = clientCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.videos;

  const params = new URLSearchParams({
    q: query,
    order,
    maxResults: String(maxResults),
  });

  const data = await getJson<{ videos?: YouTubeVideo[] }>(`/api/youtube?${params.toString()}`);
  const videos = data.videos ?? [];
  clientCache.set(key, { expires: Date.now() + CLIENT_CACHE_TTL_MS, videos });
  return videos;
}

/** Build a "search on YouTube" URL for the given topic/query. */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
