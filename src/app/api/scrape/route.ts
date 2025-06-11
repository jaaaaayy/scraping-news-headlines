import { NextRequest, NextResponse } from "next/server";
import { scrapeArticles } from "@/lib/scraper";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required." },
      { status: 400 }
    );
  }

  try {
    const articles = await scrapeArticles(url);
    return NextResponse.json(articles);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred during scraping." },
      { status: 500 }
    );
  }
}
