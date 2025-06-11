import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { Article } from "@/types";
import {
  extractAuthor,
  extractHeadline,
  extractPublicationDate,
  makeAbsoluteUrl,
  removeDuplicateArticles,
} from "./utils";

export async function scrapeArticles(url: string): Promise<Article[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to scrape the website.");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const source = new URL(url).hostname;
  const articles: Article[] = [];

  const detectionStrategies = [
    () => {
      $(
        'article, [class*="article"], [class*="post"], [class*="story"], [class*="card"], [class*="news-item"]'
      ).each((_, el) => {
        processArticleElement($(el));
      });
    },
    () => {
      $('li, [class*="list-item"], [class*="item"]').each((_, el) => {
        processArticleElement($(el));
      });
    },
    () => {
      $("a").each((_, el) => {
        const $el = $(el);
        const headline = $el.text().trim();
        const articleUrl = $el.attr("href");

        if (
          headline.length > 20 &&
          articleUrl &&
          !headline.match(/[{}@;]/) &&
          !headline.match(/\.(css|js|png|jpg|svg|webp)/i)
        ) {
          articles.push(
            createArticleObject({
              headline,
              url: articleUrl,
              element: $el,
            })
          );
        }
      });
    },
  ];

  detectionStrategies.forEach((strategy) => strategy());

  return removeDuplicateArticles(articles);

  function processArticleElement($el: cheerio.Cheerio<Element>) {
    const headline = extractHeadline($el);
    if (!headline) return;

    articles.push(
      createArticleObject({
        headline,
        element: $el,
      })
    );
  }

  function createArticleObject({
    headline,
    url,
    element,
  }: {
    headline: string;
    url?: string;
    element: cheerio.Cheerio<Element>;
  }): Article {
    const $el = element;
    const articleUrl = url || $el.find("a").first().attr("href") || "";

    return {
      headline,
      url: makeAbsoluteUrl(articleUrl, url ?? ""),
      author: extractAuthor($el),
      publicationDate: extractPublicationDate($el),
      source,
    };
  }
}
