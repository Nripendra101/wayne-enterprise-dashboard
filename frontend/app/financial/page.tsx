'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import FinancialChart from '../components/FinancialChart'
import MetricCard from '../components/MetricCard'
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function FinancialPage() {
  const [overview, setOverview] = useState<any>(null)
  const [financialTrends, setFinancialTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, financialRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/financial/trends`)
        ])

        setOverview(overviewRes.data)
        setFinancialTrends(financialRes.data)
      } catch (error) {
        console.error('Error fetching financial data:', error)
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
          <p className="mt-4 text-gray-600">Loading Financial Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Performance</h1>
          <p className="text-gray-600 mt-2">Revenue, profit, and financial trends across all divisions</p>
        </div>

        {/* Financial Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`$${overview?.financial?.total_revenue_m?.toLocaleString()}M`}
              change="Q4 2024"
              icon={<DollarSign className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Total Profit"
              value={`$${overview?.financial?.total_profit_m?.toLocaleString()}M`}
              change={`${overview?.financial?.profit_margin_pct}% margin`}
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
            />
            <MetricCard
              title="Latest Revenue"
              value={`$${overview?.financial?.latest_revenue_m?.toLocaleString()}M`}
              change="Current Quarter"
              icon={<BarChart3 className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="Profit Margin"
              value={`${overview?.financial?.profit_margin_pct}%`}
              change="Net Profit Ratio"
              icon={<PieChart className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </section>

        {/* Financial Trends Chart */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trends by Division</h3>
            <FinancialChart data={financialTrends} />
          </div>
        </section>

        {/* Division Performance Table */}
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
                      Revenue (M)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit (M)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialTrends?.revenue_trends?.map((division: any) => {
                    const latestRevenue = division.data[division.data.length - 1]?.value || 0
                    const latestProfit = financialTrends.profit_trends.find((p: any) => p.name === division.name)?.data[division.data.length - 1]?.value || 0
                    const margin = latestRevenue > 0 ? ((latestProfit / latestRevenue) * 100).toFixed(1) : 0
                    
                    return (
                      <tr key={division.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {division.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${latestRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${latestProfit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {margin}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 