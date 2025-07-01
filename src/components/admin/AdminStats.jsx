import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalCommunities: 0,
    activeUsers: 0,
    totalVotes: 0,
    totalProjects: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentActivity()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [
        usersResult,
        postsResult,
        commentsResult,
        communitiesResult,
        votesResult,
        projectsResult,
        revenueResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('posts').select('id', { count: 'exact' }),
        supabase.from('comments').select('id', { count: 'exact' }),
        supabase.from('communities').select('id', { count: 'exact' }),
        supabase.from('post_votes').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('affiliate_links').select('revenue').eq('is_active', true)
      ])

      const totalRevenue = revenueResult.data?.reduce((sum, link) => sum + (parseFloat(link.revenue) || 0), 0) || 0

      setStats({
        totalUsers: usersResult.count || 0,
        totalPosts: postsResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalCommunities: communitiesResult.count || 0,
        totalVotes: votesResult.count || 0,
        totalProjects: projectsResult.count || 0,
        totalRevenue: totalRevenue,
        activeUsers: Math.floor((usersResult.count || 0) * 0.3) // Estimate 30% active
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select(`
          *,
          profiles:user_id (full_name, username)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setRecentActivity(data || [])
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserGroupIcon,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: UserGroupIcon,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments,
      icon: ChatBubbleLeftRightIcon,
      color: 'yellow',
      change: '+22%'
    },
    {
      title: 'Communities',
      value: stats.totalCommunities,
      icon: TrophyIcon,
      color: 'indigo',
      change: '+5%'
    },
    {
      title: 'Total Votes',
      value: stats.totalVotes,
      icon: TrophyIcon,
      color: 'pink',
      change: '+18%'
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      icon: DocumentTextIcon,
      color: 'red',
      change: '+10%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrophyIcon,
      color: 'emerald',
      change: '+25%'
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your AITribes platform performance and key metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {activity.profiles?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.profiles?.full_name || 'Unknown User'}
                      </span>
                      {' '}performed{' '}
                      <span className="font-medium">{activity.event_type}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminStats
