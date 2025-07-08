import React, { useState, useEffect } from 'react';
import { 
  Brain, Calendar, Clock, Target, Play, CheckCircle, 
  BookOpen, TrendingUp, Award, Zap, BarChart3, 
  ChevronRight, RefreshCw, Lightbulb, Users, 
  MessageSquare, Star, Timer, Settings
} from 'lucide-react';
import { aiManager } from '../services/aiManager';
import { useAuth } from '../contexts/AuthContext';
import AISettingsModal from './AISettingsModal';

interface StudyPlan {
  id: string;
  studentId: string;
  subject: string;
  weakAreas: string[];
  studySchedule: StudySession[];
  generatedQuestions: GeneratedQuestion[];
  conceptExplanations: ConceptExplanation[];
  createdAt: string;
  updatedAt: string;
  aiProvider?: string;
}

interface StudySession {
  id: string;
  date: string;
  time: string;
  topic: string;
  type: 'concept' | 'practice' | 'review' | 'test';
  duration: number;
  completed: boolean;
  score?: number;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  achievement: string;
  createdAt: string;
}

interface ConceptExplanation {
  id: string;
  topic: string;
  title: string;
  content: string;
  examples: string[];
  keyPoints: string[];
  relatedTopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

interface StudentProgress {
  studentId: string;
  subject: string;
  completedSessions: number;
  totalSessions: number;
  averageScore: number;
  weakAreas: string[];
  strongAreas: string[];
  lastStudyDate: string;
  streakDays: number;
  aiInsights?: string;
}

const AILearningPlan: React.FC = () => {
  const { user } = useAuth();
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentExplanation, setCurrentExplanation] = useState<ConceptExplanation | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'study' | 'insights' | 'progress'>('plan');
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [studyStreak, setStudyStreak] = useState(0);
  const [showAISettings, setShowAISettings] = useState(false);
  const [aiProvider, setAiProvider] = useState('');

  useEffect(() => {
    if (user) {
      loadStudentData();
      loadAIInsights();
      checkAIProvider();
    }
  }, [user]);

  const checkAIProvider = async () => {
    try {
      await aiManager.checkProviderAvailability();
      const provider = aiManager.getAvailableProvider();
      setAiProvider(provider);
    } catch (error) {
      console.error('AI provider check failed:', error);
      setAiProvider('fallback');
    }
  };

  const loadStudentData = async () => {
    if (!user) return;
    
    try {
      const studentProgress = await aiManager.analyzeStudentProgress(user.id);
      setProgress(studentProgress);
      
      // Çalışma serisi hesapla
      const streak = calculateStudyStreak();
      setStudyStreak(streak);
    } catch (error) {
      console.error('Failed to load student data:', error);
    }
  };

  const loadAIInsights = async () => {
    // AI öngörüleri ve önerileri yükle
    const insights = {
      personalizedTips: [
        {
          icon: '🧠',
          title: 'Öğrenme Stili Analizi',
          content: 'Görsel öğrenme tarzın baskın. Diyagramlar ve şemalar kullanarak çalışman daha etkili olacak.',
          priority: 'high'
        },
        {
          icon: '⏰',
          title: 'Optimal Çalışma Zamanı',
          content: 'En verimli olduğun saatler: 14:00-16:00 ve 19:00-21:00 arası.',
          priority: 'medium'
        },
        {
          icon: '🎯',
          title: 'Hedef Odaklı Strateji',
          content: 'Bu hafta "Oran ve Orantı" konusunu tamamlarsan genel başarın %15 artacak.',
          priority: 'high'
        }
      ],
      weeklyForecast: {
        expectedProgress: 85,
        challengingTopics: ['Geometrik Şekiller', 'Oran ve Orantı'],
        recommendedStudyTime: 180, // dakika
        successProbability: 92
      },
      motivationalMessage: 'Bu hafta harika gidiyorsun! Düzenli çalışma alışkanlığın gelişiyor. 🌟'
    };
    
    setAiInsights(insights);
  };

  const calculateStudyStreak = () => {
    // Son 7 günde kaç gün çalışma yapıldığını hesapla
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simüle edilmiş çalışma verisi
      const hasStudied = Math.random() > 0.3; // %70 ihtimalle çalışmış
      if (hasStudied) {
        streak++;
      } else if (i === 0) {
        // Bugün çalışmamışsa seri kırılır
        break;
      }
    }
    
