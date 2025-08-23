import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface WatchlistItem {
  name: string
  symbol: string
  price: string
  change: string
  changeColor: string
  logo: string
}

const WatchlistCard = () => {
  const watchlistItems: WatchlistItem[] = [
    { 
      name: 'Amazon.com, Inc.', 
      symbol: 'AMZN', 
      price: '$102.24', 
      change: '+3.02', 
      changeColor: '#10B981', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' 
    },
    { 
      name: 'Coca-Cola Co', 
      symbol: 'KO', 
      price: '$60.49', 
      change: '-0.32', 
      changeColor: '#EF4444', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' 
    },
    { 
      name: 'Bayerische Motoren Werke AG', 
      symbol: 'BMW', 
      price: '$92.94', 
      change: '+0.59', 
      changeColor: '#10B981', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg' 
    },
    { 
      name: 'Microsoft Corp', 
      symbol: 'MSFT', 
      price: '$248.16', 
      change: '+0.16', 
      changeColor: '#10B981', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' 
    },
    { 
      name: 'United Parcel Service, Inc.', 
      symbol: 'UPS', 
      price: '$182.09', 
      change: '+2.39', 
      changeColor: '#10B981', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/UPS_logo_shield.svg' 
    },
  ]

  return (
    <motion.div 
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col h-[320px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium text-gray-900">Watchlist</h3>
        <motion.button 
          className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Watchlist Items */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {watchlistItems.map((item, index) => (
          <WatchlistItem key={index} item={item} />
        ))}
      </div>
    </motion.div>
  )
}

interface WatchlistItemProps {
  item: WatchlistItem
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
  return (
    <motion.div 
      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
      whileHover={{ backgroundColor: '#f9fafb' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <img 
          src={item.logo} 
          alt={`${item.name} logo`} 
          className="w-6 h-6 object-contain flex-shrink-0"
          onError={(e) => { 
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = `https://placehold.co/24x24/f8f8f8/ccc?text=${item.symbol}`
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-xs leading-tight truncate">{item.name}</p>
          <p className="text-gray-500 text-xs">{item.symbol}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-medium text-gray-900 text-xs">{item.price}</p>
        <p className="text-xs font-medium" style={{ color: item.changeColor }}>
          {item.change}
        </p>
      </div>
    </motion.div>
  )
}

export default WatchlistCard