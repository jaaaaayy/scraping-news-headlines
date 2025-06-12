import { FileX } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const NoArticleFound = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 h-24">
        <FileX className="size-8" />
        <span>No Article Found</span>
      </CardContent>
    </Card>
  );
};

export default NoArticleFound;
