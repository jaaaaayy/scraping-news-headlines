import { NextRequest, NextResponse } from "next/server";
import { scrapeArticles } from "@/lib/scraper";

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
  }
}
