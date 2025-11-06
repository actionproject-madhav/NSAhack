import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  height?: string;
  theme?: 'light' | 'dark';
}

function TradingViewWidget({ symbol, height = "400px", theme = "light" }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content
    container.current.innerHTML = '';

    // Smart exchange detection
    let fullSymbol = symbol;
    const nasdaqStocks = ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'INTC', 'CSCO', 'ADBE', 'AVGO', 'PYPL', 'QCOM', 'TXN', 'SBUX'];
    const nyseStocks = ['JPM', 'V', 'WMT', 'JNJ', 'PG', 'UNH', 'MA', 'HD', 'DIS', 'BAC', 'VZ', 'PFE', 'KO', 'NKE', 'MCD', 'CVX', 'XOM', 'GS', 'GE', 'IBM'];
    
    if (nasdaqStocks.includes(symbol)) {
      fullSymbol = `NASDAQ:${symbol}`;
    } else if (nyseStocks.includes(symbol)) {
      fullSymbol = `NYSE:${symbol}`;
    } else {
      fullSymbol = symbol; // TradingView will auto-detect
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": fullSymbol,
      "theme": theme,
      "timezone": "Etc/UTC",
      "backgroundColor": theme === 'light' ? "#ffffff" : "#000000",
      "gridColor": theme === 'light' ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true,
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    
    container.current.appendChild(widgetContainer);
    widgetContainer.appendChild(script);

  }, [symbol, theme]);

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height, width: "100%" }}
    />
  );
}

export default memo(TradingViewWidget);