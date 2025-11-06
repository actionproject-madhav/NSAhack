import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, AlertTriangle, TrendingUp, Calculator } from 'lucide-react'
import { Lesson, Section } from '../pages/curriculumData'

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onStartQuiz: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onStartQuiz }) => {
  const renderSection = (section: Section, index: number) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={index} className="mb-8">
            {section.title && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {section.title}
              </h2>
            )}
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              {section.content}
            </p>
            {section.details && section.details.length > 0 && (
              <ul className="space-y-2 ml-6">
                {section.details.map((detail, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-blue-500 mr-3 mt-1.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )

      case 'example':
        return (
          <div key={index} className="mb-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                {section.title && (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {section.title}
                  </h3>
                )}
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">
                  {section.content}
                </p>
                {section.details && section.details.length > 0 && (
                  <ul className="space-y-2">
                    {section.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-blue-500 mr-3 mt-1.5">→</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )

      case 'warning':
        return (
          <div key={index} className="mb-8 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                {section.title && (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {section.title}
                  </h3>
                )}
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">
                  {section.content}
                </p>
                {section.details && section.details.length > 0 && (
                  <ul className="space-y-2">
                    {section.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-orange-500 mr-3 mt-1.5">!</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )

      case 'calculation':
        return (
          <div key={index} className="mb-8 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                {section.title && (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {section.title}
                  </h3>
                )}
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 font-mono">
                  {section.content}
                </p>
                {section.details && section.details.length > 0 && (
                  <ul className="space-y-2">
                    {section.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 font-mono">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )

      case 'comparison':
        return (
          <div key={index} className="mb-8">
            {section.title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {section.title}
              </h3>
            )}
            {section.content && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {section.content}
              </p>
            )}
            {section.data && (
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(section.data).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 capitalize">
                      {key}
                    </h4>
                    {typeof value === 'object' ? (
                      <dl className="space-y-2">
                        {Object.entries(value).map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                              {k.replace(/([A-Z])/g, ' $1').trim()}:
                            </dt>
                            <dd className="text-gray-900 dark:text-gray-100">{String(v)}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Learning Path
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {lesson.description}
              </p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="prose prose-lg max-w-none">
            {lesson.content.sections.map((section, index) => renderSection(section, index))}
          </div>

          {/* Key Takeaways */}
          {lesson.content.keyTakeaways && lesson.content.keyTakeaways.length > 0 && (
            <div className="mt-12 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {lesson.content.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-3 mt-1 font-bold">✓</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Questions CTA */}
          {lesson.content.practiceQuestions && lesson.content.practiceQuestions.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Ready to test your knowledge?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete {lesson.content.practiceQuestions.length} questions to earn XP
                  </p>
                </div>
                <button
                  onClick={onStartQuiz}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  Start Practice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LessonView