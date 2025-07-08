import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Globe, Bell, Shield, Palette } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'tr',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      progressVisible: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  });

  const handleSave = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Ayarlar</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Görünüm */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Görünüm</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors duration-200 ${
                      settings.theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Açık</span>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors duration-200 ${
                      settings.theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Koyu</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yazı Boyutu</label>
                <select
                  value={settings.accessibility.fontSize}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, fontSize: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="small">Küçük</option>
                  <option value="medium">Orta</option>
                  <option value="large">Büyük</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dil */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Dil</span>
            </h3>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Bildirimler */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Bildirimler</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {key === 'email' ? 'E-posta Bildirimleri' : 
                     key === 'push' ? 'Anlık Bildirimler' : 'SMS Bildirimleri'}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Gizlilik */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Gizlilik</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {key === 'profileVisible' ? 'Profil Görünürlüğü' : 
                     key === 'activityVisible' ? 'Aktivite Görünürlüğü' : 'İlerleme Görünürlüğü'}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, [key]: e.target.checked }
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Erişilebilirlik */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Erişilebilirlik</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Yüksek Kontrast</span>
                <input
                  type="checkbox"
                  checked={settings.accessibility.highContrast}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, highContrast: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Azaltılmış Hareket</span>
                <input
                  type="checkbox"
                  checked={settings.accessibility.reducedMotion}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, reducedMotion: e.target.checked }
                  }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;