import React from 'react';
import { cn } from '../utils/cn';

interface InternationalTradingPanelProps {
  ticker: string;
  currentPrice: number;
  volatility: 'Low' | 'Medium' | 'High';
}

export default function InternationalTradingPanel({ 
  ticker, 
  currentPrice, 
  volatility 
}: InternationalTradingPanelProps) {
  const getVolatilityColor = (vol: string) => {
    switch (vol) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">International Trading</h3>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          getVolatilityColor(volatility)
        )}>
          {volatility} Risk
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Price</span>
          <span className="font-medium">${currentPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Market Status</span>
          <span className="text-green-600 font-medium">Open</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Trading Hours</span>
          <span className="font-medium">9:30 AM - 4:00 PM EST</span>
        </div>

        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 mb-2">International Student Notes:</div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Tax implications may apply</li>
            <li>• Consider currency exchange rates</li>
            <li>• Review visa trading restrictions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}