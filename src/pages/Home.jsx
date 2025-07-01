import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import toast from 'react-hot-toast'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            username,
            avatar_url
          ),
          post_votes (
            id,
            vote_type,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            profiles:author_id (
              full_name,
              username
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      toast.error('Error fetching posts')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    fetchPosts()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Democratic Social
        </h1>
        <p className="text-gray-600">
          Share ideas, vote on proposals, and participate in democratic decision-making.
        </p>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))
        )}
      </div>
    </div>
  )
}

export default Home
