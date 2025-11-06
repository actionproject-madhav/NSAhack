import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trophy, Flame, Target, TrendingUp, BookOpen, Award, Check, Lock, ChevronRight, Clock, BarChart3 } from 'lucide-react'
import Navigation from '../components/Navigation'
import EnhancedChatWidget from '../components/ChatWidget'
import { allUnits, Unit, Lesson, Question } from './curriculumData'
import LessonView from '../components/LessonView'
import QuizView from '../components/QuizView'

interface UserProgress {
  completedLessons: string[];
  currentStreak: number;
  totalXP: number;
  lastActivityDate: string;
}

const EducationHub: React.FC = () => {
  // State management
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [viewMode, setViewMode] = useState<'path' | 'lesson' | 'quiz'>('path')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Map<string, number>>(new Map())
  const [showQuizResult, setShowQuizResult] = useState(false)
  
  // User progress state
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: ['lesson-1-1', 'lesson-1-2'], // Demo: pre-completed lessons
    currentStreak: 7,
    totalXP: 450,
    lastActivityDate: new Date().toISOString()
  })

  // Calculate stats
  const totalLessons = allUnits.reduce((sum, unit) => sum + unit.lessons.length, 0)
  const completedCount = userProgress.completedLessons.length
  const accuracy = completedCount > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Check if lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson): boolean => {
    if (lesson.prerequisites.length === 0) return true
    return lesson.prerequisites.every(prereq => 
      userProgress.completedLessons.includes(prereq)
    )
  }

  // Update lesson locked status
  const unitsWithLockStatus = allUnits.map(unit => ({
    ...unit,
    lessons: unit.lessons.map(lesson => ({
      ...lesson,
      locked: !isLessonUnlocked(lesson),
      completed: userProgress.completedLessons.includes(lesson.id)
    }))
  }))

  // Handle lesson selection
  const handleLessonClick = (lesson: Lesson) => {
    if (!isLessonUnlocked(lesson)) return
    setSelectedLesson(lesson)
    setViewMode('lesson')
  }

  // Start quiz
  const handleStartQuiz = () => {
    setViewMode('quiz')
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
    setShowQuizResult(false)
  }

  // Handle quiz answer
  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    const newAnswers = new Map(quizAnswers)
    newAnswers.set(questionId, answerIndex)
    setQuizAnswers(newAnswers)
    setShowQuizResult(true)
  }

  // Next question or complete lesson
  const handleNextQuestion = () => {
    if (!selectedLesson) return
    
    const questions = selectedLesson.content.practiceQuestions
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowQuizResult(false)
    } else {
      // Complete lesson
      completeLesson()
    }
  }

  // Complete lesson and update progress
  const completeLesson = () => {
    if (!selectedLesson) return
    
    const questionsCorrect = selectedLesson.content.practiceQuestions.filter((q, idx) => {
      const userAnswer = quizAnswers.get(q.id)
      return userAnswer === q.correctAnswer
    }).length

    const xpEarned = questionsCorrect * 10 // 10 XP per correct answer

    setUserProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, selectedLesson.id],
      totalXP: prev.totalXP + xpEarned,
      lastActivityDate: new Date().toISOString()
    }))

    // Return to path view
    setViewMode('path')
    setSelectedLesson(null)
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
  }

  // Back to path
  const handleBackToPath = () => {
    setViewMode('path')
    setSelectedLesson(null)
    setCurrentQuestionIndex(0)
    setQuizAnswers(new Map())
    setShowQuizResult(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'path' && (
            <motion.div
              key="path"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Investment Education
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Master investing fundamentals designed for international students
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {userProgress.currentStreak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {userProgress.totalXP}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {completedCount}/{totalLessons}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Done</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {accuracy}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path */}
              <div className="space-y-12">
                {unitsWithLockStatus.map((unit, unitIndex) => (
                  <div key={unit.id}>
                    {/* Unit Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Unit {unit.orderIndex}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {unit.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {unit.description}
                        </p>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="relative pl-10 space-y-6">
                      {/* Progress Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

                      {unit.lessons.map((lesson, lessonIndex) => {
                        const isLocked = lesson.locked
                        const isCompleted = lesson.completed
                        const isActive = !isLocked && !isCompleted

                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: lessonIndex * 0.05 }}
                            className="relative"
                          >
                            {/* Status Indicator */}
                            <div className="absolute -left-10 top-6">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-gray-950 ${
                                  isCompleted
                                    ? 'bg-green-500'
                                    : isLocked
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'bg-blue-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-6 h-6 text-white" />
                                ) : isLocked ? (
                                  <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <Target className="w-6 h-6 text-white" />
                                )}
                              </div>
                            </div>

                            {/* Lesson Card */}
                            <div
                              onClick={() => !isLocked && handleLessonClick(lesson)}
                              className={`ml-6 p-6 rounded-xl border-2 transition-all ${
                                isCompleted
                                  ? 'bg-white dark:bg-gray-900 border-green-200 dark:border-green-900/30 cursor-pointer hover:border-green-300 dark:hover:border-green-800'
                                  : isLocked
                                  ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed'
                                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
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
                          </motion.div>
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

      <EnhancedChatWidget
        currentCourse={selectedLesson?.unitId}
        currentModule={selectedLesson?.title}
      />
    </div>
  )
}

export default EducationHub