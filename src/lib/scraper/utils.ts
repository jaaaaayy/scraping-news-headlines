import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { Article } from "@/types";

export function extractHeadline($el: cheerio.Cheerio<Element>): string | null {
  return (
    $el.find("h1, h2, h3").first().text().trim() ||
    $el.find('[class*="title"], [class*="headline"]').first().text().trim() ||
    $el.attr("aria-label") ||
    null
  );
}

export function extractAuthor($el: cheerio.Cheerio<Element>): string {
  return (
    $el.find('[class*="author"], [class*="byline"]').first().text().trim() ||
    $el
      .find('meta[name="author"], meta[property="article:author"]')
      .attr("content") ||
    "Unknown"
  );
}

export function extractPublicationDate($el: cheerio.Cheerio<Element>): string {
  return (
    $el.find("time").attr("datetime") ||
    $el
      .find('[class*="date"], [class*="time"], [class*="published"]')
      .first()
      .text()
      .trim() ||
    $el
      .find(
        'meta[property="article:published_time"], meta[name="pubdate"], meta[name="date"]'
      )
      .attr("content") ||
    "Not specified"
  );
}

export function makeAbsoluteUrl(relativeUrl: string, baseUrl: string): string {
  if (!relativeUrl) return baseUrl;
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl.startsWith("http") ? relativeUrl : baseUrl;
  }
}

export function removeDuplicateArticles(articles: Article[]): Article[] {
  const seenUrls = new Set<string>();
  return articles.filter((article) => {
    if (!article.url || seenUrls.has(article.url)) return false;
    seenUrls.add(article.url);
    return true;
  });
}
