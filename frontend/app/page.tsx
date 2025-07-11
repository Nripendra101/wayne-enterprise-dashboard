'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import MetricCard from './components/MetricCard'
import FinancialChart from './components/FinancialChart'
import HRChart from './components/HRChart'
import SecurityChart from './components/SecurityChart'
import RDChart from './components/RDChart'
import SupplyChainChart from './components/SupplyChainChart'
import NewsNarrative from './components/NewsNarrative'
import { TrendingUp, Users, Shield, FlaskConical, Factory, Newspaper } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function OverviewPage() {
  const [overview, setOverview] = useState<any>(null)
  const [financialTrends, setFinancialTrends] = useState<any>(null)
  const [hrPerformance, setHrPerformance] = useState<any>(null)
  const [securityData, setSecurityData] = useState<any>(null)
  const [rdPortfolio, setRdPortfolio] = useState<any>(null)
  const [supplyChainData, setSupplyChainData] = useState<any>(null)
  const [newsNarrative, setNewsNarrative] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          overviewRes,
          financialRes,
          hrRes,
          securityRes,
          rdRes,
          supplyChainRes,
          newsRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/financial/trends`),
          axios.get(`${API_BASE_URL}/api/hr/performance`),
          axios.get(`${API_BASE_URL}/api/security/districts`),
          axios.get(`${API_BASE_URL}/api/rd/portfolio`),
          axios.get(`${API_BASE_URL}/api/supply-chain/facilities`),
          axios.get(`${API_BASE_URL}/api/news/narrative`)
        ])

        setOverview(overviewRes.data)
        setFinancialTrends(financialRes.data)
        setHrPerformance(hrRes.data)
        setSecurityData(securityRes.data)
        setRdPortfolio(rdRes.data)
        setSupplyChainData(supplyChainRes.data)
        setNewsNarrative(newsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
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
          <p className="mt-4 text-gray-600">Loading Wayne Enterprises Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Executive Overview</h1>
          <p className="text-gray-600 mt-2">Comprehensive business intelligence summary for Wayne Enterprises</p>
        </div>

        {/* Executive Summary Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`$${overview?.financial?.total_revenue_m?.toLocaleString()}M`}
              change={`${overview?.financial?.profit_margin_pct}% margin`}
              icon={<TrendingUp className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Employee Satisfaction"
              value={`${overview?.hr?.avg_satisfaction_score}/10`}
              change={`${overview?.hr?.avg_retention_pct}% retention`}
              icon={<Users className="h-6 w-6" />}
              color="green"
            />
            <MetricCard
              title="Public Safety Score"
              value={`${overview?.security?.avg_safety_score}/10`}
              change={`${overview?.security?.total_incidents} incidents`}
              icon={<Shield className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="Active R&D Projects"
              value={overview?.rd?.active_projects}
              change={`$${overview?.rd?.total_budget_m?.toLocaleString()}M budget`}
              icon={<FlaskConical className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Financial Performance */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance Trends</h3>
            <FinancialChart data={financialTrends} />
          </div>

          {/* HR Performance */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Performance by Department</h3>
            <HRChart data={hrPerformance} />
          </div>

          {/* Security Performance */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Performance by District</h3>
            <SecurityChart data={securityData} />
          </div>

          {/* R&D Portfolio */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">R&D Portfolio Analysis</h3>
            <RDChart data={rdPortfolio} />
          </div>
        </div>

        {/* Supply Chain and News Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supply Chain Performance */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Performance</h3>
            <SupplyChainChart data={supplyChainData} />
          </div>

          {/* News Narrative */}
          <div className="news-card">
            <div className="flex items-center mb-4">
              <Newspaper className="h-6 w-6 text-wayne-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Business Intelligence Report</h3>
            </div>
            <NewsNarrative data={newsNarrative} />
          </div>
        </div>
      </main>
    </div>
  )
} 