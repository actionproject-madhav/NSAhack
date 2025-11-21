import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Target, BookOpen, Check, Lock, ChevronRight, Clock, BarChart3 } from 'lucide-react'
import Layout from '../components/Layout'
import { allUnits, Unit, Lesson } from './Curriculumdata'
import LessonView from '../components/LessonView'
import QuizView from '../components/QuizView'

interface UserProgress {
  completedLessons: string[];
  currentStreak: number;
  totalXP: number;
  lastActivityDate: string;
}

const EducationHub: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [viewMode, setViewMode] = useState<'path' | 'lesson' | 'quiz'>('path')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Map<string, number>>(new Map())
  const [showQuizResult, setShowQuizResult] = useState(false)
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: ['lesson-1-1', 'lesson-1-2'],
    currentStreak: 7,
    totalXP: 450,
    lastActivityDate: new Date().toISOString()
  })

  const totalLessons = allUnits.reduce((sum, unit) => sum + unit.lessons.length, 0)
  const completedCount = userProgress.completedLessons.length
  const accuracy = completedCount > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const isLessonUnlocked = (lesson: Lesson): boolean => {
    if (lesson.prerequisites.length === 0) return true
    return lesson.prerequisites.every(prereq => 
      userProgress.completedLessons.includes(prereq)
    )
  }

  const unitsWithLockStatus = allUnits.map(unit => ({
    ...unit,
    lessons: unit.lessons.map(lesson => ({
      ...lesson,
      locked: !isLessonUnlocked(lesson),
      completed: userProgress.completedLessons.includes(lesson.id)
    }))
  }))

  const handleLessonClick = (lesson: Lesson) => {
    if (!isLessonUnlocked(lesson)) return
    setSelectedLesson(lesson)
    setViewMode('lesson')
  }

  const handleStartQuiz = () => {
    setViewMode('quiz')
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
    setShowQuizResult(false)
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    const newAnswers = new Map(quizAnswers)
    newAnswers.set(questionId, answerIndex)
    setQuizAnswers(newAnswers)
    setShowQuizResult(true)
  }

  const handleNextQuestion = () => {
    if (!selectedLesson) return
    
    const questions = selectedLesson.content.practiceQuestions
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowQuizResult(false)
      } else {
      completeLesson()
        }
      }

  const completeLesson = () => {
    if (!selectedLesson) return
    
    const questionsCorrect = selectedLesson.content.practiceQuestions.filter((q) => {
      const userAnswer = quizAnswers.get(q.id)
      return userAnswer === q.correctAnswer
    }).length

    const xpEarned = questionsCorrect * 10

    setUserProgress(prev => ({
                  ...prev,
      completedLessons: [...prev.completedLessons, selectedLesson.id],
      totalXP: prev.totalXP + xpEarned,
      lastActivityDate: new Date().toISOString()
    }))

    setViewMode('path')
    setSelectedLesson(null)
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
  }

  const handleBackToPath = () => {
    setViewMode('path')
    setSelectedLesson(null)
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
    setShowQuizResult(false)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
            {viewMode === 'path' && (
            <motion.div
                key="path"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                {/* Header */}
                <div className="mb-12">
                  <h1 className="text-4xl font-bold text-black dark:text-white mb-3">
                    Investment Education
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Master investing fundamentals step by step
                  </p>
                        </div>

                {/* Learning Path */}
                <div className="space-y-12">
                  {unitsWithLockStatus.map((unit) => (
                    <div key={unit.id}>
                      {/* Unit Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Unit {unit.orderIndex}
                          </div>
                          <h2 className="text-2xl font-bold text-black dark:text-white">
                            {unit.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {unit.description}
                          </p>
                </div>
              </div>

                      {/* Lessons */}
                      <div className="relative pl-8 space-y-6">
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:border-gray-800" />

                        {unit.lessons.map((lesson) => {
                          const isLocked = lesson.locked
                          const isCompleted = lesson.completed

                        return (
                            <div key={lesson.id} className="relative">
                              {/* Status Indicator */}
                              <div className="absolute -left-8 top-6">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-black ${
                                  isCompleted
                                    ? 'bg-black dark:bg-white'
                                    : isLocked
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'bg-black dark:bg-white'
                                }`}>
                                  {isCompleted ? (
                                    <Check className="w-5 h-5 text-white dark:text-black" />
                                  ) : isLocked ? (
                                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  ) : (
                                    <Target className="w-5 h-5 text-white dark:text-black" />
                                  )}
                            </div>
                              </div>

                              {/* Lesson Card */}
                              <div
                                onClick={() => !isLocked && handleLessonClick(lesson)}
                                className={`ml-4 p-6 rounded-lg border transition-all ${
                                  isCompleted
                                    ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 cursor-pointer hover:border-black dark:hover:border-white'
                                    : isLocked
                                    ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:border-black dark:hover:border-white hover:shadow-lg'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                      {lesson.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                      {lesson.description}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm">
                                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        {lesson.estimatedMinutes} min
                            </div>
                                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Trophy className="w-4 h-4" />
                                        {lesson.content.practiceQuestions.length * 10} XP
                    </div>
                  </div>
                </div>
                                  {!isLocked && (
                                    <ChevronRight className="w-6 h-6 text-gray-400 mt-1" />
                                  )}
                  </div>
                </div>
              </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
            )}

            {viewMode === 'lesson' && selectedLesson && (
              <LessonView
                lesson={selectedLesson}
                onBack={handleBackToPath}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {viewMode === 'quiz' && selectedLesson && (
              <QuizView
                lesson={selectedLesson}
                currentQuestionIndex={currentQuestionIndex}
                quizAnswers={quizAnswers}
                showResult={showQuizResult}
                onAnswerSelect={handleQuizAnswer}
                onNext={handleNextQuestion}
                onExit={handleBackToPath}
              />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default EducationHub
