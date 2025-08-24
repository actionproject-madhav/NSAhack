import React, { useState } from 'react'
import { CheckCircle, AlertCircle, Globe, Calculator } from 'lucide-react'

interface CountryTaxInfo {
  country: string
  flag: string
  capitalGainsTax: number
  hasTreaty: boolean
  treatyRate: number
  restrictions: string[]
}

const TAX_TREATIES: CountryTaxInfo[] = [
  {
    country: 'India',
    flag: '🇮🇳',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 15,
    restrictions: ['File Form W-8BEN for treaty benefits', 'Must file Form 1040-NR annually', 'Avoid systematic trading patterns']
  },
  {
    country: 'China',
    flag: '🇨🇳',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 10,
    restrictions: ['Excellent treaty rate (10%)', 'Report to Chinese tax authority', 'Passive investing recommended']
  },
  {
    country: 'South Korea',
    flag: '🇰🇷',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 15,
    restrictions: ['File Form W-8BEN with broker', 'FBAR filing if accounts >$10k', 'Long-term holding preferred']
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 0,
    restrictions: ['Best treaty benefits (0% rate)', 'Still file Form 1040-NR', 'Report to CRA in Canada']
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 5,
    restrictions: ['Very low treaty rate (5%)', 'File Form W-8BEN', 'Report to German tax authority']
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 15,
    restrictions: ['File Form W-8BEN for benefits', 'Report to Japanese tax authority', 'Avoid frequent trading']
  },
  {
    country: 'Brazil',
    flag: '🇧🇷',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 15,
    restrictions: ['Treaty benefits available', 'Complex reporting requirements', 'Consult tax professional']
  },
  {
    country: 'Mexico',
    flag: '🇲🇽',
    capitalGainsTax: 30,
    hasTreaty: true,
    treatyRate: 10,
    restrictions: ['Good treaty rate (10%)', 'File Form W-8BEN', 'Report to SAT in Mexico']
  }
]

const VisaStatusChecker: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [visaType, setVisaType] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const handleCheck = () => {
    if (selectedCountry && visaType) {
      setShowResults(true)
    }
  }

  const selectedCountryInfo = TAX_TREATIES.find(c => c.country === selectedCountry)
  const savings = selectedCountryInfo ? selectedCountryInfo.capitalGainsTax - selectedCountryInfo.treatyRate : 0

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Benefits Calculator</h3>
        <p className="text-sm text-gray-600">Check your tax benefits and trading restrictions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Home Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your country</option>
            {TAX_TREATIES.map((country) => (
              <option key={country.country} value={country.country}>
                {country.flag} {country.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visa Status
          </label>
          <select
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your visa type</option>
            <option value="F-1">F-1 (Student Visa)</option>
            <option value="J-1">J-1 (Exchange Visitor)</option>
            <option value="H-1B">H-1B (Work Visa)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          onClick={handleCheck}
          disabled={!selectedCountry || !visaType}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Check My Status
        </button>
      </div>

      {showResults && selectedCountryInfo && (
        <div className="mt-6 space-y-4">
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Your Tax Benefits & Restrictions</h4>
            
            {/* Tax Savings */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Tax Treaty Benefits</span>
              </div>
              <p className="text-green-700 text-sm mb-2">
                Your capital gains tax rate: <strong>{selectedCountryInfo.treatyRate}%</strong> (instead of 30%)
              </p>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  You save <strong>{savings}%</strong> on capital gains taxes!
                </span>
              </div>
            </div>

            {/* Restrictions */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Important Restrictions</span>
              </div>
              <ul className="space-y-1">
                {selectedCountryInfo.restrictions.map((restriction, index) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    {restriction}
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Requirements */}
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-red-900 mb-3">Critical Requirements for {visaType} Students</h5>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  File Form 1040-NR (Non-Resident Alien tax return) annually
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Submit Form W-8BEN to broker to claim treaty benefits
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Avoid systematic trading patterns (risk of unauthorized employment)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Need SSN (with work authorization) or ITIN to open brokerage account
                </li>
              </ul>
            </div>

            {/* Safe Practices */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Safe Investment Practices</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Focus on buy-and-hold strategy (passive investing is safer)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Avoid day trading (4+ trades in 5 days triggers PDT rules)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Keep detailed records for tax reporting and visa compliance
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Consult immigration attorney AND tax professional
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisaStatusChecker