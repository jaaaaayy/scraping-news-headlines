"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useScrapeUrl } from "@/hooks/useScrapeUrl";
import { News } from "@/types";
import { AlertCircleIcon, LoaderCircle, Search } from "lucide-react";
import { useState } from "react";
import { Alert, AlertTitle } from "./ui/alert";
import NewsList from "./news-list";

export default function UrlScraper() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [news, setNews] = useState<News[]>([]);

  const { scrapeUrl } = useScrapeUrl();

  async function handleScrape() {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setIsLoading(true);
    setError("");
    setNews([]);

    try {
      const data = await scrapeUrl(url);
      setNews(data);
      setSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        setSuccess(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-2 lg:p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scrape News from URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter news website URL (e.g., https://www.example.com/news)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button size="sm" disabled={isLoading} onClick={handleScrape}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  <span>Scraping...</span>
                </div>
              ) : (
                <>
                  <Search />
                  <span>Scrape</span>
                </>
              )}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </CardContent>
      </Card>
      {!isLoading && success && <NewsList news={news} />}
    </div>
  );
}
