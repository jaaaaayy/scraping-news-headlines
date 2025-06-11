import Header from "@/components/header";
import UrlScraper from "@/components/url-scrapper";

export default function Home() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <Header />
      <UrlScraper />
    </div>
  );
}
