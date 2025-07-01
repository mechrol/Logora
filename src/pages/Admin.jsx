import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import AdminStats from '../components/admin/AdminStats'
import UserManagement from '../components/admin/UserManagement'
import ContentModeration from '../components/admin/ContentModeration'
import CommunityManagement from '../components/admin/CommunityManagement'
import SystemSettings from '../components/admin/SystemSettings'
import RevenueManagement from '../components/admin/RevenueManagement'
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard'

const Admin = () => {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
  }, [user, profile])

  const checkAdminAccess = async () => {
    if (!user || !profile) {
      setLoading(false)
      return
    }

    // Check if user has admin role
    if (profile.role === 'admin') {
      setIsAuthorized(true)
    }
    setLoading(false)
  }

  const adminTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'content', name: 'Content Moderation', icon: DocumentTextIcon },
    { id: 'communities', name: 'Communities', icon: GlobeAltIcon },
    { id: 'revenue', name: 'Revenue', icon: BanknotesIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'System Settings', icon: CogIcon },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the administration panel.</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats />
      case 'users':
        return <UserManagement />
      case 'content':
        return <ContentModeration />
      case 'communities':
        return <CommunityManagement />
      case 'revenue':
        return <RevenueManagement />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'settings':
        return <SystemSettings />
      default:
        return <AdminStats />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">AITribes Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {profile?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {adminTabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}

export default Admin
