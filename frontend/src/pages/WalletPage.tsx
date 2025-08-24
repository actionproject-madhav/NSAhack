import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  ChevronDown, 
  Download, 
  Grid3X3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Pencil,
  Zap,
  ChevronRight,
  MoreVertical,
  DollarSign, 
  Wallet
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

interface Transaction {
  id: string
  paymentName: string
  amount: number
  date: Date
  status: 'completed' | 'failed'
  type: 'income' | 'expense'
  icon: string
}

const WalletPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [timeFilter, setTimeFilter] = useState('Latest')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  // Mock transaction data based on the image
  const transactions: Transaction[] = [
    {
      id: 'TXN-24020110',
      paymentName: 'Transfer from Bank',
      amount: 980,
      date: new Date('2025-02-29T21:41:00'),
      status: 'completed',
      type: 'income',
      icon: '🏦'
    },
    {
      id: 'TXN-24020109',
      paymentName: 'Youtube Premium',
      amount: -20,
      date: new Date('2025-02-29T21:41:00'),
      status: 'completed',
      type: 'expense',
      icon: '📺'
    },
    {
      id: 'TXN-24020108',
      paymentName: 'Internet',
      amount: -120,
      date: new Date('2025-02-29T13:56:00'),
      status: 'completed',
      type: 'expense',
      icon: '🌐'
    },
    {
      id: 'TXN-24020107',
      paymentName: 'Transfer from Bank',
      amount: 1000,
      date: new Date('2025-02-29T11:36:00'),
      status: 'completed',
      type: 'income',
      icon: '🏦'
    },
    {
      id: 'TXN-24020106',
      paymentName: 'Transfer from Bank',
      amount: 1200,
      date: new Date('2025-02-29T11:25:00'),
      status: 'completed',
      type: 'income',
      icon: '🏦'
    },
    {
      id: 'TXN-24020105',
      paymentName: 'Starbucks Coffee',
      amount: -12,
      date: new Date('2025-02-29T09:41:00'),
      status: 'completed',
      type: 'expense',
      icon: '☕'
    },
    {
      id: 'TXN-24020104',
      paymentName: 'Salary (Freelance)',
      amount: 100,
      date: new Date('2025-02-28T22:12:00'),
      status: 'completed',
      type: 'income',
      icon: '💼'
    },
    {
      id: 'TXN-24020103',
      paymentName: 'Crypto Investment',
      amount: 1000,
      date: new Date('2025-02-28T22:12:00'),
      status: 'completed',
      type: 'income',
      icon: '₿'
    },
    {
      id: 'TXN-24020102',
      paymentName: 'Amazon Purchase',
      amount: -30,
      date: new Date('2025-02-27T22:12:00'),
      status: 'completed',
      type: 'expense',
      icon: '📦'
    },
    {
      id: 'TXN-24020101',
      paymentName: 'Spotify Premium',
      amount: -40,
      date: new Date('2025-02-27T08:00:00'),
      status: 'failed',
      type: 'expense',
      icon: '🎵'
    }
  ]

  const totalTransactions = 125430
  const totalIncome = 92000
  const totalExpenses = 58500

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return `${date.toLocaleDateString('en-US', options)} · ${date.toLocaleTimeString('en-US', timeOptions)}`
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Failed</span>
    }
  }

  const toggleTransactionSelection = (id: string) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(t => t !== id))
    } else {
      setSelectedTransactions([...selectedTransactions, id])
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Pencil className="w-4 h-4" />
                Ask FinLit AI
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </motion.div>

                 {/* Summary Cards */}
         <div className="grid md:grid-cols-3 gap-6 mb-8">
           {/* Portfolio Value */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
             className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                 <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                 <h3 className="text-sm text-gray-500">Portfolio Value</h3>
                 <p className="text-2xl font-bold text-gray-900">${totalTransactions.toLocaleString()}</p>
                  </div>
                </div>
             <p className="text-sm text-green-600 font-medium">↑ 12.5% compared to last month</p>
              </motion.div>

           {/* Trading Profits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
             className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                 <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                 <h3 className="text-sm text-gray-500">Trading Profits</h3>
                 <p className="text-2xl font-bold text-gray-900">${totalIncome.toLocaleString()}</p>
                  </div>
                </div>
             <p className="text-sm text-green-600 font-medium">↑ 15.5% compared to last month</p>
              </motion.div>

           {/* Trading Losses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
             className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                 <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                 <h3 className="text-sm text-gray-500">Trading Losses</h3>
                 <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
             <p className="text-sm text-red-600 font-medium">↓ 8.5% compared to last month</p>
              </motion.div>
            </div>

        {/* Main Content and Sidebar */}
        <div className="flex gap-8">
          {/* Main Content - Transactions Table */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Table Header with Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-500" />
                </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Grid3X3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              </div>

                    <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Failed</option>
                  </select>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Latest</option>
                    <option>Oldest</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
              </div>
            </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.length === transactions.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTransactions(transactions.map(t => t.id))
                            } else {
                              setSelectedTransactions([])
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.includes(transaction.id)}
                            onChange={() => toggleTransactionSelection(transaction.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                              {transaction.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{transaction.paymentName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Show data 10 of 200</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{"<<"}</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{"<"}</button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
                    <span className="px-3 py-1 text-sm text-gray-500">...</span>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">10</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{">"}</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{">>"}</button>
                  </div>
                </div>
                  </div>
            </motion.div>
                </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Category Breakdown */}
                    <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Donut Chart Placeholder */}
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <div className="w-full h-full rounded-full border-8 border-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">125K</p>
                    <p className="text-xs text-gray-500">Total Balance</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-8 border-blue-600" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expense</span>
                        </div>
                          </div>
              
              {/* Insight */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Pencil className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">Your dining expense increased by 20% compared to last month</p>
                          </div>
                        </div>
            </motion.div>

            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Insight</h3>
                      </div>

              <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                <p className="text-sm leading-relaxed">
                  You have saved $1,200 this month. Based on your spending habits, allocating an additional 5% to savings can help you reach your financial goal faster.
                        </p>
                      </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Auto Save Now &gt;
              </button>
                    </motion.div>


                </div>
            </div>
      </div>
    </div>
  )
}

export default WalletPage