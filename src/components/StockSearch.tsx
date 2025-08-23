import React, { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Star } from 'lucide-react'
import { alphaVantageAPI, SearchResult } from '../services/alphaVantageApi'

interface StockSearchProps {
  onStockSelect: (stock: SearchResult) => void
  placeholder?: string
  className?: string
}

export const StockSearch: React.FC<StockSearchProps> = ({ 
  onStockSelect, 
  placeholder = "Search any stock, ETF, or company...",
  className = ""
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Popular stocks for quick access
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ]

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 1) {
        setResults([])
        setShowResults(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const searchResults = await alphaVantageAPI.searchSymbols(searchQuery)
        if (searchResults.length === 0) {
          setError(`No results found for "${searchQuery}"`)
        }
        setResults(searchResults.slice(0, 10))
        setShowResults(true)
      } catch (error) {
        console.error('Search failed:', error)
        setError('Search failed. Please try again.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 400),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleStockSelect = (stock: SearchResult | { symbol: string; name: string }) => {
    const searchResult: SearchResult = 'type' in stock ? stock : {
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'UTC-04',
      currency: 'USD',
      matchScore: '1.0000'
    }
    
    onStockSelect(searchResult)
    setQuery('')
    setShowResults(false)
    setError(null)
  }

  const handleInputFocus = () => {
    if (query.length >= 1) {
      setShowResults(true)
    } else {
      setShowResults(true)
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium"
          onFocus={handleInputFocus}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {query.length === 0 && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Popular Stocks</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock)}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100"
                  >
                    <div className="font-semibold text-sm text-gray-900">{stock.symbol}</div>
                    <div className="text-xs text-gray-600 truncate">{stock.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-600 bg-red-50">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((stock, index) => (
                <div
                  key={`${stock.symbol}-${index}`}
                  onClick={() => handleStockSelect(stock)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{stock.symbol}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {stock.type}
                        </span>
                        {parseFloat(stock.matchScore) > 0.8 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{stock.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{stock.region}</span>
                        <span>•</span>
                        <span>{stock.currency}</span>
                        {stock.marketOpen && stock.marketClose && (
                          <>
                            <span>•</span>
                            <span>{stock.marketOpen}-{stock.marketClose}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
};
