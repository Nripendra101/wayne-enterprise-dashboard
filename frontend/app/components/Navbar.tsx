'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Users, Shield, FlaskConical, Factory, Newspaper, BarChart3 } from 'lucide-react'

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/', icon: <BarChart3 className="h-4 w-4" /> },
    { name: 'Financial', href: '/financial', icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'HR Analytics', href: '/hr', icon: <Users className="h-4 w-4" /> },
    { name: 'Security', href: '/security', icon: <Shield className="h-4 w-4" /> },
    { name: 'R&D Portfolio', href: '/rd', icon: <FlaskConical className="h-4 w-4" /> },
    { name: 'Supply Chain', href: '/supply-chain', icon: <Factory className="h-4 w-4" /> },
    { name: 'News Report', href: '/news', icon: <Newspaper className="h-4 w-4" /> },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Wayne Enterprises</h1>
              <p className="text-xs text-gray-600">Business Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-wayne-100 text-wayne-700 border-b-2 border-wayne-600'
                        : 'text-gray-600 hover:text-wayne-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-wayne-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-wayne-100 text-wayne-700'
                      : 'text-gray-600 hover:text-wayne-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 