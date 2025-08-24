import React, { useState } from 'react'
import { Calculator, Globe, DollarSign, Info, Download } from 'lucide-react'

interface TaxTreaty {
  country: string
  treatyRate: number
  description: string
  requirements: string[]
  documents: string[]
}

const TAX_TREATIES: TaxTreaty[] = [
  {
    country: 'India',
    treatyRate: 15,
    description: 'Reduced withholding tax on dividends and interest',
    requirements: ['Form W-8BEN', 'Tax Identification Number', 'Residence Certificate'],
    documents: ['Passport', 'Visa', 'I-20 Form', 'Bank Statements']
  },
  {
    country: 'China',
    treatyRate: 10,
    description: 'Special rates for students and researchers',
    requirements: ['Form W-8BEN', 'Student Certificate', 'Residence Certificate'],
    documents: ['Passport', 'Visa', 'I-20 Form', 'University Letter']
  },
  {
    country: 'South Korea',
    treatyRate: 12,
    description: 'Reduced rates for educational purposes',
    requirements: ['Form W-8BEN', 'Student ID', 'Residence Certificate'],
    documents: ['Passport', 'Visa', 'I-20 Form', 'Student ID']
  },
  {
    country: 'Brazil',
    treatyRate: 15,
    description: 'Standard treaty rates apply',
    requirements: ['Form W-8BEN', 'CPF Number', 'Residence Certificate'],
    documents: ['Passport', 'Visa', 'I-20 Form', 'CPF Card']
  },
  {
    country: 'Mexico',
    treatyRate: 10,
    description: 'Favorable rates for students',
    requirements: ['Form W-8BEN', 'RFC Number', 'Residence Certificate'],
    documents: ['Passport', 'Visa', 'I-20 Form', 'RFC Number']
  }
]

const TaxTreatyCalculator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000)
  const [investmentType, setInvestmentType] = useState<'dividend' | 'interest' | 'capital_gains'>('dividend')
  const [showResults, setShowResults] = useState(false)

  const calculateTaxSavings = () => {
    if (!selectedCountry) return null
    
    const treaty = TAX_TREATIES.find(t => t.country === selectedCountry)
    if (!treaty) return null

    const standardRate = 30 // Standard US withholding rate
    const treatyRate = treaty.treatyRate
    
    const standardTax = (investmentAmount * standardRate) / 100
    const treatyTax = (investmentAmount * treatyRate) / 100
    const savings = standardTax - treatyTax

    return {
      standardTax,
      treatyTax,
      savings,
      treaty
    }
  }

  const handleCalculate = () => {
    if (selectedCountry) {
      setShowResults(true)
    }
  }

  const results = calculateTaxSavings()

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 font-['Host_Grotesk']">Tax Treaty Calculator</h3>
          <p className="text-slate-600 font-['Host_Grotesk']">Calculate potential tax savings for international students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 font-['Host_Grotesk']">Country of Residence</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 font-['Host_Grotesk'] bg-white"
          >
            <option value="">Select Country</option>
            {TAX_TREATIES.map((treaty) => (
              <option key={treaty.country} value={treaty.country}>
                {treaty.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 font-['Host_Grotesk']">Investment Amount ($)</label>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 font-['Host_Grotesk'] bg-white"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 font-['Host_Grotesk']">Investment Type</label>
          <select
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value as 'dividend' | 'interest' | 'capital_gains')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 font-['Host_Grotesk'] bg-white"
          >
            <option value="dividend">Dividends</option>
            <option value="interest">Interest</option>
            <option value="capital_gains">Capital Gains</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleCalculate}
          disabled={!selectedCountry}
          className="px-8 py-3 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 font-['Host_Grotesk']"
        >
          <Calculator className="w-4 h-4" />
          Calculate Tax Savings
        </button>
      </div>

      {/* Results */}
      {showResults && results && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
          <h4 className="font-medium text-slate-900 mb-6 text-lg flex items-center gap-2 font-['Host_Grotesk']">
            <Globe className="w-5 h-5 text-slate-600" />
            Tax Treaty Benefits for {selectedCountry}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800 font-['Host_Grotesk']">
                ${results.standardTax.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 font-['Host_Grotesk']">Standard US Tax</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-700 font-['Host_Grotesk']">
                ${results.treatyTax.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 font-['Host_Grotesk']">Treaty Rate Tax</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 font-['Host_Grotesk']">
                ${results.savings.toFixed(2)}
              </div>
              <div className="text-sm text-slate-600 font-['Host_Grotesk']">Your Savings</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h5 className="font-medium text-slate-900 mb-4 text-base font-['Host_Grotesk']">Requirements & Documents</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium text-slate-800 mb-3 text-sm font-['Host_Grotesk']">Required Forms:</h6>
                <ul className="space-y-2 text-sm text-slate-700">
                  {results.treaty.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-3 font-['Host_Grotesk']">
                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-slate-800 mb-3 text-sm font-['Host_Grotesk']">Supporting Documents:</h6>
                <ul className="space-y-2 text-sm text-slate-700">
                  {results.treaty.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-3 font-['Host_Grotesk']">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 font-['Host_Grotesk']">
                <strong>Important:</strong> Tax treaty benefits are not automatic. You must file Form W-8BEN with your broker and maintain proper documentation. Consult with a tax professional for your specific situation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="mt-8">
        <h4 className="font-medium text-slate-900 mb-4 text-base font-['Host_Grotesk']">Available Tax Treaties</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TAX_TREATIES.map((treaty) => (
            <div key={treaty.country} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900 font-['Host_Grotesk']">{treaty.country}</span>
                <span className="text-sm text-slate-600 font-medium font-['Host_Grotesk']">{treaty.treatyRate}%</span>
              </div>
              <p className="text-xs text-slate-600 font-['Host_Grotesk']">{treaty.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaxTreatyCalculator
