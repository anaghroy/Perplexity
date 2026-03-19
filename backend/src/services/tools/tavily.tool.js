import { TavilySearch } from "@langchain/tavily";

const tavilyTool = new TavilySearch({
  maxResults: 5,
  searchDepth: "basic",
  includeAnswer: false,
});

/**
 * Parsed shape returned for each result:
 * { title, url, content, score }
 */

/**
 * Search the web using Tavily and return a clean, parsed result array.
 *
 * @param {string} query
 * @param {object} [options]
 * @param {number}  [options.maxResults=5]
 * @param {"basic"|"advanced"} [options.depth]
 * @returns {Promise<Array<{ title, url, content, score }>>}
 */
export async function tavilySearch(query, options = {}) {
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("tavilySearch: query must be a non-empty string");
  }

  const trimmedQuery = query.trim();

  try {
    const raw = await tavilyTool.invoke(trimmedQuery);

    const resultList = Array.isArray(raw?.results)
      ? raw.results
      : Array.isArray(raw)
        ? raw
        : [];

    if (resultList.length === 0) {
      console.warn(`[Tavily] No results found for query: "${trimmedQuery}"`);
      return [];
    }

    const parsed = resultList
      .map((item) => ({
        title: item.title ?? "Untitled",
        url: item.url ?? "",
        content: item.content ?? "",
        score: typeof item.score === "number" ? item.score : 0,
      }))
      .filter((item) => item.url && item.content)
      .sort((a, b) => b.score - a.score);

    return parsed;
  } catch (error) {
    if (error.message?.includes("401") || error.message?.includes("403")) {
      throw new Error(
        "[Tavily] Invalid or missing API key — check TAVILY_API_KEY in .env",
      );
    }
    if (error.message?.includes("429")) {
      throw new Error(
        "[Tavily] Rate limit exceeded — slow down requests or upgrade plan",
      );
    }
    if (error.message?.includes("No search results found")) {
      console.warn(`[Tavily] No results for: "${trimmedQuery}"`);
      return [];
    }

    console.error("[Tavily] Search error:", error.message);
    throw new Error(`[Tavily] Search failed: ${error.message}`);
  }
}
