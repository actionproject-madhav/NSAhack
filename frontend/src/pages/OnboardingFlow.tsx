import { useState } from 'react'
import { ArrowRight, Wallet, TrendingUp, GraduationCap, Zap, Globe, Microscope, Briefcase, Flag, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { LIFESTYLE_BRANDS, INVESTMENT_GOALS, LANGUAGES } from '../utils/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import elephantAnimation from '../assets/animations/elephant.json'
import apiService from '../services/apiService'

// Duolingo & Brilliant.org Color Scheme
const DUOLINGO_COLORS = {
  green: '#58CC02',
  darkGreen: '#58A700',
  lightGreen: '#89E219',
  gold: '#FFC800',
  blue: '#1CB0F6',
  purple: '#CE82FF',
  red: '#FF4B4B',
  orange: '#FF9600',
  background: '#131F24',
  cardBg: '#37464F',
  textPrimary: '#F7F7F7',
  textSecondary: '#AFAFAF',
  border: '#2E3C44'
}

const OnboardingFlow = () => {
  const [step, setStep] = useState(1)
  const [userName, setUserName] = useState('')
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

  const completeOnboarding = async () => {
    console.log('🔄 Saving onboarding data...')
    
    const storedUser = localStorage.getItem('user')
    const googleUser = storedUser ? JSON.parse(storedUser) : null

    const user = {
      id: googleUser?.id || '1',
      name: userName || googleUser?.name || 'Student',
      email: googleUser?.email || 'student@example.com',
      picture: googleUser?.picture,
      goal: selectedGoal as any,
      language: selectedLanguage,
      lifestyle: selectedBrands,
      visaStatus,
      homeCountry,
      portfolio: [],
      totalValue: 0,
      onboarding_completed: true
    }

    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)

    const userId = user.email || user.id
    if (userId) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
        
        const savePromise = apiService.updateOnboarding(userId, {
          lifestyle_brands: selectedBrands,
          investment_goal: selectedGoal,
          language: selectedLanguage,
          visa_status: visaStatus,
          home_country: homeCountry,
        })
        
        await Promise.race([savePromise, timeoutPromise])
        console.log('✅ Onboarding data saved to database')
      } catch (error: any) {
        console.warn('⚠️ Backend save failed (non-critical):', error.message || error)
      }
    }

    navigate('/dashboard')
  }

  const nextStep = () => {
    if (step < 6) setStep(step + 1)
    else completeOnboarding()
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return userName.trim() !== '';
      case 2: return selectedBrands.length >= 2;
      case 3: return selectedGoal !== '';
      case 4: return selectedLanguage !== '';
      case 5: return visaStatus !== '';
      case 6: return homeCountry !== '';
      default: return false;
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "What's your name?";
      case 2: return 'Choose your brands';
      case 3: return 'Investment goals';
      case 4: return 'Select language';
      case 5: return 'Visa status';
      case 6: return 'Home country';
      default: return 'Getting started';
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Let's personalize your experience";
      case 2: return 'Select brands you use regularly';
      case 3: return 'Choose your primary investment objective';
      case 4: return 'Select your preferred language';
      case 5: return 'Help us provide visa-compliant guidance';
      case 6: return "We'll calculate your tax treaty benefits";
      default: return 'Let\'s personalize your investment journey';
    }
  }

  const totalSteps = 6

  return (
    <div className="min-h-screen" style={{ background: DUOLINGO_COLORS.background }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(88, 204, 2, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
              style={{ background: DUOLINGO_COLORS.green, color: '#131F24' }}
            >
              F
            </div>
            <span className="text-2xl font-bold" style={{ color: DUOLINGO_COLORS.textPrimary }}>
              FinLit
            </span>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
          style={{
            background: DUOLINGO_COLORS.cardBg,
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: `2px solid ${DUOLINGO_COLORS.border}`
          }}
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: DUOLINGO_COLORS.textSecondary }}>
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-semibold" style={{ color: DUOLINGO_COLORS.textSecondary }}>
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ background: DUOLINGO_COLORS.border }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `linear-gradient(90deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.lightGreen} 100%)`,
                  height: '100%',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Title & Description */}
              <div className="text-center mb-8">
                <h2 
                  className="text-3xl font-bold mb-3"
                  style={{ color: DUOLINGO_COLORS.textPrimary }}
                >
                  {getStepTitle()}
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: DUOLINGO_COLORS.textSecondary }}
                >
                  {getStepDescription()}
                </p>
              </div>

              {/* Elephant Mascot */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32"
                >
                  <Lottie 
                    animationData={elephantAnimation}
                    loop={true}
                    className="w-full h-full"
                  />
                </motion.div>
              </div>

              {/* Step 1: Name Input */}
              {step === 1 && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                    className="w-full px-6 py-4 text-lg rounded-xl border-2 transition-all focus:outline-none"
                    style={{
                      background: DUOLINGO_COLORS.border,
                      borderColor: userName.trim() ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border,
                      color: DUOLINGO_COLORS.textPrimary
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${DUOLINGO_COLORS.green}40`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your name"
                    autoFocus
                  />
                </div>
              )}

              {/* Step 2: Lifestyle Brands */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {LIFESTYLE_BRANDS.slice(0, 9).map((brand) => {
                      const isSelected = selectedBrands.includes(brand.name)
                      return (
                        <motion.button
                          key={brand.name}
                          onClick={() => handleBrandToggle(brand.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative overflow-hidden"
                          style={{
                            background: isSelected 
                              ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                              : DUOLINGO_COLORS.border,
                            borderColor: isSelected ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border,
                            color: isSelected ? '#131F24' : DUOLINGO_COLORS.textPrimary
                          }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <Check className="w-5 h-5" style={{ color: '#131F24' }} />
                            </motion.div>
                          )}
                          <div className="text-2xl mb-1">{brand.name.charAt(0)}</div>
                          <div className="text-xs font-semibold text-center px-2">{brand.name}</div>
                        </motion.button>
                      )
                    })}
                  </div>
                  <p className="text-center text-sm" style={{ color: DUOLINGO_COLORS.textSecondary }}>
                    Select at least 2 brands to continue
                  </p>
                </div>
              )}

              {/* Step 3: Investment Goal */}
              {step === 3 && (
                <div className="space-y-3">
                  {INVESTMENT_GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id
                    const IconComponent = 
                      goal.id === 'save' ? Wallet :
                      goal.id === 'grow' ? TrendingUp :
                      goal.id === 'learn' ? GraduationCap : Zap
                    
                    return (
                      <motion.button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                            : DUOLINGO_COLORS.border,
                          borderColor: isSelected ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="p-3 rounded-lg"
                            style={{
                              background: isSelected ? 'rgba(19, 31, 36, 0.2)' : DUOLINGO_COLORS.background
                            }}
                          >
                            <IconComponent 
                              className="w-6 h-6"
                              style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.green }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-lg mb-1"
                              style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.textPrimary }}
                            >
                              {goal.title}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ color: isSelected ? 'rgba(19, 31, 36, 0.8)' : DUOLINGO_COLORS.textSecondary }}
                            >
                              {goal.description}
                            </p>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-6 h-6" style={{ color: '#131F24' }} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Step 4: Language */}
              {step === 4 && (
                <div className="grid grid-cols-2 gap-4">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code
                    return (
                      <motion.button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                            : DUOLINGO_COLORS.border,
                          borderColor: isSelected ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Check className="w-5 h-5" style={{ color: '#131F24' }} />
                          </motion.div>
                        )}
                        <Globe 
                          className="w-6 h-6 mb-2"
                          style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.green }}
                        />
                        <div 
                          className="font-semibold text-sm"
                          style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.textPrimary }}
                        >
                          {lang.name}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Step 5: Visa Status */}
              {step === 5 && (
                <div className="space-y-3">
                  {[
                    { id: 'F-1', title: 'F-1 Student Visa', description: 'Academic studies in the US', icon: GraduationCap },
                    { id: 'J-1', title: 'J-1 Exchange Visitor', description: 'Exchange programs and research', icon: Microscope },
                    { id: 'H-1B', title: 'H-1B Work Visa', description: 'Specialty occupation worker', icon: Briefcase },
                    { id: 'Other', title: 'Other/US Citizen', description: 'Other visa status or US citizen', icon: Flag }
                  ].map((visa) => {
                    const isSelected = visaStatus === visa.id
                    const IconComponent = visa.icon
                    return (
                      <motion.button
                        key={visa.id}
                        onClick={() => setVisaStatus(visa.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-5 rounded-xl border-2 text-left transition-all relative"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                            : DUOLINGO_COLORS.border,
                          borderColor: isSelected ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="p-3 rounded-lg"
                            style={{
                              background: isSelected ? 'rgba(19, 31, 36, 0.2)' : DUOLINGO_COLORS.background
                            }}
                          >
                            <IconComponent 
                              className="w-6 h-6"
                              style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.green }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-lg mb-1"
                              style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.textPrimary }}
                            >
                              {visa.title}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ color: isSelected ? 'rgba(19, 31, 36, 0.8)' : DUOLINGO_COLORS.textSecondary }}
                            >
                              {visa.description}
                            </p>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-6 h-6" style={{ color: '#131F24' }} />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Step 6: Home Country */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { code: 'IN', name: 'India', treaty: '15% tax rate' },
                      { code: 'CN', name: 'China', treaty: '10% tax rate' },
                      { code: 'KR', name: 'South Korea', treaty: '15% tax rate' },
                      { code: 'CA', name: 'Canada', treaty: '0% tax rate' },
                      { code: 'DE', name: 'Germany', treaty: '5% tax rate' },
                      { code: 'JP', name: 'Japan', treaty: '15% tax rate' },
                      { code: 'BR', name: 'Brazil', treaty: '15% tax rate' },
                      { code: 'MX', name: 'Mexico', treaty: '10% tax rate' },
                      { code: 'NP', name: 'Nepal', treaty: '30% tax rate' }
                    ].map((country) => {
                      const isSelected = homeCountry === country.code
                      return (
                        <motion.button
                          key={country.code}
                          onClick={() => setHomeCountry(country.code)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-4 rounded-xl border-2 transition-all relative"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                              : DUOLINGO_COLORS.border,
                            borderColor: isSelected ? DUOLINGO_COLORS.green : DUOLINGO_COLORS.border
                          }}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <Check className="w-5 h-5" style={{ color: '#131F24' }} />
                            </motion.div>
                          )}
                          <div className="text-center">
                            <img 
                              src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                              alt={country.name}
                              className="w-10 h-7 mx-auto mb-2 object-cover rounded border"
                              style={{ borderColor: DUOLINGO_COLORS.border }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <div 
                              className="font-semibold text-sm mb-1"
                              style={{ color: isSelected ? '#131F24' : DUOLINGO_COLORS.textPrimary }}
                            >
                              {country.name}
                            </div>
                            <div 
                              className="text-xs"
                              style={{ color: isSelected ? 'rgba(19, 31, 36, 0.8)' : DUOLINGO_COLORS.textSecondary }}
                            >
                              {country.treaty}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  <p className="text-center text-sm" style={{ color: DUOLINGO_COLORS.textSecondary }}>
                    Don't see your country? We'll help you find the right tax information.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: `1px solid ${DUOLINGO_COLORS.border}` }}>
            <motion.button
              onClick={prevStep}
              disabled={step === 1}
              whileHover={step > 1 ? { scale: 1.05 } : {}}
              whileTap={step > 1 ? { scale: 0.95 } : {}}
              className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                color: step === 1 ? DUOLINGO_COLORS.textSecondary : DUOLINGO_COLORS.textPrimary,
                background: step === 1 ? 'transparent' : DUOLINGO_COLORS.border
              }}
            >
              Back
            </motion.button>

            <motion.button
              onClick={nextStep}
              disabled={!canProceed()}
              whileHover={canProceed() ? { scale: 1.05 } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: canProceed()
                  ? `linear-gradient(135deg, ${DUOLINGO_COLORS.green} 0%, ${DUOLINGO_COLORS.darkGreen} 100%)`
                  : DUOLINGO_COLORS.border,
                color: canProceed() ? '#131F24' : DUOLINGO_COLORS.textSecondary,
                boxShadow: canProceed() ? `0 4px 12px ${DUOLINGO_COLORS.green}40` : 'none'
              }}
            >
              {step === 6 ? 'Get Started' : 'Continue'}
              {step < 6 && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OnboardingFlow
