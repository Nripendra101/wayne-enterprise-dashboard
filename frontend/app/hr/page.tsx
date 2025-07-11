'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import HRChart from '../components/HRChart'
import MetricCard from '../components/MetricCard'
import { Users, TrendingUp, Award, Clock } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function HRPage() {
  const [overview, setOverview] = useState<any>(null)
  const [hrPerformance, setHrPerformance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, hrRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/hr/performance`)
        ])

        setOverview(overviewRes.data)
        setHrPerformance(hrRes.data)
      } catch (error) {
        console.error('Error fetching HR data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wayne-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HR Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Analytics</h1>
          <p className="text-gray-600 mt-2">Employee performance, satisfaction, and retention metrics</p>
        </div>

        {/* HR Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Employees"
              value={overview?.hr?.total_employees?.toLocaleString() || '0'}
              change="Active Workforce"
              icon={<Users className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Retention Rate"
              value={`${overview?.hr?.avg_retention_pct}%`}
              change="Average Retention"
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
            />
            <MetricCard
              title="Satisfaction Score"
              value={`${overview?.hr?.avg_satisfaction_score}/10`}
              change="Employee Satisfaction"
              icon={<Award className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="Training Hours"
              value="156 hrs"
              change="Annual Average"
              icon={<Clock className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </section>

        {/* HR Performance Chart */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance Metrics</h3>
            <HRChart data={hrPerformance} />
          </div>
        </section>

        {/* Employee Distribution */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Distribution by Department & Level</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retention %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satisfaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hrPerformance?.employee_distribution?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.Department?.replace('Wayne ', '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Employee_Level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hrPerformance.level_performance?.find((l: any) => l.Employee_Level === item.Employee_Level)?.Retention_Rate_Pct?.toFixed(1) || 'N/A'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hrPerformance.level_performance?.find((l: any) => l.Employee_Level === item.Employee_Level)?.Employee_Satisfaction_Score?.toFixed(1) || 'N/A'}/10
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Performance by Level */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Employee Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hrPerformance?.level_performance?.map((level: any) => (
                <div key={level.Employee_Level} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{level.Employee_Level}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Retention:</span>
                      <span className="text-gray-900">{level.Retention_Rate_Pct?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="text-gray-900">{level.Employee_Satisfaction_Score?.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Training:</span>
                      <span className="text-gray-900">{level.Training_Hours_Annual?.toFixed(0)} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Performance:</span>
                      <span className="text-gray-900">{level.Performance_Rating?.toFixed(1)}/6.3</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 