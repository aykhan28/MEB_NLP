import React, { useState, useEffect } from 'react';
import { Calendar, Target, Play, CheckCircle, Clock, Brain, BookOpen, Video, Loader, Star, TrendingUp, Award, Users, Lightbulb, Settings, RefreshCw, Zap, ChevronRight, BarChart3 } from 'lucide-react';
import { mockLearningPlan } from '../data/mockData';
import { googleAIService } from '../services/googleAI';
import VideoLearning from './VideoLearning';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

const LearningPlan: React.FC = () => {
  const [completedContent, setCompletedContent] = useState<string[]>(
    mockLearningPlan.recommendedContent.filter(c => c.completed).map(c => c.id)
  );
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [contentData, setContentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | 'reading'>('visual');
  const [studyGoals, setStudyGoals] = useState({
    dailyMinutes: 60,
    weeklyTopics: 3,
    monthlyTests: 4
  });
  const [personalizedPlan, setPersonalizedPlan] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    generatePersonalizedInsights();
  }, [completedContent, learningStyle]);

  const generatePersonalizedInsights = async () => {
    setIsGeneratingPlan(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = {
        currentLevel: 'Orta',
        strongSubjects: ['Geometri', 'Sayılar'],
        weakSubjects: ['Cebir', 'Olasılık'],
        recommendedPath: [
          { topic: 'Doğrusal Denklemler', priority: 'high', estimatedTime: '3 gün' },
          { topic: 'Geometrik Şekiller', priority: 'medium', estimatedTime: '2 gün' },
          { topic: 'Oran-Orantı', priority: 'low', estimatedTime: '1 gün' }
        ],
        studyTips: [
          'Görsel öğrenme stiline uygun diyagramlar kullan',
          'Günde 45-60 dakika çalışma idealdir',
          'Haftada 2-3 kez test çöz',
          'Zayıf konulara %60 daha fazla zaman ayır'
        ],
        nextMilestone: {
          title: 'Cebir Temelleri',
          progress: 45,
          deadline: '2 hafta',
          tasks: 4
        }
      };
      
      setPersonalizedPlan(insights);
    } catch (error) {
      console.error('AI analiz hatası:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const startContent = async (content: any) => {
    setIsLoading(true);
    setActiveContent(content.id);
    
    try {
      if (content.type === 'video') {
        setContentData({
          type: 'video',
          data: { 
            topic: content.achievement,
            title: content.title,
            duration: content.duration,
            difficulty: content.difficulty
          }
        });
      } else if (content.type === 'reading') {
        // Enhanced content generation
        const explanation = await googleAIService.generateConceptExplanation(content.achievement);
        setContentData({
          type: 'explanation',
          data: {
            ...explanation,
            title: content.title,
            learningStyle,
            examples: generateExamples(content.achievement),
            keyPoints: generateKeyPoints(content.achievement)
          }
        });
      } else if (content.type === 'exercise' || content.type === 'interactive') {
        const questions = await googleAIService.generateQuestions(
          content.achievement,
          content.difficulty,
          content.type === 'interactive' ? 8 : 5
        );
        setContentData({
          type: 'questions',
          data: {
            ...questions,
            title: content.title,
            adaptiveMode: true,
            hints: generateHints(content.achievement)
          }
        });
      }
    } catch (error) {
      console.error('İçerik yüklenirken hata:', error);
      setContentData({
        type: 'error',
        message: 'İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateExamples = (topic: string) => {
    const examples = {
      'Doğrusal Denklemler': [
        { problem: '2x + 5 = 13', solution: 'x = 4', explanation: 'Her iki taraftan 5 çıkar, sonra 2\'ye böl' },
        { problem: '3x - 7 = 14', solution: 'x = 7', explanation: 'Her iki tarafa 7 ekle, sonra 3\'e böl' }
      ],
      'Geometrik Şekiller': [
        { problem: 'Karenin alanı = ?', solution: 'kenar²', explanation: 'Kenar uzunluğunun karesi' },
        { problem: 'Dairenin çevresi = ?', solution: '2πr', explanation: '2 × π × yarıçap' }
      ]
    };
    return examples[topic as keyof typeof examples] || [];
  };

  const generateKeyPoints = (topic: string) => {
    const keyPoints = {
      'Doğrusal Denklemler': [
        'Eşitliğin her iki tarafına aynı işlem yapılabilir',
        'Bilinmeyeni yalnız bırakmak amaçtır',
        'İşlem sırası önemlidir'
      ],
      'Geometrik Şekiller': [
        'Her şeklin kendine özgü formülleri vardır',
        'Alan ve çevre farklı kavramlardır',
        'Birimler önemlidir'
      ]
    };
    return keyPoints[topic as keyof typeof keyPoints] || [];
  };

  const generateHints = (topic: string) => {
    return [
      `${topic} konusunda temel kavramları hatırla`,
      'Adım adım çözmeye çalış',
      'Benzer örnekleri düşün'
    ];
  };

  const completeContent = (contentId: string, score?: number) => {
    setCompletedContent(prev => [...prev, contentId]);
    setActiveContent(null);
    setContentData(null);
    
    // Save score and update analytics
    if (score !== undefined) {
      const contentScores = JSON.parse(localStorage.getItem('content_scores') || '{}');
      contentScores[contentId] = score;
      localStorage.setItem('content_scores', JSON.stringify(contentScores));
      
      // Update learning analytics
      const analytics = JSON.parse(localStorage.getItem('learning_analytics') || '{}');
      analytics[contentId] = {
        completedAt: new Date().toISOString(),
        score,
        timeSpent: Math.floor(Math.random() * 30) + 15, // Simulated
        attempts: 1
      };
      localStorage.setItem('learning_analytics', JSON.stringify(analytics));
    }

    // Add activity
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: 'study',
        title: 'İçerik Tamamlandı',
        description: `${mockLearningPlan.recommendedContent.find(c => c.id === contentId)?.title} tamamlandı`,
        duration: mockLearningPlan.recommendedContent.find(c => c.id === contentId)?.duration || 30,
        score,
        subject: 'Matematik'
      });
    }

    // Regenerate insights after completion
    generatePersonalizedInsights();
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'exercise': return Target;
      case 'reading': return BookOpen;
      case 'interactive': return Brain;
      default: return BookOpen;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video Ders';
      case 'exercise': return 'Alıştırma';
      case 'reading': return 'Konu Anlatımı';
      case 'interactive': return 'İnteraktif Çalışma';
      default: return 'İçerik';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      default: return 'Bilinmiyor';
    }
  };

  const completedCount = completedContent.length;
  const totalContent = mockLearningPlan.recommendedContent.length;
  const progressPercentage = Math.round((completedCount / totalContent) * 100);

  // Learning analytics data
  const weeklyProgressData = [
    { day: 'Pzt', completed: 2, target: 3 },
    { day: 'Sal', completed: 3, target: 3 },
    { day: 'Çar', completed: 1, target: 3 },
    { day: 'Per', completed: 4, target: 3 },
    { day: 'Cum', completed: 2, target: 3 },
    { day: 'Cmt', completed: 0, target: 2 },
    { day: 'Paz', completed: 1, target: 2 }
  ];

  const subjectDistribution = [
    { subject: 'Cebir', value: 35, color: '#3B82F6' },
    { subject: 'Geometri', value: 25, color: '#10B981' },
    { subject: 'Sayılar', value: 20, color: '#F59E0B' },
    { subject: 'Olasılık', value: 20, color: '#EF4444' }
  ];

  // Active content viewer
  if (activeContent && contentData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <EnhancedContentViewer 
          contentData={contentData}
          onComplete={(score) => completeContent(activeContent, score)}
          onBack={() => {
            setActiveContent(null);
            setContentData(null);
          }}
          isLoading={isLoading}
          learningStyle={learningStyle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <Brain className="h-8 w-8" />
              <span>Kişisel Öğrenme Planın</span>
            </h2>
            <p className="text-primary-100 mb-4">
              AI tarafından senin için özel olarak hazırlandı
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Akıllı Uyarlama</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Bu Hafta</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">{progressPercentage}% Tamamlandı</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={generatePersonalizedInsights}
              disabled={isGeneratingPlan}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {isGeneratingPlan ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
              <span>Planı Yenile</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      {showAIInsights && personalizedPlan && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Destekli Kişisel Analiz</span>
            </h3>
            <button
              onClick={() => setShowAIInsights(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Status */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">📊 Mevcut Seviye</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{personalizedPlan.currentLevel}</div>
                <p className="text-blue-700 text-sm">Matematik Seviyesi</p>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Güçlü:</span>
                  <span className="text-blue-900 font-medium">{personalizedPlan.strongSubjects.join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Gelişim:</span>
                  <span className="text-blue-900 font-medium">{personalizedPlan.weakSubjects.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">🎯 Sonraki Hedef</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-green-800">{personalizedPlan.nextMilestone.title}</h5>
                  <p className="text-green-600 text-sm">{personalizedPlan.nextMilestone.deadline} içinde</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-green-700 mb-1">
                    <span>İlerleme</span>
                    <span>{personalizedPlan.nextMilestone.progress}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${personalizedPlan.nextMilestone.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-green-700 text-sm">{personalizedPlan.nextMilestone.tasks} görev kaldı</p>
              </div>
            </div>

            {/* Personalized Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-3">💡 Kişisel İpuçları</h4>
              <div className="space-y-2">
                {personalizedPlan.studyTips.slice(0, 3).map((tip: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-purple-800 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalık İlerleme</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} name="Tamamlanan" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Hedef" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Konu Dağılımı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Oran']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {subjectDistribution.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Öğrenme Hedeflerin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{studyGoals.dailyMinutes}</p>
            <p className="text-blue-600 text-sm">Günlük Dakika</p>
            <div className="mt-2">
              <input
                type="range"
                min="30"
                max="120"
                value={studyGoals.dailyMinutes}
                onChange={(e) => setStudyGoals({...studyGoals, dailyMinutes: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{studyGoals.weeklyTopics}</p>
            <p className="text-green-600 text-sm">Haftalık Konu</p>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="5"
                value={studyGoals.weeklyTopics}
                onChange={(e) => setStudyGoals({...studyGoals, weeklyTopics: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{studyGoals.monthlyTests}</p>
            <p className="text-purple-600 text-sm">Aylık Test</p>
            <div className="mt-2">
              <input
                type="range"
                min="2"
                max="8"
                value={studyGoals.monthlyTests}
                onChange={(e) => setStudyGoals({...studyGoals, monthlyTests: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">İçerik İlerlemen</h3>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Genel İlerleme</span>
            <span>{completedCount}/{totalContent}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-900">{mockLearningPlan.weeklyGoals.length} Hedef</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-900">{completedCount} Tamamlandı</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-yellow-900">{totalContent - completedCount} Bekliyor</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-900">AI Destekli</p>
          </div>
        </div>
      </div>

      {/* Recommended Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Önerilen İçerikler</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Öğrenme Stili:</label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="visual">Görsel</option>
              <option value="auditory">İşitsel</option>
              <option value="kinesthetic">Hareket</option>
              <option value="reading">Okuma/Yazma</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {mockLearningPlan.recommendedContent.map((content, index) => {
            const Icon = getContentIcon(content.type);
            const isCompleted = completedContent.includes(content.id);
            const isRecommended = personalizedPlan?.recommendedPath.some((item: any) => 
              content.achievement.includes(item.topic)
            );
            
            return (
              <div 
                key={content.id} 
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isRecommended
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isRecommended
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-primary-100 text-primary-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{content.title}</h4>
                        {isRecommended && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            AI Önerisi
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getContentTypeLabel(content.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                          {getDifficultyLabel(content.difficulty)}
                        </span>
                      </div>
                      
                                             <p className="text-gray-600 text-sm mb-3">{content.achievement} konusunda {getContentTypeLabel(content.type).toLowerCase()}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{content.duration} dakika</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{content.achievement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {isCompleted ? (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                        ✅ Tamamlandı
                      </div>
                    ) : (
                      <button
                        onClick={() => startContent(content)}
                        disabled={isLoading}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Başla</span>
                      </button>
                    )}
                    
                    {isRecommended && (
                      <div className="text-center">
                        <Star className="h-4 w-4 text-yellow-500 mx-auto" />
                        <p className="text-xs text-purple-600 mt-1">Öncelikli</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bu Haftaki Çalışma Programın</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => {
            const isToday = index === new Date().getDay() - 1;
            const hasSchedule = index < 5; // Weekdays have schedule
            
            return (
              <div
                key={day}
                className={`p-3 rounded-lg border-2 ${
                  isToday 
                    ? 'border-primary-500 bg-primary-50' 
                    : hasSchedule
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-100 bg-gray-25'
                }`}
              >
                <h4 className={`font-medium text-sm mb-2 ${
                  isToday ? 'text-primary-900' : 'text-gray-900'
                }`}>{day}</h4>
                {hasSchedule ? (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 bg-white p-1 rounded">
                      14:00 - Matematik
                    </div>
                    <div className="text-xs text-gray-600 bg-white p-1 rounded">
                      15:30 - Test
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Dinlenme</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Enhanced Content Viewer Component
interface EnhancedContentViewerProps {
  contentData: any;
  onComplete: (score?: number) => void;
  onBack: () => void;
  isLoading: boolean;
  learningStyle: string;
}

const EnhancedContentViewer: React.FC<EnhancedContentViewerProps> = ({ 
  contentData, 
  onComplete, 
  onBack, 
  isLoading,
  learningStyle 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">İçerik Hazırlanıyor</h3>
        <p className="text-gray-600">AI tarafından kişiselleştiriliyor...</p>
      </div>
    );
  }

  if (contentData.type === 'error') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-red-600 mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hata Oluştu</h3>
        <p className="text-gray-600 mb-4">{contentData.message}</p>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">{contentData.data.title}</h2>
            <p className="text-primary-100">
              {learningStyle === 'visual' ? '👀 Görsel' : 
               learningStyle === 'auditory' ? '👂 İşitsel' : 
               learningStyle === 'kinesthetic' ? '🤲 Hareket' : '📖 Okuma'} 
              {' '}stiline uyarlandı
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Geri Dön
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {contentData.type === 'explanation' && (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3>Konu Açıklaması</h3>
              <p>{contentData.data.explanation || 'Detaylı açıklama hazırlanıyor...'}</p>
            </div>

            {contentData.data.keyPoints && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">🔑 Anahtar Noktalar</h4>
                <ul className="space-y-2">
                  {contentData.data.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="text-blue-800 text-sm flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contentData.data.examples && contentData.data.examples.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">📝 Örnekler</h4>
                <div className="space-y-3">
                  {contentData.data.examples.map((example: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <p className="font-medium text-green-800">{example.problem}</p>
                      <p className="text-green-700 text-sm mt-1">Çözüm: {example.solution}</p>
                      <p className="text-green-600 text-xs mt-1">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {contentData.type === 'video' && (
          <div className="text-center space-y-4">
            <div className="bg-gray-100 rounded-lg p-8">
              <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Dersi</h3>
              <p className="text-gray-600">{contentData.data.topic} konusunda video içerik</p>
              <p className="text-sm text-gray-500 mt-2">Süre: {contentData.data.duration} dakika</p>
            </div>
          </div>
        )}

        {contentData.type === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">İnteraktif Sorular</h3>
            <p className="text-gray-600">AI destekli uyarlanabilir sorular hazırlanıyor...</p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">💡 İpuçları</h4>
              <ul className="space-y-1">
                {contentData.data.hints?.map((hint: string, index: number) => (
                  <li key={index} className="text-yellow-800 text-sm">• {hint}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📝 Notlarım</h3>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {showNotes ? 'Gizle' : 'Göster'}
          </button>
        </div>
        
        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bu konuyla ilgili notlarını buraya yazabilirsin..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        )}
      </div>

      {/* Complete Button */}
      <div className="text-center">
        <button
          onClick={() => onComplete(85)} // Simulated score
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Tamamla</span>
        </button>
      </div>
    </div>
  );
};

export default LearningPlan;