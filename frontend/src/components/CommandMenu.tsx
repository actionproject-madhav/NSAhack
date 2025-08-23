import { useEffect, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const SUGGESTIONS = [
  { ticker: "TSLA", title: "Tesla Inc." },
  { ticker: "NVDA", title: "NVIDIA Corporation" },
  { ticker: "AAPL", title: "Apple Inc." },
  { ticker: "MSFT", title: "Microsoft Corporation" },
  { ticker: "GOOGL", title: "Alphabet Inc." },
  { ticker: "AMZN", title: "Amazon.com Inc." },
];

// Mock tickers data - you can replace this with real data
const tickers = [
  { id: 1, ticker: "AAPL", title: "Apple Inc." },
  { id: 2, ticker: "MSFT", title: "Microsoft Corporation" },
  { id: 3, ticker: "GOOGL", title: "Alphabet Inc." },
  { id: 4, ticker: "AMZN", title: "Amazon.com Inc." },
  { id: 5, ticker: "NVDA", title: "NVIDIA Corporation" },
  { id: 6, ticker: "META", title: "Meta Platforms, Inc." },
  { id: 7, ticker: "BRK-B", title: "Berkshire Hathaway Inc." },
  { id: 8, ticker: "TSLA", title: "Tesla, Inc." },
  { id: 9, ticker: "LLY", title: "Eli Lilly & Co" },
  { id: 10, ticker: "V", title: "Visa Inc." },
];

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (ticker: string) => {
    console.log('Navigating to:', `/stock/${ticker}`);
    setOpen(false);
    setSearch("");
    navigate(`/stock/${ticker}`);
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="group"
      >
        <p className="flex gap-10 text-sm text-muted-foreground group-hover:text-foreground">
          Search...
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:text-foreground sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search by symbols or companies..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {search.length === 0 &&
              SUGGESTIONS.map((suggestion) => (
                <CommandItem
                  key={suggestion.ticker}
                  value={suggestion.ticker}
                  onSelect={(value) => handleSelect(value)}
                  onClick={() => handleSelect(suggestion.ticker)}
                >
                  <p className="mr-2 font-semibold">{suggestion.ticker}</p>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.title}
                  </p>
                </CommandItem>
              ))}

            {search.length > 0 &&
              tickers
                .filter(
                  (ticker) =>
                    ticker.ticker
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    ticker.title.toLowerCase().includes(search.toLowerCase())
                )
                .slice(0, 10)
                .map((ticker) => (
                  <CommandItem
                    key={ticker.id}
                    value={ticker.ticker}
                    onSelect={(value) => handleSelect(value)}
                    onClick={() => handleSelect(ticker.ticker)}
                  >
                    <p className="mr-2 font-semibold">{ticker.ticker}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticker.title}
                    </p>
                  </CommandItem>
                ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}