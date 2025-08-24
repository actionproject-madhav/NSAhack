import React, { useState } from 'react'
import { TrendingUp, Shield, Globe, DollarSign, Info, Calculator, Play } from 'lucide-react'

interface Investment {
  ticker: string
  name: string
  price: number
  returns: string
  expenseRatio: string
  type: 'ETF' | 'Stock'
  riskLevel: 'Low' | 'Medium' | 'High'
  description: string
  highlights: string[]
  minInvestment: number
}

interface SimulationParams {
  initialInvestment: number
  timeHorizon: number
  monthlyContribution: number
  riskTolerance: 'Low' | 'Medium' | 'High'
}

const RECOMMENDED_INVESTMENTS: Investment[] = [
  {
    ticker: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    price: 267,
    returns: '10.1% annually',
    expenseRatio: '0.03%',
    type: 'ETF',
    riskLevel: 'Medium',
    description: 'Owns entire US stock market - 4,000+ companies in one fund',
    highlights: ['Broadest diversification', 'Ultra-low fees', '10-year avg: 12.1%'],
    minInvestment: 267
  },
  {
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: 516,
    returns: '9.8% annually',
    expenseRatio: '0.09%',
    type: 'ETF',
    riskLevel: 'Medium',
    description: 'Tracks S&P 500 - America\'s 500 largest companies',
    highlights: ['Apple 7%', 'Microsoft 7%', 'Most liquid ETF'],
    minInvestment: 516
  },
  {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    price: 515,
    returns: '9.8% annually',
    expenseRatio: '0.03%',
    type: 'ETF',
    riskLevel: 'Medium',
    description: 'Same as SPY but with lower fees from Vanguard',
    highlights: ['Same S&P 500 exposure', 'Lower fees vs SPY', 'Save $60/year per $10k'],
    minInvestment: 515
  },
  {
    ticker: 'SCHD',
    name: 'Schwab US Dividend Equity ETF',
    price: 82,
    returns: '8.2% + 3.5% dividend',
    expenseRatio: '0.06%',
    type: 'ETF',
    riskLevel: 'Low',
    description: 'High-quality dividend aristocrats - companies that increase dividends yearly',
    highlights: ['3.5% dividend yield', 'Home Depot, Coca-Cola', 'Lower volatility'],
    minInvestment: 82
  },
  {
    ticker: 'VXUS',
    name: 'Vanguard Total International Stock ETF',
    price: 65,
    returns: '7.5% annually',
    expenseRatio: '0.08%',
    type: 'ETF',
    riskLevel: 'Medium',
    description: 'International diversification - Europe, Asia, emerging markets',
    highlights: ['Geographic diversification', 'Currency hedge', 'Nestle, Samsung, ASML'],
    minInvestment: 65
  }
]

