import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, AlertTriangle, CheckCircle, X, Info, 
  Clock, DollarSign, TrendingUp, FileText
} from 'lucide-react'

interface ComplianceCheck {
  category: string;
  item: string;
  status: 'compliant' | 'warning' | 'violation';
  description: string;
  action?: string;
}

interface VisaComplianceCheckerProps {
  visaType: 'F1' | 'OPT' | 'H1B' | 'L1';
  isOpen: boolean;
  onClose: () => void;
}

const VisaComplianceChecker: React.FC<VisaComplianceCheckerProps> = ({
  visaType,
  isOpen,
  onClose
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'investments' | 'taxes'>('overview')

  const getComplianceChecks = (): ComplianceCheck[] => {
    const baseChecks: ComplianceCheck[] = [
      {
        category: 'Trading Activity',
        item: 'Long-term stock investing',
        status: 'compliant',
        description: 'Buy and hold investing in stocks/ETFs is generally permitted'
      },
      {
        category: 'Trading Activity',
        item: 'Day trading pattern',
        status: visaType === 'F1' ? 'violation' : 'warning',
        description: 'Pattern day trading (4+ trades in 5 days) may be considered unauthorized employment',
        action: 'Limit to 3 or fewer trades per 5-day period'
      },
      {
        category: 'Investment Types',
        item: 'ETF/Index funds',
        status: 'compliant',
        description: 'Passive index investing is safe and recommended'
      },
      {
        category: 'Investment Types',
        item: 'Options trading',
        status: 'warning',
        description: 'Complex derivatives require careful documentation and understanding',
        action: 'Ensure you understand tax implications and keep detailed records'
      },
      {
        category: 'Income Reporting',
        item: 'Investment gains reporting',
        status: 'compliant',
        description: 'All capital gains and dividends must be reported on tax returns'
      },
      {
        category: 'Retirement Accounts',
        item: visaType === 'F1' ? 'IRA contributions' : '401k participation',
        status: visaType === 'F1' ? 'warning' : 'compliant',
        description: visaType === 'F1' 
          ? 'Only allowed if you have earned income from authorized employment'
          : 'Full access to employer retirement benefits'
      }
    ]

    if (visaType === 'F1') {
      baseChecks.push({
        category: 'Employment',
        item: 'Trading as primary income',
        status: 'violation',
        description: 'Cannot engage in trading as your primary source of income',
        action: 'Maintain student status as primary purpose in US'
      })
    }

    return baseChecks
  }

  const complianceChecks = getComplianceChecks()
  const compliantCount = complianceChecks.filter(c => c.status === 'compliant').length
  const warningCount = complianceChecks.filter(c => c.status === 'warning').length
  const violationCount = complianceChecks.filter(c => c.status === 'violation').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'violation': return <X className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'border-l-green-500 bg-green-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'violation': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Investment Compliance Assessment</h2>
                <p className="text-blue-100">Investment compliance analysis for {visaType} visa holders</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Compliance Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Compliant</span>
              </div>
              <div className="text-2xl font-bold">{compliantCount}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Warnings</span>
              </div>
              <div className="text-2xl font-bold">{warningCount}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <X className="w-5 h-5" />
                <span className="font-medium">Violations</span>
              </div>
              <div className="text-2xl font-bold">{violationCount}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { key: 'overview', label: 'Overview', icon: Shield },
              { key: 'investments', label: 'Investment Rules', icon: TrendingUp },
              { key: 'taxes', label: 'Tax Obligations', icon: FileText }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">{visaType} Visa Investment Guidelines</h3>
                <p className="text-blue-800 text-sm">
                  {visaType === 'F1' && 'As an F-1 student, your primary purpose in the US is education. Investment activities should be passive and secondary to your studies. Focus on long-term wealth building through diversified ETFs and individual stocks.'}
                  {visaType === 'OPT' && 'During OPT, you have more flexibility for investment activities, but day trading restrictions still apply. This is an excellent time to establish long-term investment habits and maximize employer benefits.'}
                  {visaType === 'H1B' && 'H1-B visa holders have fewer investment restrictions and can engage in more active strategies. You have full access to employer benefits including 401(k) plans and can build substantial wealth through disciplined investing.'}
                  {visaType === 'L1' && 'L-1 visa holders can generally invest freely and should focus on maximizing tax treaty benefits. Consider both US investments and maintaining diversification with international exposure.'}
                </p>
              </div>

              {complianceChecks.map((check, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-l-4 ${getStatusColor(check.status)} p-4 rounded-r-xl`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{check.item}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {check.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{check.description}</p>
                      {check.action && (
                        <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs">
                          <strong>Action Required:</strong> {check.action}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'investments' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recommended Investments
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Broad market ETFs (VTI, VOO, SPY)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Individual blue-chip stocks
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Target-date funds
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Bond funds for stability
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    High-Risk Activities
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Pattern day trading
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Forex trading for profit
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Complex derivatives
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Cryptocurrency trading
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Investment Limits by Visa Type</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Activity</th>
                        <th className="text-center p-2">F-1</th>
                        <th className="text-center p-2">OPT</th>
                        <th className="text-center p-2">H1-B</th>
                        <th className="text-center p-2">L-1</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Long-term investing</td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Day trading</td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">401(k) participation</td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                      </tr>
                      <tr>
                        <td className="p-2">Options trading</td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                        <td className="text-center p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <p> Generally allowed | ⚠️ Proceed with caution |  Not recommended</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'taxes' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Tax Filing Requirements</h3>
                <p className="text-yellow-800 text-sm">
                  All investment income must be reported on your US tax return, regardless of the amount.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Required Tax Forms</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Form 1040NR (Non-resident)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Schedule B (Interest/Dividends)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Form 8938 (FATCA if required)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Tax Rates</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Dividends:</span>
                      <span className="font-medium">30% (or treaty rate)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Capital Gains:</span>
                      <span className="font-medium">0-20% (residency dependent)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Interest:</span>
                      <span className="font-medium">30% (or treaty rate)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Tax Treaty Benefits</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Many countries have tax treaties with the US that can reduce your tax burden:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Common Treaty Benefits:</h5>
                    <ul className="space-y-1">
                      <li>• Reduced dividend withholding (15% vs 30%)</li>
                      <li>• Interest income exemptions</li>
                      <li>• Capital gains exemptions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">To Claim Benefits:</h5>
                    <ul className="space-y-1">
                      <li>• File Form W-8BEN with brokers</li>
                      <li>• Claim treaty benefits on tax return</li>
                      <li>• Keep documentation of tax residency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              ⚠️ This tool provides general guidance only. Consult with a tax professional or immigration attorney for specific advice.
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Find Tax Professional
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VisaComplianceChecker