import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import OnboardingFlow from './pages/OnboardingFlow'
import Dashboard from './pages/Dashboard'
import TradePage from './pages/TradePage'
import EducationHub from './pages/EducationHub'
import PortfolioPage from './pages/PortfolioPage'
import WalletPage from './pages/WalletPage'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/trade" element={<TradePage />} />
              <Route path="/learn" element={<EducationHub />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App