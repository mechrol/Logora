import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { CameraIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, profile, fetchProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: ''
  })
  const [stats, setStats] = useState({
    posts: 0,
    votes: 0,
    points: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || ''
      })
    }
    fetchStats()
  }, [profile])

  const fetchStats = async () => {
    try {
      // Fetch user posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)

      // Fetch user votes count
      const { count: votesCount } = await supabase
        .from('post_votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setStats({
        posts: postsCount || 0,
        votes: votesCount || 0,
        points: profile?.points || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile(user.id)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              className="h-24 w-24 rounded-full"
              src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1`}
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="full_name"
                    type="text"
                    placeholder="Full Name"
                    className="input"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="input"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <input
                  name="location"
                  type="text"
                  placeholder="Location"
                  className="input"
                  value={formData.location}
                  onChange={handleChange}
                />
                <textarea
                  name="bio"
                  placeholder="Bio"
                  className="input"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || 'Anonymous User'}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-secondary"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-gray-600 mb-1">@{profile?.username || 'user'}</p>
                {profile?.location && (
                  <p className="text-gray-500 mb-2">{profile.location}</p>
                )}
                {profile?.bio && (
                  <p className="text-gray-700">{profile.bio}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.posts}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{stats.votes}</div>
              <div className="text-sm text-gray-500">Votes Cast</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.points}</div>
              <div className="text-sm text-gray-500">Democracy Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Voted on "Community Garden Proposal"</span>
            <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Created post "New Democratic Features"</span>
            <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700">Joined "Tech Innovation" community</span>
            <span className="text-sm text-gray-500 ml-auto">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
