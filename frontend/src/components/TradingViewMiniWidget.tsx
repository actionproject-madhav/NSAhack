import React, { useEffect, useRef, memo } from 'react';

interface TradingViewMiniWidgetProps {
  symbol: string;
  height?: string;
  theme?: 'light' | 'dark';
}

function TradingViewMiniWidget({ symbol, height = "300px", theme = "light" }: TradingViewMiniWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content
    container.current.innerHTML = '';

    // Determine exchange based on symbol (most common US stocks)
    let fullSymbol = symbol;
    
    // NASDAQ stocks
    const nasdaqStocks = ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'INTC', 'CSCO', 'ADBE', 'AVGO', 'PYPL'];
    // NYSE stocks
    const nyseStocks = ['JPM', 'V', 'WMT', 'JNJ', 'PG', 'UNH', 'MA', 'HD', 'DIS', 'BAC', 'VZ', 'PFE', 'KO', 'NKE', 'MCD'];
    
    if (nasdaqStocks.includes(symbol)) {
      fullSymbol = `NASDAQ:${symbol}`;
    } else if (nyseStocks.includes(symbol)) {
      fullSymbol = `NYSE:${symbol}`;
    } else {
      // Default to just the symbol (TradingView will auto-detect)
      fullSymbol = symbol;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": fullSymbol,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": theme,
      "trendLineColor": theme === 'dark' ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)",
      "underLineColor": theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      "underLineBottomColor": "rgba(0, 0, 0, 0)",
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
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

export default memo(TradingViewMiniWidget);