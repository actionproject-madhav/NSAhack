import React from 'react';
import MarketScreener from '../components/MarketScreener';
import Layout from '../components/Layout';

export default function ScreenerPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Market Screener</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and analyze stocks with our comprehensive screening tools
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <MarketScreener />
          </div>
        </div>
      </div>
    </Layout>
  );
}