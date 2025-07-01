import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  ChatBubbleLeftIcon,
  ShareIcon 
} from '@heroicons/react/24/outline'
import { 
  HandThumbUpIcon as HandThumbUpSolid, 
  HandThumbDownIcon as HandThumbDownSolid 
} from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()

  const userVote = post.post_votes?.find(vote => vote.user_id === user.id)
  const upvotes = post.post_votes?.filter(vote => vote.vote_type === 'up').length || 0
  const downvotes = post.post_votes?.filter(vote => vote.vote_type === 'down').length || 0

  const formatDate = (date) => {
    const locale = currentLanguage === 'pl' ? pl : undefined
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale })
  }

  const handleVote = async (voteType) => {
    try {
      if (userVote) {
        if (userVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from('post_votes')
            .delete()
            .eq('id', userVote.id)
        } else {
          // Update vote
          await supabase
            .from('post_votes')
            .update({ vote_type: voteType })
            .eq('id', userVote.id)
        }
      } else {
        // Add new vote
        await supabase
          .from('post_votes')
          .insert([{
            post_id: post.id,
            user_id: user.id,
            vote_type: voteType
          }])
      }
      onUpdate()
    } catch (error) {
      toast.error(t('error'))
      console.error('Error:', error)
    }
  }

  const handlePollVote = async (optionIndex) => {
    try {
      // Check if user already voted on this poll
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        toast.error('You have already voted on this poll')
        return
      }

      // Add poll vote
      await supabase
        .from('poll_votes')
        .insert([{
          post_id: post.id,
          user_id: user.id,
          option_index: optionIndex
        }])

      // Update poll data
      const updatedPollData = { ...post.poll_data }
      updatedPollData.options[optionIndex].votes += 1

      await supabase
        .from('posts')
        .update({ poll_data: updatedPollData })
        .eq('id', post.id)

      onUpdate()
      toast.success(t('success'))
    } catch (error) {
      toast.error(t('error'))
      console.error('Error:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          author_id: user.id,
          content: newComment.trim()
        }])

      setNewComment('')
      onUpdate()
      toast.success(t('success'))
    } catch (error) {
      toast.error(t('error'))
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPollVotes = post.poll_data?.options?.reduce((sum, option) => sum + option.votes, 0) || 0

  return (
    <div className="card">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          className="h-10 w-10 rounded-full"
          src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
          alt="Profile"
        />
        <div>
          <h3 className="font-medium text-gray-900">
            {post.profiles?.full_name || 'Anonymous'}
          </h3>
          <p className="text-sm text-gray-500">
            @{post.profiles?.username || 'user'} • {formatDate(post.created_at)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Poll */}
      {post.type === 'poll' && post.poll_data && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Poll</h4>
          <div className="space-y-2">
            {post.poll_data.options.map((option, index) => {
              const percentage = totalPollVotes > 0 ? (option.votes / totalPollVotes) * 100 : 0
              return (
                <button
                  key={index}
                  onClick={() => handlePollVote(index)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-900">{option.text}</span>
                    <span className="text-sm text-gray-500">{option.votes} {t('vote')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </button>
              )
            })}
          </div>
          <p className="text-sm text-gray-500 mt-2">{t('totalVotes')}: {totalPollVotes}</p>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('up')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              userVote?.vote_type === 'up'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {userVote?.vote_type === 'up' ? (
              <HandThumbUpSolid className="h-4 w-4" />
            ) : (
              <HandThumbUpIcon className="h-4 w-4" />
            )}
            <span className="text-sm">{upvotes}</span>
          </button>

          <button
            onClick={() => handleVote('down')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
              userVote?.vote_type === 'down'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {userVote?.vote_type === 'down' ? (
              <HandThumbDownSolid className="h-4 w-4" />
            ) : (
              <HandThumbDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm">{downvotes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-4 w-4" />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </button>
        </div>

        <button className="flex items-center space-x-1 px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <ShareIcon className="h-4 w-4" />
          <span className="text-sm">{t('share')}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
                alt="Your profile"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('comment') + '...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="mt-2 btn-primary text-sm disabled:opacity-50"
                >
                  {loading ? t('posting') : t('comment')}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
                  alt="Commenter"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {comment.profiles?.full_name || 'Anonymous'}
                    </h4>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
