import { motion } from 'framer-motion'
import { X, Check, Trophy, ArrowRight } from 'lucide-react'
import { Lesson } from '../pages/curriculumData'

interface QuizViewProps {
  lesson: Lesson;
  currentQuestionIndex: number;
  quizAnswers: Map<string, number>;
  showResult: boolean;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
  onNext: () => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({
  lesson,
  currentQuestionIndex,
  quizAnswers,
  showResult,
  onAnswerSelect,
  onNext,
  onExit
}) => {
  const questions = lesson.content.practiceQuestions
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const selectedAnswer = quizAnswers.get(currentQuestion.id)
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  // Calculate total score
  const correctAnswers = Array.from(quizAnswers.entries()).filter(([qId, answer]) => {
    const q = questions.find(qu => qu.id === qId)
    return q && answer === q.correctAnswer
  }).length

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X className="w-5 h-5" />
            Exit
          </button>

          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
        {/* Question */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full mb-4">
            {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' :
             currentQuestion.type === 'true-false' ? 'True or False' :
             currentQuestion.type === 'calculation' ? 'Calculation' :
             'Scenario'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === currentQuestion.correctAnswer
            const showCorrect = showResult && isCorrectAnswer
            const showIncorrect = showResult && isSelected && !isCorrectAnswer

            return (
              <button
                key={index}
                onClick={() => !showResult && onAnswerSelect(currentQuestion.id, index)}
                disabled={showResult}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  showCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                    : showIncorrect
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : isSelected && !showResult
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${showResult && !isCorrectAnswer && !isSelected ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-900 dark:text-gray-100 pr-4">
                    {option}
                  </span>
                  {showResult && (
                    <div className="flex-shrink-0">
                      {isCorrectAnswer ? (
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border-2 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">i</span>
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">+10 XP</span>
            </div>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Score Display (only show after answering) */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full">
            <span className="text-gray-600 dark:text-gray-400">Current Score:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {correctAnswers} / {currentQuestionIndex + 1}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default QuizView