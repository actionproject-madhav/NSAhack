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

        // Get current portfolio data
        const portfolioData = await tradingService.getPortfolio(userId);
        const cashBalance = portfolioData.cash_balance || 0;
        const portfolioValue = portfolioData.portfolio_value || 0;
        const totalValue = portfolioData.total_account_value || (portfolioValue + cashBalance);

        // For now, create a simple chart with current value
        // In a real implementation, you'd fetch historical data from backend
        // For demo, we'll create a simple line showing current value
        const now = Date.now();
        const dataPoints: PortfolioDataPoint[] = [];
        
        // Create data points for the selected timeframe
        const days = timeframe === '1D' ? 1 : 
                     timeframe === '1W' ? 7 : 
                     timeframe === '1M' ? 30 : 
                     timeframe === '3M' ? 90 : 
                     timeframe === '1Y' ? 365 : 365;
        
        const points = Math.min(days, 30); // Max 30 points for performance
        
        for (let i = points; i >= 0; i--) {
          const timestamp = now - (i * (days * 24 * 60 * 60 * 1000) / points);
          // For now, show current value (in real app, fetch historical data)
          dataPoints.push({
            timestamp,
            totalValue: totalValue, // Current value
            portfolioValue: portfolioValue,
            cashBalance: cashBalance
          });
        }

        setData(dataPoints);
      } catch (error) {
        console.error('Error loading portfolio history:', error);
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
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate value range
    const values = data.map(d => d.totalValue);
    const minValue = Math.min(...values, 0);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Draw grid
    ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw chart line
    if (data.length > 1) {
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding.left + (width - padding.left - padding.right) * (index / (data.length - 1));
        const y = height - padding.bottom - ((point.totalValue - minValue) / range) * (height - padding.top - padding.bottom);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineTo(width - padding.right, height - padding.bottom);
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.closePath();
      ctx.fill();
    }

    // Draw value labels
    ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (range * (4 - i) / 4);
      const y = padding.top + (height - padding.top - padding.bottom) * (i / 4);
      ctx.fillText(`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, padding.left - 10, y + 4);
    }

    // Draw current value
    if (data.length > 0) {
      const lastPoint = data[data.length - 1];
      const x = width - padding.right;
      const y = padding.top + (height - padding.top - padding.bottom) * (1 - (lastPoint.totalValue - minValue) / range);
      
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
