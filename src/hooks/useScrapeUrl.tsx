import { Article } from "@/types";

export function useScrapeUrl() {
  async function scrapeUrl(url: string) {
    const response = await fetch(
      `http://localhost:3000/api/scrape?url=${encodeURIComponent(url)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data as Article[];
  }

  return { scrapeUrl };
}
