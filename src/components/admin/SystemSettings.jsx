import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'AITribes',
    siteDescription: 'Create and nurture vibrant AI communities.',
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    maxPostLength: 2000,
    maxCommentsPerPost: 100,
    votingEnabled: true,
    moderationMode: 'auto',
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, you'd save these to a settings table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const settingSections = [
    {
      title: 'General Settings',
      icon: CogIcon,
      settings: [
        {
          key: 'siteName',
          label: 'Site Name',
          type: 'text',
          description: 'The name of your platform'
        },
        {
          key: 'siteDescription',
          label: 'Site Description',
          type: 'textarea',
          description: 'A brief description of your platform'
        },
        {
          key: 'maintenanceMode',
          label: 'Maintenance Mode',
          type: 'toggle',
          description: 'Enable maintenance mode to prevent user access'
        }
      ]
    },
    {
      title: 'User Management',
      icon: ShieldCheckIcon,
      settings: [
        {
          key: 'allowRegistration',
          label: 'Allow Registration',
          type: 'toggle',
          description: 'Allow new users to register'
        },
        {
          key: 'requireEmailVerification',
          label: 'Require Email Verification',
          type: 'toggle',
          description: 'Require users to verify their email before accessing the platform'
        }
      ]
    },
    {
      title: 'Content Settings',
      icon: CircleStackIcon,
      settings: [
        {
          key: 'maxPostLength',
          label: 'Maximum Post Length',
          type: 'number',
          description: 'Maximum number of characters allowed in a post'
        },
        {
          key: 'maxCommentsPerPost',
          label: 'Maximum Comments Per Post',
          type: 'number',
          description: 'Maximum number of comments allowed per post'
        },
        {
          key: 'votingEnabled',
          label: 'Enable Voting',
          type: 'toggle',
          description: 'Allow users to vote on posts and comments'
        },
        {
          key: 'moderationMode',
          label: 'Moderation Mode',
          type: 'select',
          options: [
            { value: 'auto', label: 'Automatic' },
            { value: 'manual', label: 'Manual Review' },
            { value: 'disabled', label: 'Disabled' }
          ],
          description: 'How content should be moderated'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      settings: [
        {
          key: 'enableNotifications',
          label: 'Enable Notifications',
          type: 'toggle',
          description: 'Allow the system to send notifications to users'
        }
      ]
    }
  ]

  const renderSettingInput = (setting) => {
    const value = settings[setting.key]

    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(setting.key, !value)}
            className={`mt-1 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Configure your platform settings and preferences.</p>
      </div>

      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <section.icon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex}>
                  <label className="block text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                  {setting.description && (
                    <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default SystemSettings