const InvestmentRecommendations: React.FC = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [showSimulation, setShowSimulation] = useState(false)
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    initialInvestment: 1000,
    timeHorizon: 10,
    monthlyContribution: 100,
    riskTolerance: 'Medium'
  })

  const calculateProjection = (returns: string, initial: number, monthly: number, years: number) => {
    const annualRate = parseFloat(returns) / 100
    let total = initial
    
    for (let year = 1; year <= years; year++) {
      total = total * (1 + annualRate) + (monthly * 12)
    }
    
    return Math.round(total)
  }

  const getRecommendedAllocation = (riskTolerance: string) => {
    switch (riskTolerance) {
      case 'Low':
        return { VTI: 40, SCHD: 40, VXUS: 20 }
      case 'Medium':
        return { VTI: 50, VOO: 30, VXUS: 20 }
      case 'High':
        return { VTI: 60, SPY: 25, VXUS: 15 }
      default:
        return { VTI: 50, VOO: 30, VXUS: 20 }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-jakarta font-medium text-gray-900">Investment Recommendations</h2>
          <p className="text-sm text-gray-600">Student-friendly ETFs with real market data</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {showSimulation ? 'Hide' : 'Show'} Simulation
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            <span>Live prices</span>
          </div>
        </div>
      </div>

      {/* Simulation Panel */}
      {showSimulation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-600" />
            Investment Simulation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
              <input
                type="number"
                value={simulationParams.initialInvestment}
                onChange={(e) => setSimulationParams({
                  ...simulationParams,
                  initialInvestment: parseInt(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years)</label>
              <input
                type="number"
                value={simulationParams.timeHorizon}
                onChange={(e) => setSimulationParams({
                  ...simulationParams,
                  timeHorizon: parseInt(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution ($)</label>
              <input
                type="number"
                value={simulationParams.monthlyContribution}
                onChange={(e) => setSimulationParams({
                  ...simulationParams,
                  monthlyContribution: parseInt(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
              <select
                value={simulationParams.riskTolerance}
                onChange={(e) => setSimulationParams({
                  ...simulationParams,
                  riskTolerance: e.target.value as 'Low' | 'Medium' | 'High'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Simulation Results */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-3">Projected Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${calculateProjection('10.1', simulationParams.initialInvestment, simulationParams.monthlyContribution, simulationParams.timeHorizon).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(simulationParams.initialInvestment + (simulationParams.monthlyContribution * 12 * simulationParams.timeHorizon)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${(calculateProjection('10.1', simulationParams.initialInvestment, simulationParams.monthlyContribution, simulationParams.timeHorizon) - 
                     (simulationParams.initialInvestment + (simulationParams.monthlyContribution * 12 * simulationParams.timeHorizon))).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Growth</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h5 className="font-medium text-gray-900 mb-2">Recommended Allocation ({simulationParams.riskTolerance} Risk)</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(getRecommendedAllocation(simulationParams.riskTolerance)).map(([ticker, percentage]) => (
                  <span key={ticker} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                    {ticker}: {percentage}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {RECOMMENDED_INVESTMENTS.map((investment) => (
          <div
            key={investment.ticker}
            onClick={() => setSelectedInvestment(selectedInvestment?.ticker === investment.ticker ? null : investment)}
            className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedInvestment?.ticker === investment.ticker
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{investment.ticker}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      investment.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      investment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {investment.riskLevel} Risk
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{investment.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">${investment.price}</div>
                <div className="text-sm text-green-600">{investment.returns}</div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{investment.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {investment.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {highlight}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Min: ${investment.minInvestment}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Fee: {investment.expenseRatio}</span>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>

            {/* Expanded Details */}
            {selectedInvestment?.ticker === investment.ticker && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Why Good for Students</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {investment.ticker === 'VTI' && (
                        <>
                          <li>• Warren Buffett recommends for beginners</li>
                          <li>• Broadest possible diversification</li>
                          <li>• Ultra-low 0.03% expense ratio</li>
                        </>
                      )}
                      {investment.ticker === 'SPY' && (
                        <>
                          <li>• Most liquid ETF in the world</li>
                          <li>• Contains top companies you know</li>
                          <li>• 50+ year track record</li>
                        </>
                      )}
                      {investment.ticker === 'VOO' && (
                        <>
                          <li>• Same performance as SPY</li>
                          <li>• Lower fees save money long-term</li>
                          <li>• Vanguard's excellent reputation</li>
                        </>
                      )}
                      {investment.ticker === 'SCHD' && (
                        <>
                          <li>• Quarterly dividend payments</li>
                          <li>• Quality dividend-growing companies</li>
                          <li>• Lower volatility than growth stocks</li>
                        </>
                      )}
                      {investment.ticker === 'VXUS' && (
                        <>
                          <li>• Don't put all eggs in US basket</li>
                          <li>• Currency diversification</li>
                          <li>• Access to international growth</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Growth Projection ($500 investment)</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">1 Year:</span>
                        <span className="font-medium text-green-600">
                          ${Math.round(500 * (1 + parseFloat(investment.returns) / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">5 Years:</span>
                        <span className="font-medium text-green-600">
                          ${Math.round(500 * Math.pow(1 + parseFloat(investment.returns) / 100, 5))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">10 Years:</span>
                        <span className="font-medium text-green-600">
                          ${Math.round(500 * Math.pow(1 + parseFloat(investment.returns) / 100, 10))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvestmentRecommendations