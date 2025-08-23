import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for the chart
const generateMockData = () => {
  const data = []
  const baseValue = 5000
  let currentValue = baseValue
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Add some realistic volatility
    const change = (Math.random() - 0.5) * 200
    currentValue += change
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(currentValue, baseValue * 0.8) // Don't go below 80% of base
    })
  }
  
  return data
}

const PerformanceChart = () => {
  const data = generateMockData()
  const currentValue = data[data.length - 1].value
  const startValue = data[0].value
  const isPositive = currentValue >= startValue

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            labelStyle={{ color: '#374151' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: isPositive ? '#10b981' : '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart