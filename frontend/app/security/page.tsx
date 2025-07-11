'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import SecurityChart from '../components/SecurityChart'
import MetricCard from '../components/MetricCard'
import { Shield, AlertTriangle, Clock, TrendingUp } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function SecurityPage() {
  const [overview, setOverview] = useState<any>(null)
  const [securityData, setSecurityData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, securityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/security/districts`)
        ])

        setOverview(overviewRes.data)
        setSecurityData(securityRes.data)
      } catch (error) {
        console.error('Error fetching security data:', error)
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
          <p className="mt-4 text-gray-600">Loading Security Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Operations</h1>
          <p className="text-gray-600 mt-2">District-wise security performance and public safety metrics</p>
        </div>

        {/* Security Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Safety Score"
              value={`${overview?.security?.avg_safety_score}/10`}
              change="Average District Score"
              icon={<Shield className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Total Incidents"
              value={overview?.security?.total_incidents?.toLocaleString() || '0'}
              change="Security Incidents"
              icon={<AlertTriangle className="h-6 w-6" />}
              color="red"
            />
            <MetricCard
              title="Response Time"
              value="2.1 min"
              change="Average Response"
              icon={<Clock className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="Improvement"
              value="+4.2 pts"
              change="Safety Score Growth"
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
            />
          </div>
        </section>

        {/* Security Trends Chart */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Performance Trends by District</h3>
            <SecurityChart data={securityData} />
          </div>
        </section>

        {/* District Performance Table */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">District Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      District
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Safety Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incidents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prevention %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityData?.district_performance?.map((district: any) => (
                    <tr key={district.District}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {district.District}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.Public_Safety_Score?.toFixed(1)}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.Security_Incidents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.Response_Time_Minutes?.toFixed(1)} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {district.Crime_Prevention_Effectiveness_Pct?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* District Cards */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">District Performance Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityData?.district_performance?.map((district: any) => (
                <div key={district.District} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{district.District}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      district.Public_Safety_Score >= 8 ? 'bg-green-100 text-green-800' :
                      district.Public_Safety_Score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {district.Public_Safety_Score?.toFixed(1)}/10
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Security Incidents:</span>
                      <span className="text-gray-900">{district.Security_Incidents}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="text-gray-900">{district.Response_Time_Minutes?.toFixed(1)} min</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Prevention Rate:</span>
                      <span className="text-gray-900">{district.Crime_Prevention_Effectiveness_Pct?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Safety Index:</span>
                      <span className="text-gray-900">{district.Employee_Safety_Index?.toFixed(1)}/10</span>
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