'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SupplyChainChartProps {
  data: any
}

export default function SupplyChainChart({ data }: SupplyChainChartProps) {
  if (!data || !data.production_trends) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No supply chain data available</p>
      </div>
    )
  }

  // Transform data for Recharts
  const chartData = data.production_trends[0]?.data?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    ...data.production_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.date === item.date)
      acc[`${series.name} Production`] = seriesData?.value || 0
      return acc
    }, {}),
    ...data.quality_trends.reduce((acc: any, series: any) => {
      const seriesData = series.data.find((d: any) => d.date === item.date)
      acc[`${series.name} Quality`] = seriesData?.value || 0
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
            if (name.includes('Production')) return [`${value.toLocaleString()} units`, name.replace(' Production', ' Production Volume')]
            if (name.includes('Quality')) return [`${value}%`, name.replace(' Quality', ' Quality Score')]
            return [value, name]
          }}
        />
        <Legend />
        {data.production_trends.map((series: any, index: number) => (
          <Line
            key={`production-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Production`}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
        {data.quality_trends.map((series: any, index: number) => (
          <Line
            key={`quality-${series.name}`}
            type="monotone"
            dataKey={`${series.name} Quality`}
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