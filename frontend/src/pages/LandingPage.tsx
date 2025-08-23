import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: 'url(/landingPage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Floating Navigation */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
        <nav className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="text-white font-medium">FinLit</span>
          </div>

          <div className="flex items-center space-x-6 text-white/80 text-sm">
            <a href="#" className="hover:text-white transition-colors">Product</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Customers</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Partners</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Sign In
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-8 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-white/80 text-sm mb-8 tracking-wide font-medium">
            Meet our esteemed Partners & Affiliates
          </p>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            FinLit,
            <br />
            <span className="text-white/95">Investing Made Easy for Internationals</span>
          </h1>

          <button
            onClick={() => navigate('/auth')}
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Try for Free
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 relative">
          <img
            src="/dashboard.png"
            alt="Dashboard Preview"
            className="max-w-6xl w-full h-auto rounded-2xl shadow-2xl"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage