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

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": `NASDAQ:${symbol}`,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": theme,
      "trendLineColor": "rgba(41, 98, 255, 1)",
      "underLineColor": "rgba(41, 98, 255, 0.3)",
      "underLineBottomColor": "rgba(41, 98, 255, 0)",
      "isTransparent": false,
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