import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal'
  symbol?: string
  company?: string
  shares?: number
  price?: number
  amount: number
  date: Date
  status: 'completed' | 'pending' | 'failed'
  logo?: string
}

const WalletPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview')
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell' | 'deposit' | 'withdrawal'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock wallet data
  const walletBalance = 2450.75
  const availableCash = 2450.75
  const pendingTransactions = 0

  // Mock transaction history
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'buy',
      symbol: 'AAPL',
      company: 'Apple Inc.',
      shares: 5,
      price: 175.30,
      amount: -876.50,
      date: new Date('2024-01-15'),
      status: 'completed',
      logo: '🍎'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 1000.00,
      date: new Date('2024-01-14'),
      status: 'completed'
    },
    {
      id: '3',
      type: 'buy',
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      shares: 2,
      price: 242.15,
      amount: -484.30,
      date: new Date('2024-01-12'),
      status: 'completed',
      logo: '🚗'
    },
    {
      id: '4',
      type: 'sell',
      symbol: 'NVDA',
      company: 'NVIDIA Corp.',
      shares: 1,
      price: 203.65,
      amount: 203.65,
      date: new Date('2024-01-10'),
      status: 'completed',
      logo: '🔥'
    },
    {
      id: '5',
      type: 'deposit',
      amount: 500.00,
      date: new Date('2024-01-08'),
      status: 'completed'
    },
    {
      id: '6',
      type: 'buy',
      symbol: 'META',
      company: 'Meta Platforms',
      shares: 3,
      price: 325.70,
      amount: -977.10,
      date: new Date('2024-01-05'),
      status: 'completed',
      logo: '📱'
    }
  ]

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesFilter = filterType === 'all' || transaction.type === filterType
    const matchesSearch = !searchTerm || 
      transaction.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'sell':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-blue-600" />
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-orange-600" />
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-red-600' // Money going out
      case 'sell':
      case 'deposit':
        return 'text-green-600' // Money coming in
      case 'withdrawal':
        return 'text-red-600' // Money going out
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>
      default:
        return null
    }
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Wallet</h1>
              <p className="text-gray-600">Manage your funds and track transactions</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />
                Deposit
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'transactions'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Transactions
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Wallet Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Total Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Balance</h3>
                    <p className="text-2xl font-bold">${walletBalance.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Available Cash */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Available Cash</h3>
                    <p className="text-2xl font-bold text-green-600">${availableCash.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Pending */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Pending</h3>
                    <p className="text-2xl font-bold">${pendingTransactions.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/trade')}
                  className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Buy Stocks</h3>
                    <p className="text-sm text-gray-600">Invest in your favorite companies</p>
                  </div>
                </button>

                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                      <ArrowDownLeft className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Add Funds</h3>
                    <p className="text-sm text-gray-600">Deposit money to your wallet</p>
                  </div>
                </button>

                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200">
                      <ArrowUpRight className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Withdraw</h3>
                    <p className="text-sm text-gray-600">Transfer funds to your bank</p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  View All <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {allTransactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {transaction.logo ? (
                          <span className="text-lg">{transaction.logo}</span>
                        ) : (
                          getTransactionIcon(transaction.type)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {transaction.type === 'buy' && `Buy ${transaction.symbol}`}
                          {transaction.type === 'sell' && `Sell ${transaction.symbol}`}
                          {transaction.type === 'deposit' && 'Cash Deposit'}
                          {transaction.type === 'withdrawal' && 'Cash Withdrawal'}
                        </p>
                        {transaction.company && (
                          <p className="text-sm text-gray-500">{transaction.company}</p>
                        )}
                        {transaction.shares && (
                          <p className="text-xs text-gray-400">
                            {transaction.shares} shares × ${transaction.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters and Search */}
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {['all', 'buy', 'sell', 'deposit', 'withdrawal'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                        filterType === type
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  All Transactions ({filteredTransactions.length})
                </h2>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setFilterType('all')
                      setSearchTerm('')
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {transaction.logo ? (
                            <span className="text-xl">{transaction.logo}</span>
                          ) : (
                            getTransactionIcon(transaction.type)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">
                              {transaction.type === 'buy' && `Buy ${transaction.symbol}`}
                              {transaction.type === 'sell' && `Sell ${transaction.symbol}`}
                              {transaction.type === 'deposit' && 'Cash Deposit'}
                              {transaction.type === 'withdrawal' && 'Cash Withdrawal'}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                          {transaction.company && (
                            <p className="text-sm text-gray-500">{transaction.company}</p>
                          )}
                          {transaction.shares && (
                            <p className="text-xs text-gray-400">
                              {transaction.shares} shares × ${transaction.price?.toFixed(2)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{transaction.date.toLocaleDateString()}</span>
                            <span>{transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {transaction.id}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default WalletPage