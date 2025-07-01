import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'
import { 
  HomeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Layout = ({ children }) => {
  const { user, profile, signOut } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  const navigation = [
    { name: t('home'), href: '/', icon: HomeIcon },
    { name: t('communities'), href: '/communities', icon: UserGroupIcon },
    { name: t('projects'), href: '/projects', icon: CogIcon },
    { name: t('analytics'), href: '/analytics', icon: ChartBarIcon },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">DemocraticSocial</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search') + '...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1`}
                  alt="Profile"
                />
                <span className="text-sm font-medium text-gray-700">
                  {profile?.full_name || user?.email}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={t('logout')}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <UserIcon className="mr-3 h-5 w-5" />
                {t('profile')}
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
