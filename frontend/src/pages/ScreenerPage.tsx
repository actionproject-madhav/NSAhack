import React from 'react';
import MarketScreener from '../components/MarketScreener';
import Navigation from '../components/Navigation';

export default function ScreenerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Screener</h1>
            <p className="text-gray-600">
              Discover and analyze stocks with our comprehensive screening tools
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm">
            <MarketScreener />
          </div>
        </div>
      </div>
    </div>
  );
}