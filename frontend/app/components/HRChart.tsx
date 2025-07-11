'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface HRChartProps {
  data: any
}

export default function HRChart({ data }: HRChartProps) {
  if (!data || !data.department_performance) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No HR data available</p>
      </div>
    )
  }

  const chartData = data.department_performance.map((dept: any) => ({
    department: dept.Department.replace('Wayne ', ''),
    retention: Math.round(dept.Retention_Rate_Pct),
    satisfaction: Math.round(dept.Employee_Satisfaction_Score * 10),
    training: Math.round(dept.Training_Hours_Annual / 10),
    performance: Math.round(dept.Performance_Rating * 20)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="department" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name === 'retention') return [`${value}%`, 'Retention Rate']
            if (name === 'satisfaction') return [`${value/10}/10`, 'Satisfaction Score']
            if (name === 'training') return [`${value*10} hours`, 'Training Hours']
            if (name === 'performance') return [`${value/20}/5`, 'Performance Rating']
            return [value, name]
          }}
        />
        <Legend />
        <Bar dataKey="retention" fill="#0ea5e9" name="Retention Rate (%)" />
        <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction Score" />
        <Bar dataKey="training" fill="#f59e0b" name="Training Hours" />
        <Bar dataKey="performance" fill="#8b5cf6" name="Performance Rating" />
      </BarChart>
    </ResponsiveContainer>
  )
} 