import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ''])
  }

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
  }

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index)
      setPollOptions(newOptions)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const postData = {
        content: content.trim(),
        author_id: user.id,
        type: showPoll ? 'poll' : 'text'
      }

      if (showPoll) {
        const validOptions = pollOptions.filter(option => option.trim())
        if (validOptions.length < 2) {
          toast.error('Poll must have at least 2 options')
          return
        }
        postData.poll_data = {
          options: validOptions.map(option => ({
            text: option.trim(),
            votes: 0
          }))
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert([postData])

      if (error) throw error

      setContent('')
      setPollOptions(['', ''])
      setShowPoll(false)
      toast.success(t('success'))
      onPostCreated()
    } catch (error) {
      toast.error(t('error'))
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('whatsOnYourMind')}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />

        {showPoll && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{t('pollOptions')}</h4>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handlePollOptionChange(index, e.target.value)}
                  placeholder={`${t('addOption')} ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePollOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPollOption}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              {t('addOption')}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowPoll(!showPoll)}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              showPoll
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            {showPoll ? t('removePoll') : t('addPoll')}
          </button>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? t('posting') : t('post')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
