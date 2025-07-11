'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import RDChart from '../components/RDChart'
import MetricCard from '../components/MetricCard'
import { FlaskConical, DollarSign, Clock, Target, TrendingUp } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function RDPage() {
  const [overview, setOverview] = useState<any>(null)
  const [rdPortfolio, setRdPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, rdRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/rd/portfolio`)
        ])

        setOverview(overviewRes.data)
        setRdPortfolio(rdRes.data)
      } catch (error) {
        console.error('Error fetching R&D data:', error)
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
          <p className="mt-4 text-gray-600">Loading R&D Portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">R&D Portfolio</h1>
          <p className="text-gray-600 mt-2">Research projects, budget allocation, and commercialization potential</p>
        </div>

        {/* R&D Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active Projects"
              value={overview?.rd?.active_projects || 0}
              change="Currently Running"
              icon={<FlaskConical className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Total Budget"
              value={`$${overview?.rd?.total_budget_m?.toLocaleString()}M`}
              change="Allocated Budget"
              icon={<DollarSign className="h-6 w-6" />}
              color="green"
            />
            <MetricCard
              title="Completion Rate"
              value={`${overview?.rd?.completion_rate_pct}%`}
              change="Project Success"
              icon={<Target className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="High Potential"
              value={rdPortfolio?.potential_distribution?.find((p: any) => p.Commercialization_Potential === 'Very High')?.count || 0}
              change="Very High Potential"
              icon={<TrendingUp className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </section>

        {/* R&D Charts */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Analysis</h3>
            <RDChart data={rdPortfolio} />
          </div>
        </section>

        {/* Division Performance */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Division Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget (M)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent (M)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      High Potential
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timeline %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rdPortfolio?.portfolio_summary?.map((division: any) => (
                    <tr key={division.Division}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {division.Division?.replace('Wayne ', '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {division.Project_Count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${division.Budget_Allocated_M?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${division.Budget_Spent_M?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {division.High_Potential_Projects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rdPortfolio.timeline_data?.find((t: any) => t.Division === division.Division)?.Timeline_Adherence_Pct?.toFixed(1) || 'N/A'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Project Status Distribution */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status & Potential</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Project Status</h4>
                <div className="space-y-3">
                  {rdPortfolio?.status_distribution?.map((status: any) => (
                    <div key={status.Status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{status.Status}</span>
                      <span className="text-sm text-gray-600">{status.count} projects</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercialization Potential */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Commercialization Potential</h4>
                <div className="space-y-3">
                  {rdPortfolio?.potential_distribution?.map((potential: any) => (
                    <div key={potential.Commercialization_Potential} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{potential.Commercialization_Potential}</span>
                      <span className="text-sm text-gray-600">{potential.count} projects</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 