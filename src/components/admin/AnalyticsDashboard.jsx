import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  ChartBarIcon,
  UsersIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    dailyActiveUsers: [],
    topCommunities: [],
    engagementMetrics: {},
    userGrowth: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // Fetch analytics events
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', getDateRange())
        .order('created_at', { ascending: false })

      if (error) throw error

      // Process analytics data
      const processedData = processAnalyticsData(events || [])
      setAnalytics(processedData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const date = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
    return date.toISOString()
  }

  const processAnalyticsData = (events) => {
    // Group events by date for daily active users
    const dailyUsers = {}
    const eventTypes = {}
    
    events.forEach(event => {
      const date = new Date(event.created_at).toDateString()
      if (!dailyUsers[date]) {
        dailyUsers[date] = new Set()
      }
      if (event.user_id) {
        dailyUsers[date].add(event.user_id)
      }
      
      eventTypes[event.event_type] = (eventTypes[event.event_type] || 0) + 1
    })

    const dailyActiveUsers = Object.entries(dailyUsers).map(([date, users]) => ({
      date,
      users: users.size
    }))

    return {
      dailyActiveUsers,
      topCommunities: [], // Would need to join with communities data
      engagementMetrics: eventTypes,
      userGrowth: dailyActiveUsers
    }
  }

  const engagementCards = [
    {
      title: 'Page Views',
      value: analytics.engagementMetrics.page_view || 0,
      icon: EyeIcon,
      color: 'blue'
    },
    {
      title: 'Post Interactions',
      value: analytics.engagementMetrics.post_interaction || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'green'
    },
    {
      title: 'User Signups',
      value: analytics.engagementMetrics.user_signup || 0,
      icon: UsersIcon,
      color: 'purple'
    },
    {
      title: 'Community Joins',
      value: analytics.engagementMetrics.community_join || 0,
      icon: ChartBarIcon,
      color: 'yellow'
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor user engagement and platform performance.</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Engagement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {engagementCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${card.color}-100`}>
                <card.icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Active Users Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Daily Active Users</h3>
        </div>
        <div className="p-6">
          {analytics.dailyActiveUsers.length > 0 ? (
            <div className="space-y-4">
              {analytics.dailyActiveUsers.slice(0, 7).map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (day.users / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{day.users}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available for the selected period</p>
          )}
        </div>
      </div>

      {/* Event Types Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Event Types</h3>
        </div>
        <div className="p-6">
          {Object.keys(analytics.engagementMetrics).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analytics.engagementMetrics).map(([eventType, count]) => (
                <div key={eventType} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {eventType.replace('_', ' ')}
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (count / Math.max(...Object.values(analytics.engagementMetrics))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events recorded for the selected period</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
