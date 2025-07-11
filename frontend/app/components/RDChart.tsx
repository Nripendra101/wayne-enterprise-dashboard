'use client'

import React from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RDChartProps {
  data: any
}

export default function RDChart({ data }: RDChartProps) {
  if (!data || !data.portfolio_summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No R&D data available</p>
      </div>
    )
  }

  const statusData = data.status_distribution.map((item: any) => ({
    name: item.Status,
    value: item.count
  }))

  const potentialData = data.potential_distribution.map((item: any) => ({
    name: item.Commercialization_Potential,
    value: item.count
  }))

  const budgetData = data.portfolio_summary.map((item: any) => ({
    division: item.Division.replace('Wayne ', ''),
    allocated: Math.round(item.Budget_Allocated_M),
    spent: Math.round(item.Budget_Spent_M),
    projects: item.Project_Count
  }))

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="space-y-4">
      {/* Project Status Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Project Status Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {statusData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Allocation by Division */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Allocation by Division</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="division" 
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `$${value}M`, 
                name === 'allocated' ? 'Budget Allocated' : 'Budget Spent'
              ]}
            />
            <Legend />
            <Bar dataKey="allocated" fill="#0ea5e9" name="Budget Allocated" />
            <Bar dataKey="spent" fill="#10b981" name="Budget Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 