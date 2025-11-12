import { motion } from 'framer-motion'
import { X, Check, Trophy, ArrowRight } from 'lucide-react'
import { Lesson } from '../pages/Curriculumdata'

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
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
            className="h-full bg-black dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
        {/* Question */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full mb-4">
            {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' :
             currentQuestion.type === 'true-false' ? 'True or False' :
             currentQuestion.type === 'calculation' ? 'Calculation' :
             'Scenario'}
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
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
                className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                    : showIncorrect
                    ? 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-50'
                    : isSelected && !showResult
                    ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${showResult && !isCorrectAnswer && !isSelected ? 'opacity-30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-black dark:text-white pr-4">
                    {option}
                  </span>
                  {showResult && (
                    <div className="flex-shrink-0">
                      {isCorrectAnswer ? (
                        <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
                          <Check className="w-5 h-5 text-white dark:text-black" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
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
            className="p-6 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-black dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'}`}>
                {isCorrect ? (
                  <Check className="w-5 h-5 text-white dark:text-black" />
                ) : (
                  <span className="text-white font-bold">!</span>
                )}
              </div>
              <div>
                <p className="font-bold text-black dark:text-white mb-2">
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
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Score Display */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full">
            <span className="text-gray-600 dark:text-gray-400">Current Score:</span>
            <span className="font-bold text-black dark:text-white">
              {correctAnswers} / {currentQuestionIndex + 1}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default QuizView
