import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Investing Made
              <span className="text-blue-600"> Simple</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Build wealth by investing in companies you already know and use. Start with as little as $10.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-gray-600 border border-gray-300 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default LandingPage