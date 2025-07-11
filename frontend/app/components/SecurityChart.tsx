'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SecurityChartProps {
  data: any
}

export default function SecurityChart({ data }: SecurityChartProps) {
  if (!data || !data.safety_trends) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No security data available</p>
      </div>
    )
  }

  // Transform data for Recharts
  const chartData = data.safety_trends[0]?.data?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    ...data.safety_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.date === item.date)
      acc[`${series.name} Safety`] = seriesData?.value || 0
      return acc
    }, {}),
    ...data.incidents_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.date === item.date)
      acc[`${series.name} Incidents`] = seriesData?.value || 0
      return acc
    }, {})
  })) || []

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip 
          formatter={(value: any, name: string) => {
            if (name.includes('Safety')) return [`${value}/10`, name.replace(' Safety', ' Safety Score')]
            if (name.includes('Incidents')) return [value, name.replace(' Incidents', ' Security Incidents')]
            return [value, name]
          }}
        />
        <Legend />
        {data.safety_trends.map((series: any, index: number) => (
          <Line
            key={`safety-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Safety`}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
        {data.incidents_trends.map((series: any, index: number) => (
          <Line
            key={`incidents-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Incidents`}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
} 