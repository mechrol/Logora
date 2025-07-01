import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    communities: 'Communities',
    projects: 'Projects',
    analytics: 'Analytics',
    profile: 'Profile',
    admin: 'Admin',
    
    // Authentication
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    username: 'Username',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    
    // Posts & Content
    post: 'Post',
    posts: 'Posts',
    createPost: 'Create Post',
    whatsOnYourMind: "What's on your mind? Share an idea, proposal, or start a discussion...",
    addPoll: 'Add Poll',
    removePoll: 'Remove Poll',
    pollOptions: 'Poll Options',
    addOption: 'Add option',
    totalVotes: 'Total votes',
    comment: 'Comment',
    comments: 'Comments',
    share: 'Share',
    vote: 'Vote',
    upvote: 'Upvote',
    downvote: 'Downvote',
    
    // Communities
    community: 'Community',
    joinCommunity: 'Join Community',
    leaveCommunity: 'Leave Community',
    createCommunity: 'Create Community',
    members: 'Members',
    moderators: 'Moderators',
    
    // Projects
    project: 'Project',
    createProject: 'Create Project',
    projectProposal: 'Project Proposal',
    assumptions: 'Assumptions',
    theorems: 'Theorems',
    proofs: 'Proofs',
    conclusions: 'Conclusions',
    
    // Admin Panel
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    userManagement: 'User Management',
    contentModeration: 'Content Moderation',
    systemSettings: 'System Settings',
    revenue: 'Revenue',
    
    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Status & Messages
    loading: 'Loading...',
    saving: 'Saving...',
    posting: 'Posting...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    
    // Time
    ago: 'ago',
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    
    // Language Selection
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    polish: 'Polish'
  },
  
  pl: {
    // Navigation
    home: 'Strona główna',
    communities: 'Społeczności',
    projects: 'Projekty',
    analytics: 'Analityka',
    profile: 'Profil',
    admin: 'Administrator',
    
    // Authentication
    login: 'Zaloguj się',
    register: 'Zarejestruj się',
    logout: 'Wyloguj się',
    email: 'Email',
    password: 'Hasło',
    confirmPassword: 'Potwierdź hasło',
    fullName: 'Imię i nazwisko',
    username: 'Nazwa użytkownika',
    signIn: 'Zaloguj się',
    signUp: 'Zarejestruj się',
    forgotPassword: 'Zapomniałeś hasła?',
    
    // Posts & Content
    post: 'Post',
    posts: 'Posty',
    createPost: 'Utwórz post',
    whatsOnYourMind: 'Co masz na myśli? Podziel się pomysłem, propozycją lub rozpocznij dyskusję...',
    addPoll: 'Dodaj ankietę',
    removePoll: 'Usuń ankietę',
    pollOptions: 'Opcje ankiety',
    addOption: 'Dodaj opcję',
    totalVotes: 'Łączna liczba głosów',
    comment: 'Komentarz',
    comments: 'Komentarze',
    share: 'Udostępnij',
    vote: 'Głosuj',
    upvote: 'Głos za',
    downvote: 'Głos przeciw',
    
    // Communities
    community: 'Społeczność',
    joinCommunity: 'Dołącz do społeczności',
    leaveCommunity: 'Opuść społeczność',
    createCommunity: 'Utwórz społeczność',
    members: 'Członkowie',
    moderators: 'Moderatorzy',
    
    // Projects
    project: 'Projekt',
    createProject: 'Utwórz projekt',
    projectProposal: 'Propozycja projektu',
    assumptions: 'Założenia',
    theorems: 'Twierdzenia',
    proofs: 'Dowody',
    conclusions: 'Wnioski',
    
    // Admin Panel
    adminPanel: 'Panel administratora',
    dashboard: 'Pulpit',
    userManagement: 'Zarządzanie użytkownikami',
    contentModeration: 'Moderacja treści',
    systemSettings: 'Ustawienia systemu',
    revenue: 'Przychody',
    
    // Common Actions
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    create: 'Utwórz',
    update: 'Aktualizuj',
    search: 'Szukaj',
    filter: 'Filtruj',
    sort: 'Sortuj',
    
    // Status & Messages
    loading: 'Ładowanie...',
    saving: 'Zapisywanie...',
    posting: 'Publikowanie...',
    success: 'Sukces',
    error: 'Błąd',
    warning: 'Ostrzeżenie',
    info: 'Informacja',
    
    // Time
    ago: 'temu',
    now: 'teraz',
    today: 'dzisiaj',
    yesterday: 'wczoraj',
    
    // Language Selection
    language: 'Język',
    selectLanguage: 'Wybierz język',
    english: 'Angielski',
    polish: 'Polski'
  }
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode)
      localStorage.setItem('selectedLanguage', languageCode)
    }
  }

  const t = (key) => {
    return translations[currentLanguage][key] || translations.en[key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
