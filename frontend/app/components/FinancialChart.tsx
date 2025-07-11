'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FinancialChartProps {
  data: any
}

export default function FinancialChart({ data }: FinancialChartProps) {
  if (!data || !data.revenue_trends) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No financial data available</p>
      </div>
    )
  }

  // Transform data for Recharts
  const chartData = data.revenue_trends[0]?.data?.map((item: any) => ({
    period: item.period,
    ...data.revenue_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.period === item.period)
      acc[`${series.name} Revenue`] = seriesData?.value || 0
      return acc
    }, {}),
    ...data.profit_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.period === item.period)
      acc[`${series.name} Profit`] = seriesData?.value || 0
      return acc
    }, {})
  })) || []

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="period" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip 
          formatter={(value: any, name: string) => [
            `$${value.toLocaleString()}M`, 
            name
          ]}
        />
        <Legend />
        {data.revenue_trends.map((series: any, index: number) => (
          <Line
            key={`revenue-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Revenue`}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
        {data.profit_trends.map((series: any, index: number) => (
          <Line
            key={`profit-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Profit`}
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