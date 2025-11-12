import Layout from '../components/Layout'

const AIHub = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            AI Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-powered investment insights and analysis
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-3">
            AI Features Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Real AI-powered market analysis and investment recommendations will be available here. No mock data.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AIHub
