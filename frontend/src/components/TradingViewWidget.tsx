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
      "symbol": `NASDAQ:${symbol}`,
      "theme": theme,
      "timezone": "Etc/UTC",
      "backgroundColor": theme === 'light' ? "#ffffff" : "#1e1e1e",
      "gridColor": theme === 'light' ? "rgba(46, 46, 46, 0.06)" : "rgba(255, 255, 255, 0.1)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true,
      "hide_legend": true
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