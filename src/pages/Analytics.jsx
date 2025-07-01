import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline'

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalVotes: 0,
    totalCommunities: 0
  })
  const [communityData, setCommunityData] = useState([])
  const [votingData, setVotingData] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch basic stats
      const [usersRes, postsRes, votesRes, communitiesRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('post_votes').select('*', { count: 'exact', head: true }),
        supabase.from('communities').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalUsers: usersRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalVotes: votesRes.count || 0,
        totalCommunities: communitiesRes.count || 0
      })

      // Fetch community analytics
      const { data: communities } = await supabase
        .from('communities')
        .select(`
          name,
          community_members (id),
          posts (id)
        `)

      const communityAnalytics = communities?.map(community => ({
        name: community.name,
        members: community.community_members?.length || 0,
        posts: community.posts?.length || 0
      })) || []

      setCommunityData(communityAnalytics)

      // Fetch voting patterns
      const { data: votes } = await supabase
        .from('post_votes')
        .select('vote_type, created_at')

      const votingPatterns = votes?.reduce((acc, vote) => {
        const type = vote.vote_type === 'up' ? 'Upvotes' : 'Downvotes'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {}) || {}

      setVotingData([
        { name: 'Upvotes', value: votingPatterns.Upvotes || 0, color: '#22c55e' },
        { name: 'Downvotes', value: votingPatterns.Downvotes || 0, color: '#ef4444' }
      ])

      // Fetch project analytics
      const { data: projects } = await supabase
        .from('projects')
        .select(`
          status,
          project_votes (vote_type)
        `)

      const projectAnalytics = projects?.reduce((acc, project) => {
        const status = project.status || 'draft'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {}) || {}

      setProjectData([
        { name: 'Draft', value: projectAnalytics.draft || 0 },
        { name: 'In Review', value: projectAnalytics.in_review || 0 },
        { name: 'Approved', value: projectAnalytics.approved || 0 },
        { name: 'Rejected', value: projectAnalytics.rejected || 0 }
      ])

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600">Insights into community engagement and democratic participation</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Communities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCommunities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Engagement */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Community Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={communityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="members" fill="#3b82f6" name="Members" />
              <Bar dataKey="posts" fill="#10b981" name="Posts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Voting Patterns */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Voting Patterns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={votingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {votingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trends */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Democratic Participation</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Average Votes per Post</span>
              <span className="font-bold text-primary-600">
                {stats.totalPosts > 0 ? (stats.totalVotes / stats.totalPosts).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Posts per User</span>
              <span className="font-bold text-secondary-600">
                {stats.totalUsers > 0 ? (stats.totalPosts / stats.totalUsers).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Engagement Rate</span>
              <span className="font-bold text-yellow-600">
                {stats.totalUsers > 0 ? ((stats.totalVotes / stats.totalUsers) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {communityData.length > 0 ? Math.max(...communityData.map(c => c.members)) : 0}
            </div>
            <p className="text-gray-600">Largest Community</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {communityData.length > 0 ? Math.max(...communityData.map(c => c.posts)) : 0}
            </div>
            <p className="text-gray-600">Most Active Community</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {votingData.length > 0 ? Math.max(...votingData.map(v => v.value)) : 0}
            </div>
            <p className="text-gray-600">Peak Voting Activity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
