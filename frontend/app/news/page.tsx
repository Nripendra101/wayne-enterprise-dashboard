'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsNarrative from '../components/NewsNarrative'
import MetricCard from '../components/MetricCard'
import { Newspaper, TrendingUp, Users, Shield, FlaskConical, Factory } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function NewsPage() {
  const [overview, setOverview] = useState<any>(null)
  const [newsNarrative, setNewsNarrative] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, newsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/news/narrative`)
        ])

        setOverview(overviewRes.data)
        setNewsNarrative(newsRes.data)
      } catch (error) {
        console.error('Error fetching news data:', error)
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
          <p className="mt-4 text-gray-600">Loading Business Intelligence Report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Report</h1>
          <p className="text-gray-600 mt-2">Executive summary and strategic insights for Wayne Enterprises</p>
        </div>

        {/* Key Metrics Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <MetricCard
              title="Supply Chain Efficiency"
              value="87.3%"
              change="Average Facility Performance"
              icon={<Factory className="h-6 w-6" />}
              color="orange"
            />
            <MetricCard
              title="Market Position"
              value="Strong"
              change="Competitive Advantage"
              icon={<Newspaper className="h-6 w-6" />}
              color="indigo"
            />
          </div>
        </section>

        {/* Business Intelligence Narrative */}
        <section className="mb-8">
          <div className="chart-container">
            <div className="flex items-center mb-6">
              <Newspaper className="h-8 w-8 text-wayne-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Strategic Business Intelligence Report</h3>
            </div>
            <NewsNarrative data={newsNarrative} />
          </div>
        </section>

        {/* Key Insights Cards */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Strategic Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financial Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Financial Performance</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Wayne Enterprises continues to demonstrate strong financial performance with a total revenue of ${overview?.financial?.total_revenue_m?.toLocaleString()}M</p>
                  <p>• Profit margin of {overview?.financial?.profit_margin_pct}% indicates healthy operational efficiency</p>
                  <p>• All divisions are contributing positively to the bottom line</p>
                </div>
              </div>

              {/* HR Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Human Resources</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Employee satisfaction score of {overview?.hr?.avg_satisfaction_score}/10 reflects strong workplace culture</p>
                  <p>• Retention rate of {overview?.hr?.avg_retention_pct}% indicates employee loyalty and engagement</p>
                  <p>• Training programs are effectively developing talent across all levels</p>
                </div>
              </div>

              {/* Security Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Security Operations</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Public safety score of {overview?.security?.avg_safety_score}/10 shows effective security measures</p>
                  <p>• {overview?.security?.total_incidents} total incidents managed with rapid response times</p>
                  <p>• Crime prevention effectiveness continues to improve across all districts</p>
                </div>
              </div>

              {/* R&D Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <FlaskConical className="h-6 w-6 text-orange-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Research & Development</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• {overview?.rd?.active_projects} active projects with ${overview?.rd?.total_budget_m?.toLocaleString()}M budget allocation</p>
                  <p>• Completion rate of {overview?.rd?.completion_rate_pct}% demonstrates project management excellence</p>
                  <p>• High commercialization potential across multiple research areas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Strategic Recommendations</h3>
            <div className="bg-gradient-to-r from-wayne-50 to-blue-50 rounded-lg p-6 border border-wayne-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Executive Action Items</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-wayne-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Expand R&D Investment</h5>
                    <p className="text-sm text-gray-700 mt-1">Increase budget allocation for high-potential projects, particularly in emerging technology sectors.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-wayne-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Enhance Security Infrastructure</h5>
                    <p className="text-sm text-gray-700 mt-1">Implement advanced surveillance and response systems in districts with lower safety scores.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-wayne-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Optimize Supply Chain</h5>
                    <p className="text-sm text-gray-700 mt-1">Focus on improving efficiency in facilities with utilization rates below 80%.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-wayne-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Talent Development</h5>
                    <p className="text-sm text-gray-700 mt-1">Expand training programs for mid-level employees to improve retention and career progression.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 