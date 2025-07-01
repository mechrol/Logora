import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCommunity, setEditingCommunity] = useState(null)

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          profiles:creator_id (full_name, username),
          community_members (id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommunities(data || [])
    } catch (error) {
      console.error('Error fetching communities:', error)
      toast.error('Failed to fetch communities')
    } finally {
      setLoading(false)
    }
  }

  const deleteCommunity = async (communityId) => {
    if (!confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', communityId)

      if (error) throw error
      
      setCommunities(communities.filter(community => community.id !== communityId))
      toast.success('Community deleted successfully')
    } catch (error) {
      console.error('Error deleting community:', error)
      toast.error('Failed to delete community')
    }
  }

  const toggleCommunityVisibility = async (communityId, currentVisibility) => {
    try {
      const { error } = await supabase
        .from('communities')
        .update({ is_public: !currentVisibility })
        .eq('id', communityId)

      if (error) throw error
      
      setCommunities(communities.map(community => 
        community.id === communityId 
          ? { ...community, is_public: !currentVisibility }
          : community
      ))
      toast.success('Community visibility updated')
    } catch (error) {
      console.error('Error updating community:', error)
      toast.error('Failed to update community')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Management</h2>
          <p className="text-gray-600">Manage communities and their settings.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Community
        </button>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Community Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {community.banner_url && (
                <img
                  src={community.banner_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                {community.is_public ? (
                  <GlobeAltIcon className="h-5 w-5 text-white" />
                ) : (
                  <LockClosedIcon className="h-5 w-5 text-white" />
                )}
              </div>
            </div>

            {/* Community Info */}
            <div className="p-6">
              <div className="flex items-center mb-3">
                {community.avatar_url ? (
                  <img
                    src={community.avatar_url}
                    alt=""
                    className="h-12 w-12 rounded-full border-2 border-white -mt-8 relative z-10"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 rounded-full border-2 border-white -mt-8 relative z-10 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                  <p className="text-sm text-gray-500">
                    {community.community_members?.length || 0} members
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {community.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created by @{community.profiles?.username || 'unknown'}</span>
                <span>{new Date(community.created_at).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleCommunityVisibility(community.id, community.is_public)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    community.is_public
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {community.is_public ? 'Public' : 'Private'}
                </button>
                <button
                  onClick={() => setEditingCommunity(community)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteCommunity(community.id)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No communities</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new community.</p>
        </div>
      )}
    </div>
  )
}

export default CommunityManagement
