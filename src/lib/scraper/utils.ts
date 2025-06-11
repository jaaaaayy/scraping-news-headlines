import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { Article } from "@/types";

export function extractHeadline($el: cheerio.Cheerio<Element>): string | null {
  const candidates = [
    "h1",
    "h2",
    "h3",
    '[class*="headline"]',
    '[class*="title"]',
    '[itemprop="headline"]',
    '[property="og:title"]',
    'meta[name="title"]',
    'meta[property="og:title"]',
    '[data-testid*="headline"]',
  ];

  for (const selector of candidates) {
    const text = selector.startsWith("meta")
      ? $el.find(selector).attr("content")
      : $el.find(selector).first().text().trim();
    if (text) return text;
  }

  return $el.attr("aria-label") || null;
}

export function extractAuthor($el: cheerio.Cheerio<Element>): string {
  const candidates = [
    '[class*="author"]',
    '[class*="byline"]',
    '[itemprop="author"]',
    '[rel="author"]',
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[name="parsely-author"]',
    '[class*="writer"]',
    '[data-testid*="author"]',
  ];

  for (const selector of candidates) {
    const text = selector.startsWith("meta")
      ? $el.find(selector).attr("content")
      : $el.find(selector).first().text().trim();
    if (text) return text;
  }

  return "Unknown";
}

export function extractPublicationDate($el: cheerio.Cheerio<Element>): string {
  const candidates = [
    "time",
    '[class*="date"]',
    '[class*="time"]',
    '[class*="published"]',
    '[itemprop*="date"]',
    "[datetime]",
    'meta[property="article:published_time"]',
    'meta[name="pubdate"]',
    'meta[name="date"]',
    'meta[itemprop="datePublished"]',
    '[data-testid*="date"]',
  ];

  for (const selector of candidates) {
    const value =
      selector.startsWith("meta") || selector === "time"
        ? $el.find(selector).attr("datetime") ||
          $el.find(selector).attr("content")
        : $el.find(selector).first().text().trim();
    if (value) return value;
  }

  return "Not specified";
}

export function makeAbsoluteUrl(relativeUrl: string, baseUrl: string): string {
  if (!relativeUrl) return normalizeBaseUrl(baseUrl);

  const safeBaseUrl = normalizeBaseUrl(baseUrl);

  try {
    return new URL(relativeUrl, safeBaseUrl).href;
  } catch {
    return relativeUrl.startsWith("http") ? relativeUrl : safeBaseUrl;
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

function normalizeBaseUrl(url: string): string {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;

  const cleaned = url.replace(/^\/+/, "");

  return `https://${cleaned}`;
}
