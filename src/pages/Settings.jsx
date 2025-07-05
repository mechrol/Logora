import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  CreditCard,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  })

  const [profile, setProfile] = useState({
    name: 'Janusz Krawczak',
    email: 'janusz@example.com',
    company: 'AI Agents Army',
    timezone: 'Europe/Warsaw'
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ustawienia</h1>
        <p className="text-gray-400">Zarządzaj swoim kontem i preferencjami</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Profil</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Imię i nazwisko</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Firma</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Strefa czasowa</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Europe/Warsaw">Europe/Warsaw</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-white">Powiadomienia</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Powiadomienia email</p>
                <p className="text-gray-400 text-sm">Otrzymuj powiadomienia na email</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, email: !notifications.email})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Powiadomienia push</p>
                <p className="text-gray-400 text-sm">Otrzymuj powiadomienia w przeglądarce</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, push: !notifications.push})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Powiadomienia SMS</p>
                <p className="text-gray-400 text-sm">Otrzymuj powiadomienia SMS</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Key className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-white">Klucze API</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Klucz API</label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value="sk-1234567890abcdef1234567890abcdef"
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Wygeneruj nowy klucz
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-white">Bezpieczeństwo</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <p className="text-white font-medium">Zmień hasło</p>
              <p className="text-gray-400 text-sm">Ostatnia zmiana: 30 dni temu</p>
            </button>
            
            <button className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <p className="text-white font-medium">Uwierzytelnianie dwuskładnikowe</p>
              <p className="text-gray-400 text-sm">Dodaj dodatkową warstwę bezpieczeństwa</p>
            </button>
            
            <button className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <p className="text-white font-medium">Aktywne sesje</p>
              <p className="text-gray-400 text-sm">Zarządzaj urządzeniami z dostępem do konta</p>
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CreditCard className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-white">Rozliczenia</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Plan Premium</p>
                <p className="text-gray-400 text-sm">$29.99/miesiąc</p>
              </div>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Aktywny</span>
            </div>
            
            <button className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <p className="text-white font-medium">Historia płatności</p>
              <p className="text-gray-400 text-sm">Zobacz wszystkie transakcje</p>
            </button>
            
            <button className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <p className="text-white font-medium">Metody płatności</p>
              <p className="text-gray-400 text-sm">Zarządzaj kartami i metodami płatności</p>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Zapisz zmiany</span>
          </button>
        </div>
      </div>
    </div>
  )
}
