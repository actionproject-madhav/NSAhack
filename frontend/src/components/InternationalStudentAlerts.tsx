import React, { useState } from 'react'
import { AlertTriangle, Info, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Alert {
  id: string
  type: 'warning' | 'info' | 'critical'
  title: string
  message: string
  action?: string
  link?: string
}

const InternationalStudentAlerts: React.FC<{ 
  ticker?: string 
  tradeAmount?: number 
  tradeType?: 'buy' | 'sell'
}> = ({ ticker, tradeAmount, tradeType }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  const getAlertsForTrade = (): Alert[] => {
    const alerts: Alert[] = []

    // Critical: Unauthorized Employment Risk
    alerts.push({
      id: 'unauthorized-employment',
      type: 'critical',
      title: 'F-1 Visa Risk: Unauthorized Employment',
      message: 'USCIS considers frequent trading as "self-employment" which violates F-1 status. No specific trade limit exists, but systematic trading patterns raise red flags.',
      action: 'Learn Safe Trading Practices',
      link: '/education/f1-trading-guide'
    })

    // Pattern Day Trading Warning with $25k requirement
    alerts.push({
      id: 'pdt-warning',
      type: 'warning',
      title: 'Pattern Day Trader Rule Alert',
      message: '4+ day trades in 5 business days = PDT status. Requires $25,000 minimum account balance. This applies to ALL traders regardless of visa status.',
      action: 'Understand PDT Rules'
    })

    // Tax implications for non-resident aliens
    alerts.push({
      id: 'tax-implications',
      type: 'warning',
      title: 'Non-Resident Alien Tax Rules',
      message: 'Capital gains taxed at 30% flat rate if present in US 183+ days. Short-term gains taxed as ordinary income. Must file Form 1040-NR.',
      action: 'Learn Tax Requirements'
    })

    // SSN/ITIN requirement
    alerts.push({
      id: 'ssn-requirement',
      type: 'info',
      title: 'Account Opening Requirements',
      message: 'Most brokers require SSN (available with CPT/OPT) or ITIN. Students without work authorization may need ITIN for trading.',
      action: 'Check Account Requirements'
    })

    // Tax Treaty Benefits
    alerts.push({
      id: 'tax-treaty',
      type: 'info',
      title: 'Tax Treaty Benefits Available',
      message: 'Many countries have tax treaties with US offering reduced rates. File Form W-8BEN with your broker to claim benefits.',
      action: 'Check My Country\'s Tax Treaty',
      link: '/tools/tax-treaty-checker'
    })

    // Safe investing recommendation
    alerts.push({
      id: 'safe-investing',
      type: 'info',
      title: 'Recommended: Long-term Passive Investing',
      message: 'Buy-and-hold strategy is safest for F-1 students. Avoid frequent trading that could be seen as business activity.',
      action: 'See Safe Investment Options'
    })

    return alerts.filter(alert => !dismissedAlerts.includes(alert.id))
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId])
  }

  const alerts = getAlertsForTrade()

  if (alerts.length === 0) return null

  const primaryAlert = alerts[0]
  const additionalAlerts = alerts.slice(1)

  return (
    <div className="mb-4">
      {/* Primary Alert - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-lg p-4 border ${
          primaryAlert.type === 'critical' 
            ? 'bg-red-50 border-red-200 text-red-900' 
            : primaryAlert.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}
      >
        <button
          onClick={() => dismissAlert(primaryAlert.id)}
          className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex-shrink-0 mt-0.5">
            {primaryAlert.type === 'critical' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium mb-1">{primaryAlert.title}</h4>
            <p className="text-sm mb-3 opacity-90">{primaryAlert.message}</p>
            
            <div className="flex items-center justify-between">
              {primaryAlert.action && (
                <button className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                  primaryAlert.type === 'critical'
                    ? 'bg-red-100 hover:bg-red-200 text-red-800'
                    : primaryAlert.type === 'warning'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}>
                  {primaryAlert.action}
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
              
              {additionalAlerts.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
                >
                  {additionalAlerts.length} more alert{additionalAlerts.length > 1 ? 's' : ''}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Alerts - Collapsible */}
      <AnimatePresence>
        {isExpanded && additionalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {additionalAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                className={`rounded-lg p-3 border ${
                  alert.type === 'critical' 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : alert.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <div className="flex-shrink-0 mt-0.5">
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Info className="w-3 h-3" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-1">{alert.title}</h5>
                    <p className="text-xs mb-2 opacity-90">{alert.message}</p>
                    
                    {alert.action && (
                      <button className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                        alert.type === 'critical'
                          ? 'bg-red-100 hover:bg-red-200 text-red-800'
                          : alert.type === 'warning'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      }`}>
                        {alert.action}
                        <ExternalLink className="w-2 h-2" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InternationalStudentAlerts