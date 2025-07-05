import React from 'react'
import { 
  Users, 
  FileText, 
  Shield, 
  Image, 
  Folder, 
  Bot,
  BarChart3,
  Settings,
  Briefcase,
  Network,
  Star
} from 'lucide-react'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const stats = [
    { title: 'Wskazówki', value: '0', icon: Users, color: 'blue' },
    { title: 'Moje aktywa', value: '0', icon: FileText, color: 'blue' },
    { title: 'Miejsca pracy', value: '2', icon: Shield, color: 'blue' },
    { title: 'Tekst do obrazu', value: '0', icon: Image, color: 'blue' },
    { title: 'Obraz do obrazu', value: '0', icon: Folder, color: 'blue' },
    { title: 'Tekst do GIF-a', value: '0', icon: FileText, color: 'blue' },
  ]

  const quickActions = [
    { title: 'Agenci AI', icon: Bot },
    { title: 'Moje aktywa', icon: Folder },
    { title: 'Seminarium', icon: BarChart3 },
    { title: 'Zarządzaj klientami', icon: Network },
    { title: 'Miejsca pracy', icon: Briefcase },
    { title: 'Integracja', icon: Settings },
  ]

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Witamy Janusza Krawczaka
          </h1>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Odkryj pełen potencjał naszych funkcji i narzędzi, dokonując aktualizacji już teraz!
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Aktualizacja</span>
          </button>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/2">
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Team"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Favorite Agents */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">Ulubieni agenci AI</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Nie masz ulubionych agentów AI pod ręką, które tylko ich potrzebujesz
          </p>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Brak ulubionych agentów
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Szybkie linki</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Najczęściej używane funkcje i narzędzia korzystające z tych szybkich linków
          </p>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6 text-center hover:bg-gray-600 transition-colors cursor-pointer">
                <action.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <p className="text-white font-medium text-sm">{action.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Wszystkie prawa zastrzeżone dla AiAgentsArmy
        </p>
      </div>
    </div>
  )
}
