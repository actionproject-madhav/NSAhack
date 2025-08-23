import { useState } from 'react'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { LIFESTYLE_BRANDS, INVESTMENT_GOALS, LANGUAGES, MOCK_PRICES, generatePortfolioReason } from '../utils/mockData'

const OnboardingFlow = () => {
  const [step, setStep] = useState(1)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const { setUser } = useUser()
  const navigate = useNavigate()

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    )
  }

  const generatePortfolio = () => {
    const portfolio = selectedBrands.map(brandName => {
      const brand = LIFESTYLE_BRANDS.find(b => b.name === brandName)!
      const currentPrice = MOCK_PRICES[brand.ticker]
      const quantity = Math.floor(1000 / currentPrice) // $1000 investment per stock
      
      return {
        ticker: brand.ticker,
        company: brand.name,
        quantity,
        avgPrice: currentPrice,
        currentPrice,
        reason: generatePortfolioReason(brand.name, selectedGoal),
        logo: brand.logo
      }
    })

    const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0)

    const user = {
      id: '1',
      email: 'student@example.com',
      goal: selectedGoal as any,
      language: selectedLanguage,
      lifestyle: selectedBrands,
      portfolio,
      totalValue
    }

    setUser(user)
    navigate('/dashboard')
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
    else generatePortfolio()
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedBrands.length >= 2
      case 2: return selectedGoal !== ''
      case 3: return selectedLanguage !== ''
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium text-sm">Step {step} of 3</span>
            <span className="text-gray-500 text-sm">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Lifestyle Brands */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Choose Your Brands</h2>
              <p className="text-gray-600">
                Select brands you use regularly. We'll help you invest in companies you know.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {LIFESTYLE_BRANDS.map((brand) => (
                <button
                  key={brand.name}
                  onClick={() => handleBrandToggle(brand.name)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedBrands.includes(brand.name)
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{brand.logo}</div>
                  <div className="font-medium text-sm text-gray-900">{brand.name}</div>
                  <div className="text-xs text-gray-500">{brand.ticker}</div>
                  {selectedBrands.includes(brand.name) && (
                    <Check className="w-4 h-4 text-blue-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              Select at least 2 brands to continue
            </div>
          </div>
        )}

        {/* Step 2: Investment Goal */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Investment Goal</h2>
              <p className="text-gray-600">
                Choose your primary investment objective.
              </p>
            </div>

            <div className="space-y-3">
              {INVESTMENT_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                    selectedGoal === goal.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{goal.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                      <p className="text-gray-600 text-sm">{goal.description}</p>
                    </div>
                    {selectedGoal === goal.id && (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Language */}
        {step === 3 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Select Language</h2>
              <p className="text-gray-600">
                Choose your preferred language for the platform.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="font-medium text-sm text-gray-900">{lang.name}</div>
                  {selectedLanguage === lang.code && (
                    <Check className="w-4 h-4 text-blue-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              step === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 3 ? 'Create Portfolio' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow