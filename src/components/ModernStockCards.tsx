import React from 'react';
import svgPaths from "./imports/svg-wvh7o9wvzx";
import { StockQuote } from '../services/alphaVantageApi';

interface StockCardProps {
  symbol: string;
  company: string;
  value: string;
  change: string;
  changeValue: string;
  backgroundColor: string;
  textColor?: string;
  changeColor: string;
  quote?: StockQuote;
}

// Nvidia Stock Card Components
function NvidiaIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 18">
        <g>
          <path d={svgPaths.p3c540d00} fill="#2C2C2C" />
          <path d={svgPaths.p2b9efa80} fill="#2C2C2C" />
        </g>
      </svg>
    </div>
  );
}

function MetaIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g>
          <path d={svgPaths.p128d4200} fill="white" />
          <path d={svgPaths.p12ed5b40} fill="white" />
          <path d={svgPaths.p1a7ce980} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function TeslaIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g>
          <path d={svgPaths.p3fc61a00} fill="#2C2C2C" />
          <path d={svgPaths.p1893aa30} fill="#2C2C2C" />
        </g>
      </svg>
    </div>
  );
}

function AppleIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#2C2C2C"/>
      </svg>
    </div>
  );
}

function AMDIcon() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p29e18300} fill="#2C2C2C" />
      </svg>
    </div>
  );
}

function MiniChart({ paths, strokeColor, fillColor, isPositive }: { 
  paths: string; 
  strokeColor: string; 
  fillColor: string;
  isPositive: boolean;
}) {
  return (
    <div className="h-6 relative w-[78px]">
      <div className="absolute bottom-0 left-[-0.64%] right-[-0.64%] top-[-0.46%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 25">
          <g>
            <path 
              d={svgPaths.p10bd5d70} 
              fill={`url(#gradient-${strokeColor.replace('#', '')})`} 
              fillOpacity="0.16" 
            />
            <path 
              d={paths} 
              stroke={strokeColor} 
              strokeLinecap="round" 
            />
          </g>
          <defs>
            <linearGradient 
              gradientUnits="userSpaceOnUse" 
              id={`gradient-${strokeColor.replace('#', '')}`} 
              x1="40" 
              x2="40" 
              y1="25" 
              y2="1"
            >
              <stop stopColor={strokeColor} stopOpacity="0" />
              <stop offset="0.809892" stopColor={strokeColor} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function StockCard({ 
  symbol, 
  company, 
  value, 
  change, 
  changeValue, 
  backgroundColor, 
  textColor = "#2C2C2C", 
  changeColor,
  quote 
}: StockCardProps) {
  const getIcon = () => {
    switch (symbol) {
      case 'NVDA': return <NvidiaIcon />;
      case 'META': return <MetaIcon />;
      case 'TSLA': return <TeslaIcon />;
      case 'AAPL': return <AppleIcon />;
      case 'AMD': return <AMDIcon />;
      default: return <div className="w-6 h-6 bg-gray-300 rounded" />;
    }
  };

  const isPositive = changeValue.startsWith('+');
  const chartPaths = isPositive ? svgPaths.p1d9aed00 : svgPaths.pe91d000;

  // Use real data if available, with fallback to mock data
  const displayValue = quote && quote.price ? `$${quote.price.toFixed(2)}` : value;
  const displayChange = quote && quote.changePercent !== undefined ? `${quote.change >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%` : change;
  const displayChangeValue = quote && quote.change !== undefined ? `${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)}` : changeValue;
  const actualChangeColor = quote && quote.change !== undefined ? (quote.change >= 0 ? '#77B900' : '#E8464C') : changeColor;

  return (
    <div 
      className="box-border content-stretch flex flex-col gap-4 h-[116px] items-center justify-center px-3 py-4 relative rounded-lg shrink-0"
      style={{ backgroundColor }}
    >
      {/* Header with icon, company name, symbol and change */}
      <div className="content-stretch flex gap-[90px] items-center justify-start relative shrink-0">
        <div className="content-stretch flex gap-1.5 items-center justify-start relative shrink-0">
          {getIcon()}
          <div 
            className="font-jakarta font-medium leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap"
            style={{ color: textColor }}
          >
            <p className="leading-[normal] whitespace-pre">{company}</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col font-jakarta font-normal items-end justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap text-right uppercase w-[33px]">
          <div className="relative shrink-0" style={{ color: textColor }}>
            <p className="leading-[normal] text-nowrap whitespace-pre">{symbol}</p>
          </div>
          <div className="relative shrink-0" style={{ color: actualChangeColor }}>
            <p className="leading-[normal] text-nowrap whitespace-pre">{displayChangeValue}</p>
          </div>
        </div>
      </div>

      {/* Value and Chart */}
      <div className="content-stretch flex gap-[34px] items-center justify-start relative shrink-0">
        <div className="capitalize content-stretch flex flex-col gap-1 items-start justify-start leading-[0] not-italic relative shrink-0 text-nowrap">
          <div 
            className="font-jakarta font-normal relative shrink-0 text-[12px]"
            style={{ color: textColor === "#ffffff" ? "rgba(255,255,255,0.8)" : "#838383" }}
          >
            <p className="leading-[normal] text-nowrap whitespace-pre">Current Value</p>
          </div>
          <div 
            className="font-jakarta font-medium relative shrink-0 text-[18px]"
            style={{ color: textColor }}
          >
            <p className="leading-[normal] text-nowrap whitespace-pre">{displayValue}</p>
          </div>
        </div>
        <MiniChart 
          paths={chartPaths}
          strokeColor={actualChangeColor}
          fillColor={actualChangeColor}
          isPositive={quote ? quote.change >= 0 : isPositive}
        />
      </div>
    </div>
  );
}

interface ModernStockCardsProps {
  quotes?: StockQuote[];
}

export function ModernStockCards({ quotes = [] }: ModernStockCardsProps) {
  const stocksConfig = [
    {
      symbol: 'NVDA',
      company: 'Nvidia',
      value: '$203.65',
      change: '+2.34%',
      changeValue: '+5.63',
      backgroundColor: '#a6f7e2',
      changeColor: '#77B900'
    },
    {
      symbol: 'META',
      company: 'Meta',
      value: '$151.74',
      change: '+1.23%',
      changeValue: '-4.44',
      backgroundColor: '#b79bff',
      textColor: '#ffffff',
      changeColor: '#ff2f2f'
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc',
      value: '$177.90',
      change: '-0.45%',
      changeValue: '+17.63',
      backgroundColor: '#ffe5a5',
      changeColor: '#77B900'
    },
    {
      symbol: 'AAPL',
      company: 'Apple Inc',
      value: '$145.93',
      change: '+0.87%',
      changeValue: '+23.41',
      backgroundColor: '#c7ffa5',
      changeColor: '#77B900'
    },
    {
      symbol: 'AMD',
      company: 'Advanced Micro',
      value: '$75.40',
      change: '+2.15%',
      changeValue: '-2.01',
      backgroundColor: '#f8a5ff',
      changeColor: '#e8464c'
    }
  ];

  console.log('ModernStockCards quotes:', quotes); // Debug log

  return (
    <div className="bg-white box-border rounded-lg p-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-2 min-w-max">
          {stocksConfig.slice(0, 4).map((stock) => {
            const quote = quotes.find(q => q.symbol === stock.symbol);
            console.log(`Stock ${stock.symbol} quote:`, quote); // Debug log
            return (
              <div key={stock.symbol} className="flex-shrink-0">
                <StockCard
                  {...stock}
                  quote={quote}
                />
              </div>
            );
          })}
        </div>
        
        {/* Arrow Right Button */}
        <div className="flex-shrink-0 bg-[#6425fe] box-border flex gap-2.5 items-center justify-center p-[10px] rounded-lg shadow-[0px_4px_17px_0px_rgba(0,0,0,0.12)] ml-2">
          <div className="relative shrink-0 size-6">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M10 5L17 12L10 19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
