import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  BanknotesIcon,
  ChartBarIcon,
  LinkIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const RevenueManagement = () => {
  const [affiliateLinks, setAffiliateLinks] = useState([])
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalClicks: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const { data: links, error } = await supabase
        .from('affiliate_links')
        .select(`
          *,
          profiles:user_id (full_name, username),
          communities:community_id (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setAffiliateLinks(links || [])

      // Calculate stats
      const totalRevenue = links?.reduce((sum, link) => sum + (parseFloat(link.revenue) || 0), 0) || 0
      const totalClicks = links?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0
      const totalConversions = links?.reduce((sum, link) => sum + (link.conversion_count || 0), 0) || 0
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

      // Calculate monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const monthlyRevenue = links?.filter(link => 
        new Date(link.created_at) >= thirtyDaysAgo
      ).reduce((sum, link) => sum + (parseFloat(link.revenue) || 0), 0) || 0

      setRevenueStats({
        totalRevenue,
        monthlyRevenue,
        totalClicks,
        conversionRate
      })
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      toast.error('Failed to fetch revenue data')
    } finally {
      setLoading(false)
    }
  }

  const toggleLinkStatus = async (linkId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('affiliate_links')
        .update({ is_active: !currentStatus })
        .eq('id', linkId)

      if (error) throw error

      setAffiliateLinks(links => 
        links.map(link => 
          link.id === linkId ? { ...link, is_active: !currentStatus } : link
        )
      )
      toast.success('Link status updated')
    } catch (error) {
      console.error('Error updating link status:', error)
      toast.error('Failed to update link status')
    }
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${revenueStats.totalRevenue.toFixed(2)}`,
      icon: BanknotesIcon,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `$${revenueStats.monthlyRevenue.toFixed(2)}`,
      icon: ChartBarIcon,
      color: 'blue'
    },
    {
      title: 'Total Clicks',
      value: revenueStats.totalClicks.toLocaleString(),
      icon: EyeIcon,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: `${revenueStats.conversionRate.toFixed(2)}%`,
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Management</h2>
        <p className="text-gray-600">Monitor affiliate links and revenue performance.</p>
      </div>

      {/* Stats Cards */}
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
          </div>
        ))}
      </div>

      {/* Affiliate Links Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Affiliate Links</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Link
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Community
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affiliateLinks.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {link.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {link.description?.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.profiles?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.communities?.name || 'General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.click_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.conversion_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(parseFloat(link.revenue) || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      link.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {link.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleLinkStatus(link.id, link.is_active)}
                      className={`${
                        link.is_active 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {link.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RevenueManagement
