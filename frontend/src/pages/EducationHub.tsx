import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import InternationalEducationHub from '../components/InternationalEducationHub'
import InternationalChatWidget from '../components/InternationalChatWidget'

const EducationHub: React.FC = () => {
  const [visaStatus] = useState({
    status: 'F1' as const,
    timeRemaining: '2 years 4 months',
    restrictions: ['No day trading', 'Report investment income', '401k limited access']
  })

  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined)
  const [selectedModule, setSelectedModule] = useState<string | undefined>(undefined)

  // Listen for course selection events from the education hub
  useEffect(() => {
    const handleCourseSelection = (event: CustomEvent) => {
      setSelectedCourse(event.detail.courseTitle)
      setSelectedModule(event.detail.moduleTitle)
    }

    window.addEventListener('courseSelected', handleCourseSelection as EventListener)
    
    return () => {
      window.removeEventListener('courseSelected', handleCourseSelection as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main International Education Hub */}
      <InternationalEducationHub />

      {/* Enhanced International Student Chat Widget with Course Context */}
      <InternationalChatWidget 
        visaStatus={visaStatus}
        currentCourse={selectedCourse}
        currentModule={selectedModule}  
      />
    </div>
  )
}

export default EducationHub