import { TavilySearch } from "@langchain/tavily";

const tavilyTool = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  max_results: 5,
});

export async function tavilySearch(query) {
  try {
    const results = await tavilyTool.invoke(query);
    return results;
  } catch (error) {
    console.error("Tavily search error:", error);
    throw new Error("Failed to fetch search results");
  }
}
