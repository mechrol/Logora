import React, { useState } from 'react'
import { Bot, Plus, Search, Filter, MoreVertical, Play, Pause, Settings } from 'lucide-react'

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const agents = [
    {
      id: 1,
      name: 'Content Creator AI',
      description: 'Specialized in creating engaging social media content and marketing materials',
      status: 'active',
      tasks: 156,
      success_rate: 94,
      avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Marketing'
    },
    {
      id: 2,
      name: 'Data Analyst AI',
      description: 'Expert in data analysis, visualization, and generating actionable insights',
      status: 'active',
      tasks: 89,
      success_rate: 98,
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Analytics'
    },
    {
      id: 3,
      name: 'Customer Support AI',
      description: 'Handles customer inquiries and provides 24/7 support assistance',
      status: 'inactive',
      tasks: 234,
      success_rate: 91,
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Support'
    },
    {
      id: 4,
      name: 'Code Review AI',
      description: 'Reviews code quality, suggests improvements, and identifies potential bugs',
      status: 'active',
      tasks: 67,
      success_rate: 96,
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Development'
    },
    {
      id: 5,
      name: 'Research Assistant AI',
      description: 'Conducts comprehensive research and compiles detailed reports',
      status: 'active',
      tasks: 123,
      success_rate: 93,
      avatar: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Research'
    },
    {
      id: 6,
      name: 'Translation AI',
      description: 'Provides accurate translations across multiple languages',
      status: 'maintenance',
      tasks: 445,
      success_rate: 97,
      avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100',
      specialty: 'Language'
    }
  ]

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'maintenance': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktywny'
      case 'inactive': return 'Nieaktywny'
      case 'maintenance': return 'Konserwacja'
      default: return 'Nieznany'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agenci AI</h1>
          <p className="text-gray-400">Zarządzaj swoją armią inteligentnych asystentów</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Dodaj Agenta</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Szukaj agentów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Wszystkie</option>
            <option value="active">Aktywne</option>
            <option value="inactive">Nieaktywne</option>
            <option value="maintenance">Konserwacja</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-gray-800 rounded-xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <span className="text-sm text-blue-400">{agent.specialty}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{agent.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                <span className="text-sm text-gray-300">{getStatusText(agent.status)}</span>
              </div>
              <span className="text-sm text-gray-400">{agent.tasks} zadań</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Skuteczność</span>
                <span className="text-sm font-medium text-white">{agent.success_rate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${agent.success_rate}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{agent.status === 'active' ? 'Zatrzymaj' : 'Uruchom'}</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nie znaleziono agentów</h3>
          <p className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania lub dodaj nowego agenta</p>
        </div>
      )}
    </div>
  )
}
