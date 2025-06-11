import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 border-b p-2 lg:p-4">
      <div className="text-xl font-bold">Scraping News Headlines</div>
      <ModeToggle />
    </header>
  );
}
