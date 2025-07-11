'use client'

import React from 'react'

interface NewsNarrativeProps {
  data: any
}

export default function NewsNarrative({ data }: NewsNarrativeProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No narrative data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className="border-b-2 border-wayne-600 pb-2">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {data.headline}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {data.subheadline}
        </p>
      </div>

      {/* Key Points */}
      <div className="space-y-3">
        {data.key_points?.map((point: string, index: number) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-wayne-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Metrics Summary */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-wayne-600">
              {data.metrics?.revenue_growth}%
            </p>
            <p className="text-xs text-gray-600">Revenue Growth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {data.metrics?.safety_improvement}
            </p>
            <p className="text-xs text-gray-600">Safety Improvement</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {data.metrics?.active_projects}
            </p>
            <p className="text-xs text-gray-600">Active Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {data.metrics?.employee_count?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Employees</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
        Wayne Enterprises Business Intelligence Report • Q4 2024
      </div>
    </div>
  )
} 