import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { News } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "The 'url' query parameter is required." },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      {
        error:
          "The provided URL is not valid. Please ensure it includes the protocol (e.g., 'https://').",
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "An unexpected error occurred while processing the request."
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const news: News[] = [];

    const baseUrl = new URL(url);
    const seen = new Set<string>();

    $(
      `news, 
      [class*="news" i], 
      [class*="post" i], 
      [class*="story" i], 
      [class*="card" i], 
      [data-testid*="card" i], 
      [class*="news-item" i], 
      [class*="title" i], 
      [class*="headline" i],
      [itemprop="headline" i],
      meta[name="title" i],
      meta[property="og:title" i],
      [data-testid*="headline" i],
      [property="og:title" i]`
    ).each((i, el) => {
      const $el = $(el);
      const headline = $el.find("h1, h2, h3").first().text();
      const url = $el.find("a").first().attr("href");
      const author =
        $el
          .find(
            '[itemprop*="author" i], [class*="author" i], [class*="byline" i], span[rel="author"]'
          )
          .first()
          .text()
          .trim() || "Unknown";
      const publicationDate =
        $el.find("time").attr("datetime") ||
        $el.find('[class*="date" i], [class*="publish" i]').first().text() ||
        "Not specified";

      let absoluteUrl = url;
      if (url && !url.startsWith("http")) {
        absoluteUrl = new URL(url, baseUrl.origin).href;
      }

      if (headline && headline.length >= 10) {
        if (seen.has(headline)) {
          return;
        }

        seen.add(headline);
        news.push({
          headline,
          url: absoluteUrl,
          author,
          publicationDate,
          source: baseUrl.origin,
        });
      }
    });

    return NextResponse.json(news);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }
  }
}
