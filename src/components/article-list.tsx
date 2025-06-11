import { Article } from "@/types";
import { ArticleCard } from "./article-card";

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {articles.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </div>
  );
}
