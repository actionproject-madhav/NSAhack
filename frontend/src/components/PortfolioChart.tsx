import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import tradingService from '../services/tradingService';

interface PortfolioChartProps {
  height?: string;
  theme?: 'light' | 'dark';
}

interface PortfolioDataPoint {
  timestamp: number;
  totalValue: number;
  portfolioValue: number;
  cashBalance: number;
}

function PortfolioChart({ height = "400px", theme = "light" }: PortfolioChartProps) {
  const { user } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<PortfolioDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  // Calculate current total account value
  const currentTotalValue = useMemo(() => {
    if (!user) return 0;
    const portfolioValue = user.totalValue || 0;
    // We need to get cash balance - for now use a placeholder
    // In real implementation, this should come from portfolio endpoint
    return portfolioValue;
  }, [user]);

  useEffect(() => {
    const loadPortfolioHistory = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userId = user.email || user.id;
        if (!userId) {
          setIsLoading(false);
          return;
        }

        // Get portfolio history from backend (real data based on transactions)
        const historyData = await tradingService.getPortfolioHistory(userId);
        
        if (!historyData.history || historyData.history.length === 0) {
          // No transactions - show starting cash balance
          const cashBalance = user.cashBalance || 10000;
          const now = Date.now();
          setData([{
            timestamp: now,
            totalValue: cashBalance,
            portfolioValue: 0,
            cashBalance: cashBalance
          }]);
          setIsLoading(false);
          return;
        }

        // Filter history based on timeframe
        const now = Date.now();
        const days = timeframe === '1D' ? 1 : 
                     timeframe === '1W' ? 7 : 
                     timeframe === '1M' ? 30 : 
                     timeframe === '3M' ? 90 : 
                     timeframe === '1Y' ? 365 : 
                     365; // ALL
        
        const cutoffTime = now - (days * 24 * 60 * 60 * 1000);
        
        const filteredHistory = historyData.history.filter((point: any) => {
          if (timeframe === 'ALL') return true;
          const pointTime = new Date(point.timestamp).getTime();
          return pointTime >= cutoffTime;
        });

        // Convert to chart data points
        const dataPoints: PortfolioDataPoint[] = filteredHistory.map((point: any) => ({
          timestamp: new Date(point.timestamp).getTime(),
          totalValue: point.total_value || 0,
          portfolioValue: point.portfolio_value || 0,
          cashBalance: point.cash_balance || 0
        }));

        // If no data points in timeframe, show at least the current value
        if (dataPoints.length === 0) {
          const latest = historyData.history[historyData.history.length - 1];
          dataPoints.push({
            timestamp: now,
            totalValue: latest.total_value || 0,
            portfolioValue: latest.portfolio_value || 0,
            cashBalance: latest.cash_balance || 0
          });
        }

        setData(dataPoints);
      } catch (error) {
        console.error('Error loading portfolio history:', error);
        // Fallback to current value if history fails
        const cashBalance = user.cashBalance || 10000;
        const portfolioValue = user.totalValue || 0;
        setData([{
          timestamp: Date.now(),
          totalValue: portfolioValue + cashBalance,
          portfolioValue: portfolioValue,
          cashBalance: cashBalance
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioHistory();
  }, [user, timeframe]);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0 || isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const chartPadding = { top: 20, right: 20, bottom: 40, left: 60 };

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate value range with padding
    const values = data.map(d => d.totalValue);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    // Add 5% padding on top and bottom for better visualization
    const valuePadding = (maxValue - minValue) * 0.05 || maxValue * 0.05 || 100;
    const range = (maxValue - minValue) + (valuePadding * 2) || maxValue * 0.1 || 1000;
    const adjustedMin = minValue - valuePadding;
    const adjustedMax = maxValue + valuePadding;

    // Draw grid
    ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = chartPadding.top + (height - chartPadding.top - chartPadding.bottom) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(chartPadding.left, y);
      ctx.lineTo(width - chartPadding.right, y);
      ctx.stroke();
    }

    // Draw chart line
    if (data.length > 0) {
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = chartPadding.left + (width - chartPadding.left - chartPadding.right) * (data.length > 1 ? index / (data.length - 1) : 0);
        const normalizedValue = range > 0 ? (point.totalValue - adjustedMin) / range : 0.5;
        const y = height - chartPadding.bottom - normalizedValue * (height - chartPadding.top - chartPadding.bottom);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      // If only one point, draw a horizontal line
      if (data.length === 1) {
        const point = data[0];
        const normalizedValue = range > 0 ? (point.totalValue - adjustedMin) / range : 0.5;
        const y = height - chartPadding.bottom - normalizedValue * (height - chartPadding.top - chartPadding.bottom);
        ctx.moveTo(chartPadding.left, y);
        ctx.lineTo(width - chartPadding.right, y);
      }

      ctx.stroke();

      // Fill area under curve
      if (data.length > 1) {
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        ctx.lineTo(width - chartPadding.right, height - chartPadding.bottom);
        ctx.lineTo(chartPadding.left, height - chartPadding.bottom);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw value labels
    ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = adjustedMin + (range * (4 - i) / 4);
      const y = chartPadding.top + (height - chartPadding.top - chartPadding.bottom) * (i / 4);
      ctx.fillText(`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, chartPadding.left - 10, y + 4);
    }

    // Draw current value
    if (data.length > 0) {
      const lastPoint = data[data.length - 1];
      const x = width - chartPadding.right;
      const normalizedValue = range > 0 ? (lastPoint.totalValue - adjustedMin) / range : 0.5;
      const y = chartPadding.top + (height - chartPadding.top - chartPadding.bottom) * (1 - normalizedValue);
      
      // Draw dot
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw value label
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `$${lastPoint.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        x + 10,
        y - 5
      );
    }
  }, [data, isLoading, theme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500 dark:text-gray-400">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Timeframe selector */}
      <div className="flex gap-2 mb-4 justify-end">
        {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeframe === tf
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height }}
        />
      </div>

      {/* Stats */}
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Value</div>
            <div className="text-lg font-semibold text-black dark:text-white">
              ${data[data.length - 1].totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Portfolio</div>
            <div className="text-lg font-semibold text-black dark:text-white">
              ${data[data.length - 1].portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cash</div>
            <div className="text-lg font-semibold text-black dark:text-white">
              ${data[data.length - 1].cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioChart;
