import React, { useState } from 'react'
import { Clock } from 'lucide-react'

interface InvestmentOption {
  id: string
  name: string
  ticker: string
  type: 'ETF' | 'Stock' | 'Bond'
  riskLevel: 'Low' | 'Medium' | 'High'
  minInvestment: number
  expectedReturn: string
  description: string
  whyGoodForStudents: string
  pros: string[]
  cons: string[]
  logo: string
}

const STUDENT_FRIENDLY_INVESTMENTS: InvestmentOption[] = [
  {
    id: 'vti',
    name: 'Vanguard Total Stock Market ETF',
    ticker: 'VTI',
    type: 'ETF',
    riskLevel: 'Medium',
    minInvestment: 267, // Real current price
    expectedReturn: '10.1% annually',
    description: 'Owns entire US stock market - 4,000+ companies in one fund',
    whyGoodForStudents: 'Warren Buffett recommends this for beginners. Expense ratio: 0.03% (extremely low fees).',
    pros: ['Broadest diversification possible', 'Ultra-low 0.03% expense ratio', '10-year average: 12.1% returns'],
    cons: ['No international exposure', 'Includes small unprofitable companies'],
  },
  {
    id: 'spy',
    name: 'SPDR S&P 500 ETF',
    ticker: 'SPY',
    type: 'ETF',
    riskLevel: 'Medium',
    minInvestment: 516, // Real current price
    expectedReturn: '9.8% annually',
    description: 'Tracks S&P 500 - America\'s 500 largest companies',
    whyGoodForStudents: 'Most liquid ETF in the world. Contains Apple (7%), Microsoft (7%), Amazon (3%).',
    pros: ['Highest liquidity', 'Blue-chip companies only', '50+ year track record'],
    cons: ['Higher expense ratio (0.09%)', 'Large-cap bias only'],
  },
  {
    id: 'voo',
    name: 'Vanguard S&P 500 ETF',
    ticker: 'VOO',
    type: 'ETF',
    riskLevel: 'Medium',
    minInvestment: 515, // Real current price
    expectedReturn: '9.8% annually',
    description: 'Same as SPY but with lower fees from Vanguard',
    whyGoodForStudents: 'Identical performance to SPY but 0.03% expense ratio vs 0.09%. Save $60/year per $10k invested.',
    pros: ['Ultra-low 0.03% fees', 'Same S&P 500 exposure', 'Vanguard\'s reputation'],
    cons: ['Less liquid than SPY', 'No options trading'],

  },
  {
    id: 'schd',
    name: 'Schwab US Dividend Equity ETF',
    ticker: 'SCHD',
    type: 'ETF',
    riskLevel: 'Low',
    minInvestment: 82, // Real current price
    expectedReturn: '8.2% annually + 3.5% dividend',
    description: 'High-quality dividend aristocrats - companies that increase dividends yearly',
    whyGoodForStudents: 'Quarterly dividend payments provide passive income. Holdings: Home Depot, Coca-Cola, Pfizer.',
    pros: ['3.5% dividend yield', 'Quality dividend growers', 'Lower volatility than growth stocks'],
    cons: ['Lower total returns', 'Interest rate sensitive'],

  },
  {
    id: 'vxus',
    name: 'Vanguard Total International Stock ETF',
    ticker: 'VXUS',
    type: 'ETF',
    riskLevel: 'Medium',
    minInvestment: 65, // Real current price
    expectedReturn: '7.5% annually',
    description: 'International diversification - Europe, Asia, emerging markets',
    whyGoodForStudents: 'Don\'t put all eggs in US basket. Includes Nestle, Samsung, ASML. Currency diversification.',
    pros: ['Geographic diversification', 'Currency hedge', 'Access to international growth'],
    cons: ['Higher political risk', 'Currency fluctuation', 'Lower historical returns'],

  }
]

const BeginnerInvestmentGuide: React.FC = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOption | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<number>(500)

  const calculateProjection = (investment: InvestmentOption, amount: number) => {
    const annualReturn = parseFloat(investment.expectedReturn.split('-')[1].replace('%', '')) / 100
    const year1 = amount * (1 + annualReturn)
    const year5 = amount * Math.pow(1 + annualReturn, 5)
    const year10 = amount * Math.pow(1 + annualReturn, 10)
    
    return { year1, year5, year10 }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Recommendations</h3>
        <p className="text-sm text-gray-600">Beginner-approved options with low minimums</p>
      </div>

      {/* Investment Amount Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How much would you like to invest?
        </label>
        <div className="flex gap-2 mb-3">
          {[100, 250, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => setInvestmentAmount(amount)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                investmentAmount === amount
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          step="50"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-sm text-gray-600 mt-1">
          ${investmentAmount}
        </div>
      </div>

      {/* Investment Options */}
      <div className="grid gap-4 mb-6">
        {STUDENT_FRIENDLY_INVESTMENTS.map((investment) => {
          const projection = calculateProjection(investment, investmentAmount)
          const isAffordable = investmentAmount >= investment.minInvestment

          return (
            <div
              key={investment.id}
              onClick={() => isAffordable && setSelectedInvestment(investment)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedInvestment?.id === investment.id
                  ? 'border-blue-500 bg-blue-50'
                  : isAffordable
                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{investment.logo}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{investment.ticker}</h4>
                    <p className="text-sm text-gray-600">{investment.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    investment.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    investment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {investment.riskLevel} Risk
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{investment.expectedReturn}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{investment.description}</p>

              {!isAffordable && (
                <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Minimum investment: ${investment.minInvestment}
                </div>
              )}

              {isAffordable && (
                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Projected Growth</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        ${projection.year1.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-gray-600">1 Year</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        ${projection.year5.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-gray-600">5 Years</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        ${projection.year10.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-gray-600">10 Years</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detailed View */}
      {selectedInvestment && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Why {selectedInvestment.ticker} is recommended for students
          </h4>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 text-sm">{selectedInvestment.whyGoodForStudents}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Advantages</h5>
              <ul className="space-y-2">
                {selectedInvestment.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Considerations</h5>
              <ul className="space-y-2">
                {selectedInvestment.cons.map((con, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BeginnerInvestmentGuide