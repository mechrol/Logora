import React from 'react'
import { Menu, Bell, User, CreditCard } from 'lucide-react'

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="ml-2 lg:ml-0 text-xl font-semibold text-white">Panel</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
          <CreditCard className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Pd</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-purple-600 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-white">NEW</span>
        </div>

        <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-white">Kredyt lewy</span>
        </div>

        <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-white">Janusz Krawczak</span>
        </div>
      </div>
    </header>
  )
}
