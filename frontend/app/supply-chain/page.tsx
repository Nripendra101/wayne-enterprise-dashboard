'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import SupplyChainChart from '../components/SupplyChainChart'
import MetricCard from '../components/MetricCard'
import { Factory, Package, Clock, TrendingUp } from 'lucide-react'

const API_BASE_URL = 'http://localhost:8000'

export default function SupplyChainPage() {
  const [overview, setOverview] = useState<any>(null)
  const [supplyChainData, setSupplyChainData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, supplyChainRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/overview`),
          axios.get(`${API_BASE_URL}/api/supply-chain/facilities`)
        ])

        setOverview(overviewRes.data)
        setSupplyChainData(supplyChainRes.data)
      } catch (error) {
        console.error('Error fetching supply chain data:', error)
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
          <p className="mt-4 text-gray-600">Loading Supply Chain Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Operations</h1>
          <p className="text-gray-600 mt-2">Facility performance, efficiency metrics, and operational insights</p>
        </div>

        {/* Supply Chain Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Operational Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Facilities"
              value={supplyChainData?.facility_performance?.length || 0}
              change="Active Locations"
              icon={<Factory className="h-6 w-6" />}
              color="wayne"
            />
            <MetricCard
              title="Avg Efficiency"
              value={`${(
                supplyChainData?.facility_performance?.reduce((acc: number, facility: any) => acc + (facility.Operational_Efficiency_Pct || 0), 0) /
                (supplyChainData?.facility_performance?.length || 1)
              ).toFixed(2)}%`}
              change="Operational Efficiency"
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
            />
            <MetricCard
              title="Total Capacity"
              value={`${supplyChainData?.facility_performance?.reduce((acc: number, facility: any) => acc + (facility.Production_Capacity_Units || 0), 0)?.toLocaleString()} units`}
              change="Production Capacity"
              icon={<Package className="h-6 w-6" />}
              color="blue"
            />
            <MetricCard
              title="Avg Lead Time"
              value={`${supplyChainData?.facility_performance?.reduce((acc: number, facility: any) => acc + (facility.Lead_Time_Days || 0), 0) / (supplyChainData?.facility_performance?.length || 1)?.toFixed(1)} days`}
              change="Order to Delivery"
              icon={<Clock className="h-6 w-6" />}
              color="purple"
            />
          </div>
        </section>

        {/* Supply Chain Chart */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Performance Analysis</h3>
            <SupplyChainChart data={supplyChainData} />
          </div>
        </section>

        {/* Facility Performance Table */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilization %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplyChainData?.facility_performance?.map((facility: any) => (
                    <tr key={facility.Facility_Name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {facility.Facility_Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facility.Facility_Type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facility.Operational_Efficiency_Pct?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facility.Production_Capacity_Units?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facility.Capacity_Utilization_Pct?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facility.Lead_Time_Days?.toFixed(1)} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Facility Cards */}
        <section className="mb-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Performance Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplyChainData?.facility_performance?.map((facility: any) => (
                <div key={facility.Facility_Name} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{facility.Facility_Name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      facility.Operational_Efficiency_Pct >= 85 ? 'bg-green-100 text-green-800' :
                      facility.Operational_Efficiency_Pct >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {facility.Operational_Efficiency_Pct?.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{facility.Facility_Type}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="text-gray-900">{facility.Production_Capacity_Units?.toLocaleString()} units</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="text-gray-900">{facility.Capacity_Utilization_Pct?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Lead Time:</span>
                      <span className="text-gray-900">{facility.Lead_Time_Days?.toFixed(1)} days</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600">Quality Score:</span>
                      <span className="text-gray-900">{facility.Quality_Score?.toFixed(1)}/10</span>
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