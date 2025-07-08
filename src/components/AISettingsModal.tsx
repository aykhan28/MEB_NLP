import React, { useState, useEffect } from 'react';
import { X, Settings, Brain, Cloud, Server, Check, AlertCircle, Loader } from 'lucide-react';
import { aiManager, AIProvider, AISettings } from '../services/aiManager';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>(aiManager.getSettings());
  const [providerStatus, setProviderStatus] = useState(aiManager.getProviderStatus());
  const [ollamaModels, setOllamaModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await aiManager.checkProviderAvailability();
      setProviderStatus(aiManager.getProviderStatus());
      
      if (providerStatus.ollama) {
        const models = await aiManager.getOllamaModels();
        setOllamaModels(models);
      }
    } catch (error) {
      console.error('Failed to load AI settings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    aiManager.saveSettings(settings);
    onClose();
  };

  const testProvider = async (provider: AIProvider) => {
    setTestResults(prev => ({ ...prev, [provider]: 'testing' }));
    
    try {
      switch (provider) {
        case 'google':
          await aiManager.generateConceptExplanation('Test Konusu');
          setTestResults(prev => ({ ...prev, [provider]: 'success' }));
          break;
        case 'openai':
          await aiManager.generateConceptExplanation('Test Konusu');
          setTestResults(prev => ({ ...prev, [provider]: 'success' }));
          break;
        case 'huggingface':
          await aiManager.generatePersonalizedFeedback({ averageScore: 75, completedSessions: 5, weakAreas: [], strongAreas: [] });
          setTestResults(prev => ({ ...prev, [provider]: 'success' }));
          break;
        case 'ollama':
          await aiManager.generateConceptExplanation('Test Konusu');
          setTestResults(prev => ({ ...prev, [provider]: 'success' }));
          break;
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
    }
  };

  const getProviderIcon = (provider: AIProvider) => {
    switch (provider) {
      case 'google': return Cloud;
      case 'openai': return Brain;
      case 'huggingface': return Brain;
      case 'ollama': return Server;
    }
  };

  const getProviderName = (provider: AIProvider) => {
    switch (provider) {
      case 'google': return 'Google Gemini';
      case 'openai': return 'OpenAI GPT';
      case 'huggingface': return 'Hugging Face';
      case 'ollama': return 'Ollama (Yerel)';
    }
  };

  const getStatusColor = (provider: AIProvider) => {
    if (testResults[provider] === 'testing') return 'text-yellow-600';
    if (testResults[provider] === 'success') return 'text-green-600';
    if (testResults[provider] === 'error') return 'text-red-600';
    return providerStatus[provider] ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (provider: AIProvider) => {
    if (testResults[provider] === 'testing') return Loader;
    if (testResults[provider] === 'success') return Check;
    if (testResults[provider] === 'error') return AlertCircle;
    return providerStatus[provider] ? Check : AlertCircle;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Ayarları</h2>
              <p className="text-gray-600">Yapay zeka sağlayıcılarını ve modellerini yönetin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">AI sağlayıcıları kontrol ediliyor...</p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {/* Provider Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Sağlayıcıları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['google', 'openai', 'huggingface', 'ollama'] as AIProvider[]).map((provider) => {
                  const Icon = getProviderIcon(provider);
                  const StatusIcon = getStatusIcon(provider);
                  
                  return (
                    <div
                      key={provider}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        settings.primaryProvider === provider
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6 text-gray-600" />
                          <span className="font-medium text-gray-900">
                            {getProviderName(provider)}
                          </span>
                        </div>
                        <StatusIcon 
                          className={`h-5 w-5 ${getStatusColor(provider)} ${
                            testResults[provider] === 'testing' ? 'animate-spin' : ''
                          }`} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="primaryProvider"
                            value={provider}
                            checked={settings.primaryProvider === provider}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              primaryProvider: e.target.value as AIProvider 
                            }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Birincil</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fallbackProvider"
                            value={provider}
                            checked={settings.fallbackProvider === provider}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              fallbackProvider: e.target.value as AIProvider 
                            }))}
                            className="h-4 w-4 text-secondary-600 focus:ring-secondary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yedek</span>
                        </label>
                      </div>
                      
                      <button
                        onClick={() => testProvider(provider)}
                        disabled={!providerStatus[provider] || testResults[provider] === 'testing'}
                        className="w-full mt-3 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {testResults[provider] === 'testing' ? 'Test Ediliyor...' : 'Test Et'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ollama Model Selection */}
            {providerStatus.ollama && ollamaModels.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ollama Model Seçimi</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <select
                    value={settings.ollamaModel || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, ollamaModel: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Model seçin...</option>
                    {ollamaModels.map((model) => (
                      <option key={model.name} value={model.name}>
                        {model.name} ({model.details.parameter_size})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    Yerel Ollama sunucunuzda yüklü modeller
                  </p>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelişmiş Ayarlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıcaklık (Temperature)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature || 0.7}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      temperature: parseFloat(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Tutarlı (0)</span>
                    <span>{settings.temperature || 0.7}</span>
                    <span>Yaratıcı (1)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maksimum Token
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={settings.maxTokens || 500}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxTokens: parseInt(e.target.value) 
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Daha uzun yanıtlar için artırın
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.useMultipleProviders || false}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      useMultipleProviders: e.target.checked 
                    }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Birden fazla sağlayıcı kullan (yedekleme için)
                  </span>
                </label>
              </div>
            </div>

            {/* Provider Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sağlayıcı Durumu</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(providerStatus).map(([provider, status]) => (
                    <div key={provider} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {getProviderName(provider as AIProvider)}
                      </span>
                      <span className={`text-sm font-medium ${
                        status ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {status ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
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
        )}
      </div>
    </div>
  );
};

export default AISettingsModal;