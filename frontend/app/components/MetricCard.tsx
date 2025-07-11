import React from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: 'wayne' | 'green' | 'blue' | 'purple' | 'red' | 'yellow'
}

const colorClasses = {
  wayne: 'text-wayne-600 bg-wayne-50',
  green: 'text-green-600 bg-green-50',
  blue: 'text-blue-600 bg-blue-50',
  purple: 'text-purple-600 bg-purple-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50'
}

export default function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
} 