import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Article } from "@/types";
import { Calendar, ExternalLink, UserRound } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  const { headline, url, author, publicationDate, source } = article;

  let formattedDate;
  if (publicationDate && !isNaN(new Date(publicationDate).getTime())) {
    formattedDate = new Date(publicationDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    formattedDate = publicationDate;
  }

  return (
    <Card className="transition-all hover:shadow-md justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline">{source}</Badge>
          {url && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open article"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <CardTitle>{headline}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center">
            <UserRound className="size-4 mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="size-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        {url && (
          <Button variant="link" className="p-0" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Read full article
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
