import { cn } from '../utils/cn';

// Mock sector performance data - you can replace this with real API data
const mockSectorData = [
  { sector: "Technology", changesPercentage: "1.85" },
  { sector: "Healthcare", changesPercentage: "0.92" },
  { sector: "Financial Services", changesPercentage: "0.67" },
  { sector: "Consumer Cyclical", changesPercentage: "-0.23" },
  { sector: "Communication Services", changesPercentage: "1.12" },
  { sector: "Industrials", changesPercentage: "0.45" },
  { sector: "Consumer Defensive", changesPercentage: "0.31" },
  { sector: "Energy", changesPercentage: "-1.24" },
  { sector: "Utilities", changesPercentage: "0.18" },
  { sector: "Real Estate", changesPercentage: "-0.56" },
  { sector: "Basic Materials", changesPercentage: "0.73" }
];

async function fetchSectorPerformance() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSectorData;
}

interface Sector {
  sector: string;
  changesPercentage: string;
}

export default function SectorPerformance() {
  const data = mockSectorData;

  if (!data) {
    return null;
  }

  const totalChangePercentage = data.reduce((total, sector) => {
    return total + parseFloat(sector.changesPercentage);
  }, 0);

  const averageChangePercentage =
    (totalChangePercentage / data.length).toFixed(2) + "%";

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  };
  
  const sectorsWithAverage = [allSectors, ...data];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sectorsWithAverage.map((sector: Sector) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              parseFloat(sector.changesPercentage) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800"
                : "bg-gradient-to-l from-red-300 text-red-800"
            )}
          >
            {parseFloat(sector.changesPercentage).toFixed(2) + "%"}
          </span>
        </div>
      ))}
    </div>
  );
}