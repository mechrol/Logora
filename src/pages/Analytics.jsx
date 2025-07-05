import React from 'react'
import { BarChart3, TrendingUp, Users, Zap, Calendar, Download } from 'lucide-react'

export default function Analytics() {
  const metrics = [
    { title: 'Całkowite zadania', value: '1,234', change: '+12%', trend: 'up' },
    { title: 'Aktywni agenci', value: '8', change: '+2', trend: 'up' },
    { title: 'Średnia skuteczność', value: '94.5%', change: '+2.1%', trend: 'up' },
    { title: 'Czas odpowiedzi', value: '1.2s', change: '-0.3s', trend: 'up' },
  ]

  const recentTasks = [
    { agent: 'Content Creator AI', task: 'Social media post generation', status: 'completed', time: '2 min ago' },
    { agent: 'Data Analyst AI', task: 'Sales report analysis', status: 'in_progress', time: '5 min ago' },
    { agent: 'Research Assistant AI', task: 'Market research compilation', status: 'completed', time: '10 min ago' },
    { agent: 'Code Review AI', task: 'Pull request review', status: 'completed', time: '15 min ago' },
    { agent: 'Translation AI', task: 'Document translation', status: 'failed', time: '20 min ago' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Zakończone'
      case 'in_progress': return 'W trakcie'
      case 'failed': return 'Niepowodzenie'
      default: return 'Nieznany'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analityka</h1>
          <p className="text-gray-400">Monitoruj wydajność swoich agentów AI</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Ostatnie 30 dni</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Eksportuj</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className="text-gray-400 text-sm">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Wydajność w czasie</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Wykres wydajności</p>
              <p className="text-gray-500 text-sm">Dane będą wyświetlane tutaj</p>
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Wydajność agentów</h3>
          <div className="space-y-4">
            {[
              { name: 'Content Creator AI', performance: 96, tasks: 156 },
              { name: 'Data Analyst AI', performance: 98, tasks: 89 },
              { name: 'Research Assistant AI', performance: 93, tasks: 123 },
              { name: 'Code Review AI', performance: 96, tasks: 67 },
              { name: 'Translation AI', performance: 97, tasks: 445 },
            ].map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{agent.name}</p>
                  <p className="text-gray-400 text-sm">{agent.tasks} zadań</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{agent.performance}%</p>
                  <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${agent.performance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ostatnie zadania</h3>
        <div className="space-y-4">
          {recentTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                <div>
                  <p className="text-white font-medium">{task.task}</p>
                  <p className="text-gray-400 text-sm">{task.agent}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">{getStatusText(task.status)}</p>
                <p className="text-gray-400 text-xs">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
