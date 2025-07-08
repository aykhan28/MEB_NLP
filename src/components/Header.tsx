import React, { useState } from 'react';
import { Brain, Bell, Settings, User, LogOut, ChevronDown, Cpu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AISettingsModal from './AISettingsModal';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'test', label: 'Test' },
          { id: 'plan', label: 'Öğrenme Planı' },
          { id: 'ai-plan', label: 'AI Plan' },
          { id: 'achievements', label: 'Kazanımlar' },
          { id: 'ai-chat', label: 'AI Chat' }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'students', label: 'Sınıf Yönetimi' },
          { id: 'analytics', label: 'Analitik' },
          { id: 'content', label: 'İçerik' },
          { id: 'question-generator', label: 'Soru Üretici' },
          { id: 'exam-creator', label: 'Sınav Oluştur' },
          { id: 'messaging', label: 'Mesajlar' },
          { id: 'ai-chat', label: 'AI Chat' }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'children', label: 'Çocuklarım' },
          { id: 'reports', label: 'Raporlar' },
          { id: 'communication', label: 'İletişim' },
          { id: 'messaging', label: 'Mesajlar' }
        ];
      default:
        return [];
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return 'Öğrenci';
      case 'teacher': return 'Öğretmen';
      case 'parent': return 'Veli';
      default: return '';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NLP MEB</h1>
                <p className="text-xs text-gray-500">Akıllı Öğrenme Planlayıcı</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.id
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* AI Settings Button */}
              <button 
                onClick={() => setShowAISettings(true)}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200 relative"
                title="AI Ayarları"
              >
                <Cpu className="h-5 w-5" />
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                        {getRoleLabel(user?.role || '')}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowProfile(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowAISettings(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>AI Ayarları</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowSettings(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Ayarlar</span>
                    </button>
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  currentView === item.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Modals */}
      <AISettingsModal 
        isOpen={showAISettings} 
        onClose={() => setShowAISettings(false)} 
      />
      
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default Header;