import { Article } from "@/types";
import { ArticleCard } from "./article-card";
import NoArticleFound from "./no-article-found";

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <>
      {articles.length === 0 ? (
        <NoArticleFound />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
