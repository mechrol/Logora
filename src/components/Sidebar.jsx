import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Bot, 
  BarChart3, 
  Settings, 
  Users, 
  FileText, 
  Zap,
  Shield,
  X
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Panel', href: '/', icon: Home },
  { name: 'Agenci AI', href: '/agents', icon: Bot },
  { name: 'Grafika AI', href: '/graphics', icon: Zap },
  { name: 'Wyszukiwany Chatbot', href: '/chatbot', icon: Users },
  { name: 'Tekst do obrazu', href: '/text-to-image', icon: FileText },
  { name: 'Obraz do obrazu', href: '/image-to-image', icon: FileText },
  { name: 'Tekst do GIF-a', href: '/text-to-gif', icon: FileText },
  { name: 'Tekst na dźwięk', href: '/text-to-audio', icon: FileText },
  { name: 'Moje akcje', href: '/actions', icon: Zap },
  { name: 'Moje aktywa', href: '/assets', icon: Shield },
  { name: 'Wskazówki', href: '/tips', icon: BarChart3 },
  { name: 'Biała etykieta', href: '/white-label', icon: Shield },
  { name: 'Ustawienia', href: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Ai Agents</h1>
              <p className="text-xs text-gray-400">Army</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
                onClick={() => onClose()}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Wszystkie prawa zastrzeżone dla</p>
            <p className="text-sm font-medium text-white">AiAgentsArmy</p>
          </div>
        </div>
      </div>
    </>
  )
}
