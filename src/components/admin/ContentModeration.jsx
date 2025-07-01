import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ContentModeration = () => {
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [postsResult, commentsResult] = await Promise.all([
        supabase
          .from('posts')
          .select(`
            *,
            profiles:author_id (full_name, username),
            post_votes (vote_type)
          `)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('comments')
          .select(`
            *,
            profiles:author_id (full_name, username),
            posts (content)
          `)
          .order('created_at', { ascending: false })
          .limit(50)
      ])

      setPosts(postsResult.data || [])
      setComments(commentsResult.data || [])
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      
      setPosts(posts.filter(post => post.id !== postId))
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      
      setComments(comments.filter(comment => comment.id !== commentId))
      toast.success('Comment deleted successfully')
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const getVoteScore = (votes) => {
    if (!votes || votes.length === 0) return 0
    return votes.reduce((score, vote) => {
      return score + (vote.vote_type === 'up' ? 1 : -1)
    }, 0)
  }

  const renderPosts = () => (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
                alt=""
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.profiles?.full_name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500">
                  @{post.profiles?.username || 'unknown'} • {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Score: {getVoteScore(post.post_votes)}
              </span>
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-900">{post.content}</p>
            {post.type === 'poll' && post.poll_data && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Poll Options:</p>
                <ul className="text-sm text-gray-600">
                  {post.poll_data.options?.map((option, index) => (
                    <li key={index}>• {option}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Type: {post.type}</span>
            <span>ID: {post.id.slice(0, 8)}...</span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderComments = () => (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
                alt=""
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {comment.profiles?.full_name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500">
                  @{comment.profiles?.username || 'unknown'} • {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => deleteComment(comment.id)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-900">{comment.content}</p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>On post: "{comment.posts?.content?.slice(0, 50)}..."</p>
            <p>ID: {comment.id.slice(0, 8)}...</p>
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Moderation</h2>
        <p className="text-gray-600">Review and moderate user-generated content.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comments ({comments.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'comments' && renderComments()}
    </div>
  )
}

export default ContentModeration
