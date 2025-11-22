import { cn } from '../utils/cn';

// REMOVED: Mock data - this component needs real API integration
// For now, show empty state
const mockSectorData: Array<{ sector: string; changesPercentage: string }> = []

async function fetchSectorPerformance() {
  // TODO: Integrate with real sector performance API
  return mockSectorData
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