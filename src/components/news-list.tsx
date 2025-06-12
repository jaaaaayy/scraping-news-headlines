import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { News } from "@/types";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { NewsCard } from "./news-card";
import NonewsFound from "./no-news-found";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export default function NewsList({ news }: { news: News[] }) {
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    setFilteredNews(news);
  }, [news]);

  function handleFilterNews() {
    if (!keyword) {
      setIsFiltering(false);
      return setFilteredNews(news);
    }

    setIsFiltering(true);
    const filteredNews = news.filter((item) =>
      item.headline.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredNews(filteredNews);
  }

  function handleSortRelevance() {
    setIsSorting(true);

    const scoredNews = filteredNews
      .map((item) => {
        const headlineLoweredCase = item.headline.toLowerCase();
        const keywordLoweredCase = keyword.toLowerCase();
        let score = 0;

        if (headlineLoweredCase.startsWith(keywordLoweredCase)) {
          score += 100;
        }

        const keywordIndex = headlineLoweredCase.indexOf(keywordLoweredCase);
        if (keywordIndex !== -1) {
          const wordPosition = headlineLoweredCase
            .split(" ")
            .findIndex((w) => w.includes(keywordLoweredCase));
          if (wordPosition === 0) score += 90;
          else if (wordPosition === 1) score += 80;
          else if (wordPosition >= 2 && wordPosition <= 4) score += 70;
          else score += 50;

          const matchCount = (
            headlineLoweredCase.match(new RegExp(keywordLoweredCase, "g")) || []
          ).length;
          if (matchCount > 1) score += (matchCount - 1) * 10;
        }

        return { ...item, _score: score };
      })
      .sort((a, b) => b._score - a._score);

    setFilteredNews(scoredNews);
  }

  function handleClear() {
    setIsFiltering(false);
    setIsSorting(false);
    setFilteredNews(news);
  }

  return (
    <>
      {filteredNews.length !== 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filter and Sort News</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              placeholder='Filter news based on keywords (e.g., "technology," "politics")'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button size="sm" onClick={handleFilterNews}>
              <Filter />
              <span>Filter</span>
            </Button>
            {isFiltering && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Sort</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSortRelevance}>
                    Relevance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {(isFiltering || isSorting) && (
              <Button size="sm" variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {news.length === 0 ? (
        <NonewsFound />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredNews.map((item, index) => (
            <NewsCard key={index} news={item} />
          ))}
        </div>
      )}
    </>
  );
}