    return streak;
  };

  const generateNewPlan = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const weakAreas = ['Doğrusal Denklemler', 'Oran ve Orantı', 'Geometrik Şekiller'];
      const plan = await aiManager.generateStudyPlan({
        studentId: user.id,
        subject: 'matematik_8',
        weakAreas,
        currentLevel: 75
      });
      setStudyPlan(plan);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startStudySession = async (session: StudySession) => {
    setSelectedSession(session);
    
    if (session.type === 'concept') {
      try {
        const explanation = await aiManager.generateConceptExplanation(session.topic);
        setCurrentExplanation(explanation);
      } catch (error) {
        console.error('Failed to generate explanation:', error);
      }
    } else if (session.type === 'practice' || session.type === 'test') {
      try {
        const questions = await aiManager.generateQuestions(
          session.topic,
          'medium',
          session.type === 'test' ? 10 : 5
        );
        setCurrentQuestions(questions);
      } catch (error) {
        console.error('Failed to generate questions:', error);
      }
    }
    
    setActiveTab('study');
  };

  const completeSession = (score?: number) => {
    if (!selectedSession || !studyPlan) return;
    
    const updatedPlan = { ...studyPlan };
    const sessionIndex = updatedPlan.studySchedule.findIndex(s => s.id === selectedSession.id);
    
    if (sessionIndex !== -1) {
      updatedPlan.studySchedule[sessionIndex] = {
        ...selectedSession,
        completed: true,
        score
      };
      setStudyPlan(updatedPlan);
    }
    
    setSelectedSession(null);
    setCurrentExplanation(null);
    setCurrentQuestions([]);
    setActiveTab('plan');
    loadStudentData();
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return BookOpen;
      case 'practice': return Target;
      case 'review': return RefreshCw;
      case 'test': return Award;
      default: return Clock;
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-600';
      case 'practice': return 'bg-green-100 text-green-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'test': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'concept': return 'Konu Anlatımı';
      case 'practice': return 'Alıştırma';
      case 'review': return 'Tekrar';
      case 'test': return 'Test';
      default: return 'Çalışma';
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google Gemini';
      case 'huggingface': return 'Hugging Face';
      case 'ollama': return 'Ollama';
      default: return 'AI Sistemi';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Destekli Öğrenme Planı</h2>
            <p className="text-primary-100 mb-4">
              {getProviderLabel(aiProvider)} ile kişiselleştirilmiş çalışma programınız
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm">{getProviderLabel(aiProvider)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm">RAG Destekli</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span className="text-sm">{studyStreak} Gün Seri</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAISettings(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>AI Ayarları</span>
              </button>
              <button
                onClick={generateNewPlan}
                disabled={isGenerating}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
                <span>Yeni Plan Oluştur</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.completedSessions}</p>
            <p className="text-sm text-gray-600">Tamamlanan Oturum</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.round(progress.averageScore)}%</p>
            <p className="text-sm text-gray-600">Ortalama Başarı</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.streakDays}</p>
            <p className="text-sm text-gray-600">Günlük Seri</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((progress.completedSessions / progress.totalSessions) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Plan İlerlemesi</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'plan', label: 'Çalışma Planı', icon: Calendar },
              { id: 'study', label: 'Çalışma', icon: BookOpen },
              { id: 'insights', label: 'AI Öngörüleri', icon: Brain },
              { id: 'progress', label: 'İlerleme', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Study Plan Tab */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              {!studyPlan ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI Çalışma Planı Oluştur</h3>
                  <p className="text-gray-600 mb-6">
                    Eksik alanlarınıza göre kişiselleştirilmiş çalışma planı oluşturalım
                  </p>
                  <button
                    onClick={generateNewPlan}
                    disabled={isGenerating}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Brain className="h-5 w-5" />
                    )}
                    <span>Plan Oluştur</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">2 Haftalık Çalışma Takvimi</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        AI Sağlayıcı: {getProviderLabel(studyPlan.aiProvider || aiProvider)}
                      </span>
                      <button
                        onClick={generateNewPlan}
                        disabled={isGenerating}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Yenile</span>
                      </button>
                    </div>
                  </div>
                  
                  {studyPlan.studySchedule.map((session, index) => {
                    const Icon = getSessionTypeIcon(session.type);
                    const isToday = new Date(session.date).toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={session.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 animate-slide-up ${
                          session.completed
                            ? 'border-green-200 bg-green-50'
                            : isToday
                            ? 'border-primary-200 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${getSessionTypeColor(session.type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{session.topic}</h4>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span>{new Date(session.date).toLocaleDateString('tr-TR')}</span>
                                <span>{session.time}</span>
                                <span>{session.duration} dk</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(session.type)}`}>
                                  {getSessionTypeLabel(session.type)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {session.completed ? (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                  {session.score ? `${session.score}%` : 'Tamamlandı'}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => startStudySession(session)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <Play className="h-4 w-4" />
                                <span>Başla</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Study Tab */}
          {activeTab === 'study' && (
            <div>
              {!selectedSession ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Çalışma Oturumu Seçin</h3>
                  <p className="text-gray-600">
                    Çalışma planından bir oturum seçerek başlayın
                  </p>
                </div>
              ) : currentExplanation ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{currentExplanation.title}</h3>
                    <button
                      onClick={() => completeSession()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Tamamla
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="prose max-w-none">
                      <p className="text-gray-800 leading-relaxed">{currentExplanation.content}</p>
                    </div>
                  </div>
                  
                  {currentExplanation.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Örnekler</h4>
                      <div className="space-y-2">
                        {currentExplanation.examples.map((example, index) => (
                          <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-gray-800">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentExplanation.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Anahtar Noktalar</h4>
                      <ul className="space-y-2">
                        {currentExplanation.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : currentQuestions.length > 0 ? (
                <QuestionPractice 
                  questions={currentQuestions}
                  onComplete={(score) => completeSession(score)}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">İçerik hazırlanıyor...</p>
                </div>
              )}
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && aiInsights && (
            <div className="space-y-6">
              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Motivasyon</h3>
                </div>
                <p className="text-gray-800">{aiInsights.motivationalMessage}</p>
              </div>

              {/* Personalized Tips */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişiselleştirilmiş Öneriler</h3>
                <div className="space-y-4">
                  {aiInsights.personalizedTips.map((tip: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        tip.priority === 'high' 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-yellow-400 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                          <p className="text-gray-700 text-sm">{tip.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Forecast */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Bu Hafta Tahminleri</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Beklenen İlerleme</h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${aiInsights.weeklyForecast.expectedProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {aiInsights.weeklyForecast.expectedProgress}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Başarı İhtimali</h4>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">
                        {aiInsights.weeklyForecast.successProbability}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Zorlayıcı Konular</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.weeklyForecast.challengingTopics.map((topic: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                  <Timer className="h-4 w-4" />
                  <span>Önerilen haftalık çalışma süresi: {aiInsights.weeklyForecast.recommendedStudyTime} dakika</span>
                </div>
              </div>

              {/* Study Recommendations */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  <span>Akıllı Öneriler</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">📚 İçerik Önerisi</h4>
                    <p className="text-sm text-gray-700">
                      "Oran ve Orantı" konusunda video dersleri izledikten sonra 
                      interaktif alıştırmalar yapman öneriliyor.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">👥 Sosyal Öğrenme</h4>
                    <p className="text-sm text-gray-700">
                      Sınıf arkadaşlarınla grup çalışması yaparak 
                      öğrenme hızını %25 artırabilirsin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && progress && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-3">Geliştirilmesi Gereken Alanlar</h4>
                  {progress.weakAreas.length > 0 ? (
                    <ul className="space-y-2">
                      {progress.weakAreas.map((area, index) => (
                        <li key={index} className="text-red-800">{area}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-700">Harika! Zayıf alan bulunmuyor.</p>
                  )}
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Güçlü Alanlar</h4>
                  {progress.strongAreas.length > 0 ? (
                    <ul className="space-y-2">
                      {progress.strongAreas.map((area, index) => (
                        <li key={index} className="text-green-800">{area}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-700">Daha fazla çalışarak güçlü alanlar oluşturun.</p>
                  )}
                </div>
              </div>

              {progress.aiInsights && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">AI Analizi</h4>
                  <p className="text-blue-800">{progress.aiInsights}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Settings Modal */}
      <AISettingsModal 
        isOpen={showAISettings} 
        onClose={() => setShowAISettings(false)} 
      />
    </div>
  );
};

// Question Practice Component
interface QuestionPracticeProps {
  questions: GeneratedQuestion[];
  onComplete: (score: number) => void;
}

const QuestionPractice: React.FC<QuestionPracticeProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleComplete = () => {
    const score = calculateScore();
    onComplete(score);
  };

  if (showResults) {
    const score = calculateScore();
    const correctCount = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;

    return (
      <div className="text-center space-y-6">
        <div className="bg-primary-50 p-8 rounded-lg">
          <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tebrikler!</h3>
          <p className="text-lg text-gray-700 mb-4">
            {correctCount}/{questions.length} doğru cevap
          </p>
          <div className="text-3xl font-bold text-primary-600">{score}%</div>
        </div>
        
        <button
          onClick={handleComplete}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
        >
          Oturumu Tamamla
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Soru {currentQuestionIndex + 1}/{questions.length}
        </h3>
        <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
          {currentQuestion.topic}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.question}
        </h4>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          <span>{currentQuestionIndex === questions.length - 1 ? 'Bitir' : 'Sonraki'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AILearningPlan;