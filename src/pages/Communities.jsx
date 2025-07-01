import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { PlusIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Communities = () => {
  const [communities, setCommunities] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
    is_public: true
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          community_members (
            id,
            user_id,
            role
          ),
          posts (
            id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCommunities(data || [])
    } catch (error) {
      toast.error('Error fetching communities')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCommunity = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      const { data: community, error } = await supabase
        .from('communities')
        .insert([{
          ...formData,
          creator_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      // Add creator as admin member
      await supabase
        .from('community_members')
        .insert([{
          community_id: community.id,
          user_id: user.id,
          role: 'admin'
        }])

      setFormData({ name: '', description: '', theme: '', is_public: true })
      setShowCreateForm(false)
      fetchCommunities()
      toast.success('Community created successfully!')
    } catch (error) {
      toast.error('Error creating community')
      console.error('Error:', error)
    }
  }

  const handleJoinCommunity = async (communityId) => {
    try {
      await supabase
        .from('community_members')
        .insert([{
          community_id: communityId,
          user_id: user.id,
          role: 'member'
        }])

      fetchCommunities()
      toast.success('Joined community!')
    } catch (error) {
      toast.error('Error joining community')
      console.error('Error:', error)
    }
  }

  const isUserMember = (community) => {
    return community.community_members?.some(member => member.user_id === user.id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600">Join thematic communities and participate in focused discussions</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Community
        </button>
      </div>

      {/* Create Community Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Community</h2>
          <form onSubmit={handleCreateCommunity} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Community Name"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Theme (e.g., Technology, Environment)"
                className="input"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Community Description"
              className="input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                Public community (anyone can join)
              </label>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Community
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div key={community.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{community.name}</h3>
                {community.theme && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full mt-1">
                    {community.theme}
                  </span>
                )}
              </div>
              <img
                className="h-12 w-12 rounded-lg"
                src={`https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
                alt="Community"
              />
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {community.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {community.community_members?.length || 0} members
              </div>
              <div className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                {community.posts?.length || 0} posts
              </div>
            </div>

            <div className="flex space-x-2">
              {isUserMember(community) ? (
                <button className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium">
                  Joined
                </button>
              ) : (
                <button
                  onClick={() => handleJoinCommunity(community.id)}
                  className="flex-1 btn-primary"
                >
                  Join Community
                </button>
              )}
              <button className="btn-secondary">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="card text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities yet</h3>
          <p className="text-gray-500 mb-4">Be the first to create a community and start building connections!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create First Community
          </button>
        </div>
      )}
    </div>
  )
}

export default Communities
