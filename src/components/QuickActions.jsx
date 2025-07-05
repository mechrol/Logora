import React from 'react'

export default function QuickActions({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <div 
          key={index} 
          className="bg-gray-700 rounded-lg p-6 text-center hover:bg-gray-600 transition-colors cursor-pointer"
        >
          <action.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-white font-medium text-sm">{action.title}</p>
        </div>
      ))}
    </div>
  )
}
