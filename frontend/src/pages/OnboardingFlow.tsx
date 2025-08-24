import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { LIFESTYLE_BRANDS, INVESTMENT_GOALS, LANGUAGES, MOCK_PRICES, generatePortfolioReason } from '../utils/mockData'
import Logo from '../components/Logo'

const OnboardingFlow = () => {
  const [step, setStep] = useState(1)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [visaStatus, setVisaStatus] = useState('')
  const [homeCountry, setHomeCountry] = useState('')
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
        logo: brand.logo // Keep fallback emoji for now, components will use Logo component
      }
    })

    const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0)

    const user = {
      id: '1',
      email: 'student@example.com',
      goal: selectedGoal as any,
      language: selectedLanguage,
      lifestyle: selectedBrands,
      visaStatus,
      homeCountry,
      portfolio,
      totalValue
    }

    setUser(user)
    navigate('/dashboard')
  }

  const nextStep = () => {
    if (step < 5) setStep(step + 1)
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
      case 4: return visaStatus !== ''
      case 5: return homeCountry !== ''
      default: return false
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Choose Your Brands'
      case 2: return 'Investment Goals'
      case 3: return 'Select Language'
      case 4: return 'Visa Status'
      case 5: return 'Home Country'
      default: return 'Getting Started'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Select brands you use regularly. We\'ll help you invest in companies you know.'
      case 2: return 'Choose your primary investment objective to personalize your experience.'
      case 3: return 'Select your preferred language for the platform interface.'
      case 4: return 'Help us provide visa-compliant trading guidance and alerts.'
      case 5: return 'We\'ll calculate your tax treaty benefits and provide country-specific guidance.'
      default: return 'Let\'s personalize your investment journey.'
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image with Content */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/onboarding.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gray-900/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-white font-semibold text-xl">FinLit</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="text-sm text-white/80 uppercase tracking-wide">
              GET STARTED
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Welcome!
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Your gateway to smarter, faster, and more profitable investment decisions.
            </p>
          </div>

          {/* Testimonial */}
          <div className="space-y-4">
            <blockquote className="text-white/90 italic leading-relaxed">
              "Investing in what you know and use daily is the foundation of smart wealth building. FinLit makes it simple to turn your lifestyle choices into investment opportunities."
            </blockquote>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">W</span>
              </div>
              <div>
                <div className="font-semibold text-white">Warren Buffett</div>
                <div className="text-sm text-white/70">Investment Philosophy</div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex space-x-6 text-sm text-white/60">
            <a href="#" className="hover:text-white/80 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/80 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-600' : i < step ? 'bg-blue-300' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
            <p className="text-gray-600 text-sm">{getStepDescription()}</p>
          </div>

          {/* Step 1: Lifestyle Brands */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {LIFESTYLE_BRANDS.slice(0, 9).map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => handleBrandToggle(brand.name)}
                    className={`h-20 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${selectedBrands.includes(brand.name)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                  >
                    <div className="mb-1">
                      <Logo
                        company={brand.name}
                        fallback={brand.logo}
                        size={24}
                      />
                    </div>
                    <div className={`font-medium text-xs ${selectedBrands.includes(brand.name) ? 'text-white' : 'text-gray-900'
                      }`}>
                      {brand.name}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                Select at least 2 brands to continue
              </p>
            </div>
          )}

          {/* Step 2: Investment Goal */}
          {step === 2 && (
            <div className="space-y-3">
              {INVESTMENT_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${selectedGoal === goal.id
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{goal.emoji}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${selectedGoal === goal.id ? 'text-white' : 'text-gray-900'
                        }`}>
                        {goal.title}
                      </h3>
                      <p className={`text-sm ${selectedGoal === goal.id ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Language */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`h-20 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <div className="text-xl mb-1">{lang.flag}</div>
                  <div className={`font-medium text-sm ${selectedLanguage === lang.code ? 'text-white' : 'text-gray-900'
                    }`}>
                    {lang.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Visa Status */}
          {step === 4 && (
            <div className="space-y-3">
              {[
                { id: 'F-1', title: 'F-1 Student Visa', description: 'Academic studies in the US', emoji: '🎓' },
                { id: 'J-1', title: 'J-1 Exchange Visitor', description: 'Exchange programs and research', emoji: '🔬' },
                { id: 'H-1B', title: 'H-1B Work Visa', description: 'Specialty occupation worker', emoji: '💼' },
                { id: 'Other', title: 'Other/US Citizen', description: 'Other visa status or US citizen', emoji: '🇺🇸' }
              ].map((visa) => (
                <button
                  key={visa.id}
                  onClick={() => setVisaStatus(visa.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${visaStatus === visa.id
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{visa.emoji}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${visaStatus === visa.id ? 'text-white' : 'text-gray-900'
                        }`}>
                        {visa.title}
                      </h3>
                      <p className={`text-sm ${visaStatus === visa.id ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                        {visa.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Home Country */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'IN', name: 'India', flag: '🇮🇳', treaty: '15% tax rate' },
                  { code: 'CN', name: 'China', flag: '🇨🇳', treaty: '10% tax rate' },
                  { code: 'KR', name: 'South Korea', flag: '🇰🇷', treaty: '15% tax rate' },
                  { code: 'CA', name: 'Canada', flag: '🇨🇦', treaty: '0% tax rate' },
                  { code: 'DE', name: 'Germany', flag: '🇩🇪', treaty: '5% tax rate' },
                  { code: 'JP', name: 'Japan', flag: '🇯🇵', treaty: '15% tax rate' },
                  { code: 'BR', name: 'Brazil', flag: '🇧🇷', treaty: '15% tax rate' },
                  { code: 'MX', name: 'Mexico', flag: '🇲🇽', treaty: '10% tax rate' }
                ].map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setHomeCountry(country.code)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${homeCountry === country.code
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{country.flag}</div>
                      <div className={`font-medium text-sm mb-1 ${homeCountry === country.code ? 'text-white' : 'text-gray-900'
                        }`}>
                        {country.name}
                      </div>
                      <div className={`text-xs ${homeCountry === country.code ? 'text-blue-100' : 'text-green-600'
                        }`}>
                        {country.treaty}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                Don't see your country? We'll help you find the right tax information.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${canProceed()
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {step === 5 ? 'Create Portfolio' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow