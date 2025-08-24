import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Plus, Settings, Info, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

interface CryptoAsset {
  id: number
  name: string
  symbol: string
  logo: string
  price: number
  change1h: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  volume24hCrypto: number
  circulatingSupply: number
  trend: 'up' | 'down'
}

const PortfolioPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('crypto51')

  // Mock crypto data based on the image
  const cryptoAssets: CryptoAsset[] = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: '₿',
      price: 88573.66,
      change1h: 0.12,
      change24h: -0.63,
      change7d: 1.49,
      marketCap: 8986754284,
      volume24h: 64762993140,
      volume24hCrypto: 645582,
      circulatingSupply: 19795252,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Auto Token',
      symbol: 'AUTO',
      logo: '⚙️',
      price: 12.45,
      change1h: 2.34,
      change24h: 5.67,
      change7d: 12.89,
      marketCap: 1567890123,
      volume24h: 2345678901,
      volume24hCrypto: 123456,
      circulatingSupply: 125000000,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Infracoin',
      symbol: 'INB',
      logo: '🌙',
      price: 0.89,
      change1h: -1.23,
      change24h: -3.45,
      change7d: -8.76,
      marketCap: 987654321,
      volume24h: 3456789012,
      volume24hCrypto: 234567,
      circulatingSupply: 1110000000,
      trend: 'down'
    },
    {
      id: 4,
      name: 'Blockport',
      symbol: 'BPT',
      logo: '🔵',
      price: 2.34,
      change1h: 0.56,
      change24h: 1.78,
      change7d: 4.32,
      marketCap: 2345678901,
      volume24h: 4567890123,
      volume24hCrypto: 345678,
      circulatingSupply: 1000000000,
      trend: 'up'
    },
    {
      id: 5,
      name: 'Anchored',
      symbol: 'AUR',
      logo: '🟣',
      price: 5.67,
      change1h: -0.89,
      change24h: -2.34,
      change7d: -6.78,
      marketCap: 3456789012,
      volume24h: 5678901234,
      volume24hCrypto: 456789,
      circulatingSupply: 600000000,
      trend: 'down'
    },
    {
      id: 6,
      name: 'Cobinhood',
      symbol: 'COB',
      logo: '🟢',
      price: 0.78,
      change1h: 1.45,
      change24h: 3.67,
      change7d: 9.12,
      marketCap: 4567890123,
      volume24h: 6789012345,
      volume24hCrypto: 567890,
      circulatingSupply: 800000000,
      trend: 'up'
    },
    {
      id: 7,
      name: 'Trinity',
      symbol: 'TNC',
      logo: '🩷',
      price: 1.23,
      change1h: -0.67,
      change24h: -1.89,
      change7d: -4.56,
      marketCap: 5678901234,
      volume24h: 7890123456,
      volume24hCrypto: 678901,
      circulatingSupply: 900000000,
      trend: 'down'
    },
    {
      id: 8,
      name: 'Belt Fin',
      symbol: 'BELT',
      logo: '🟠',
      price: 3.45,
      change1h: 0.89,
      change24h: 2.12,
      change7d: 5.67,
      marketCap: 6789012345,
      volume24h: 8901234567,
      volume24hCrypto: 789012,
      circulatingSupply: 700000000,
      trend: 'up'
    },
    {
      id: 9,
      name: 'Near Protocol',
      symbol: 'NEAR',
      logo: '⚫',
      price: 7.89,
      change1h: -1.34,
      change24h: -2.78,
      change7d: -7.23,
      marketCap: 7890123456,
      volume24h: 9012345678,
      volume24hCrypto: 890123,
      circulatingSupply: 500000000,
      trend: 'down'
    },
    {
      id: 10,
      name: 'Torn',
      symbol: 'TORN',
      logo: '⚫',
      price: 4.56,
      change1h: 0.78,
      change24h: 1.89,
      change7d: 4.23,
      marketCap: 8901234567,
      volume24h: 1234567890,
      volume24hCrypto: 123456,
      circulatingSupply: 400000000,
      trend: 'up'
    },
    {
      id: 11,
      name: 'Ternio',
      symbol: 'TERN',
      logo: '🔵',
      price: 0.67,
      change1h: -0.45,
      change24h: -1.23,
      change7d: -3.45,
      marketCap: 9012345678,
      volume24h: 2345678901,
      volume24hCrypto: 234567,
      circulatingSupply: 1200000000,
      trend: 'down'
    },
    {
      id: 12,
      name: 'Huobi BTC',
      symbol: 'HBTC',
      logo: '🔵',
      price: 88573.66,
      change1h: 0.12,
      change24h: -0.63,
      change7d: 1.49,
      marketCap: 1234567890,
      volume24h: 3456789012,
      volume24hCrypto: 345678,
      circulatingSupply: 13950,
      trend: 'up'
    }
  ]

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(2)}`
  }

  const formatCryptoNumber = (num: number, symbol: string) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M ${symbol}`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K ${symbol}`
    return `${num.toLocaleString()} ${symbol}`
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">My Picks</h1>
              <ChevronDown className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                + New asset
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4" />
                Customise
              </button>
            </div>
            </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'portfolio' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('crypto51')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'crypto51' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Crypto <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs ml-1">51</span>
            </button>
            <button
              onClick={() => setActiveTab('pairs')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'pairs' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pairs
            </button>
            <button
              onClick={() => setActiveTab('traders')}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === 'traders' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Traders
            </button>
          </div>
        </motion.div>

        {/* Crypto Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    1h%
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h%
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    7d%
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market cap <Info className="inline w-3 h-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume (24h) <Info className="inline w-3 h-3 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Circulating supply <Info className="inline w-3 h-3 ml-1" />
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cryptoAssets.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: asset.id * 0.05 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{asset.id}</span>
                </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                          {asset.logo}
              </div>
              <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.symbol}</div>
              </div>
            </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${asset.price.toLocaleString()}
        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        asset.change1h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change1h >= 0 ? 
                          <TrendingUp className="w-3 h-3" /> :
                          <TrendingDown className="w-3 h-3" />
                        }
                        {asset.change1h >= 0 ? '↑' : '↓'} {Math.abs(asset.change1h).toFixed(2)}%
            </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change24h >= 0 ? 
                          <TrendingUp className="w-3 h-3" /> :
                          <TrendingDown className="w-3 h-3" />
                        }
                        {asset.change24h >= 0 ? '↑' : '↓'} {Math.abs(asset.change24h).toFixed(2)}%
          </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        asset.change7d >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change7d >= 0 ? 
                          <TrendingUp className="w-3 h-3" /> :
                          <TrendingDown className="w-3 h-3" />
                        }
                        {asset.change7d >= 0 ? '↑' : '↓'} {Math.abs(asset.change7d).toFixed(2)}%
            </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatNumber(asset.marketCap)}
          </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{formatNumber(asset.volume24h)}</div>
                        <div className="text-gray-500">{formatCryptoNumber(asset.volume24hCrypto, asset.symbol)}</div>
          </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCryptoNumber(asset.circulatingSupply, asset.symbol)}
                  </div>
                    </td>
                    
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PortfolioPage