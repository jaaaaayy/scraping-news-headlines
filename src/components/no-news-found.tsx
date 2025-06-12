import { FileX } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const NoNewsFound = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 h-24">
        <FileX className="size-8" />
        <span>No news Found</span>
      </CardContent>
    </Card>
  );
};

export default NoNewsFound;
