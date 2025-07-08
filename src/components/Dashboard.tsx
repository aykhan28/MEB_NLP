import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Award, BookOpen, Brain, ChevronRight, Play, CheckCircle, Video } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockAchievements, mockProgressData, mockTestResults } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStudySession, setActiveStudySession] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Haftalık ilerleme verilerini yükle
    const weeklyData = generateWeeklyProgress();
    setWeeklyProgress(weeklyData);
    
    // Son kazanımları yükle
    const achievements = loadRecentAchievements();
    setRecentAchievements(achievements);
    
    setIsLoading(false);
  };

  const generateWeeklyProgress = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
      const studyTime = Math.floor(Math.random() * 120) + 30; // 30-150 dk arası
      const completedTasks = Math.floor(Math.random() * 5) + 1; // 1-5 görev
      const score = Math.floor(Math.random() * 30) + 70; // 70-100 arası puan
      
      weekData.push({
        day: dayName,
        date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
        studyTime,
        completedTasks,
        score,
        isToday: i === 0
      });
    }
    
    return weekData;
  };

  const loadRecentAchievements = () => {
    return mockAchievements.map(achievement => ({
      ...achievement,
      recentActivity: generateRecentActivity(achievement),
      nextSteps: generateNextSteps(achievement)
    }));
  };

  const generateRecentActivity = (achievement: any) => {
    if (achievement.mastered) {
      return {
        type: 'completed',
        message: 'Kazanım tamamlandı! 🎉',
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        score: 85 + Math.floor(Math.random() * 15)
      };
    } else {
      const activities = [
        { type: 'study', message: 'Konu anlatımı izlendi', icon: BookOpen },
        { type: 'practice', message: 'Alıştırma yapıldı', icon: Target },
        { type: 'test', message: 'Test çözüldü', icon: Award }
      ];
      
      const activity = activities[Math.floor(Math.random() * activities.length)];
      return {
        ...activity,
        date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        score: 60 + Math.floor(Math.random() * 30)
      };
    }
  };

  const generateNextSteps = (achievement: any) => {
    if (achievement.mastered) {
      return [
        'İleri seviye konulara geç',
        'Benzer konuları pekiştir',
        'Diğer öğrencilere yardım et'
      ];
    } else {
      const steps = [
        'Temel kavramları tekrar et',
        'Daha fazla örnek çöz',
        'Video dersleri izle',
        'Öğretmeninden yardım al',
        'Grup çalışması yap'
      ];
      
      return steps.slice(0, 2 + Math.floor(Math.random() * 2));
    }
  };

  const totalAchievements = mockAchievements.length;
  const masteredAchievements = mockAchievements.filter(a => a.mastered).length;
  const averageProgress = Math.round(mockAchievements.reduce((sum, a) => sum + a.progress, 0) / totalAchievements);
  const lastTestScore = mockTestResults[0]?.score || 0;
  
  const achievementData = [
    { name: 'Tamamlanan', value: masteredAchievements, color: '#10B981' },
    { name: 'Devam Eden', value: totalAchievements - masteredAchievements, color: '#F59E0B' }
  ];

  const stats = [
    {
      title: 'Son Test Skoru',
      value: `${lastTestScore}%`,
      icon: TrendingUp,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Tamamlanan Kazanım',
      value: `${masteredAchievements}/${totalAchievements}`,
      icon: Target,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Ortalama İlerleme',
      value: `${averageProgress}%`,
      icon: Award,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Haftalık Hedef',
      value: '3/5',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '60%',
      changeType: 'neutral'
    }
  ];

  const weeklyStats = {
    totalStudyTime: weeklyProgress.reduce((sum, day) => sum + day.studyTime, 0),
    totalTasks: weeklyProgress.reduce((sum, day) => sum + day.completedTasks, 0),
    averageScore: Math.round(weeklyProgress.reduce((sum, day) => sum + day.score, 0) / weeklyProgress.length),
    streak: weeklyProgress.filter(day => day.completedTasks > 0).length
  };

  const handleStartStudy = (achievement: any) => {
    // Create a study session for the achievement
    const studySession = {
      id: achievement.id,
      title: achievement.title,
      subject: achievement.subject,
      description: achievement.description,
      progress: achievement.progress,
      mastered: achievement.mastered,
      startTime: new Date().toISOString(),
      activities: [
        {
          type: 'reading',
          title: `${achievement.title} - Konu Anlatımı`,
          duration: 15,
          completed: false
        },
        {
          type: 'video',
          title: `${achievement.title} - Video Ders`,
          duration: 20,
          completed: false
        },
        {
          type: 'exercise',
          title: `${achievement.title} - Alıştırmalar`,
          duration: 25,
          completed: false
        },
        {
          type: 'test',
          title: `${achievement.title} - Değerlendirme`,
          duration: 10,
          completed: false
        }
      ]
    };
    
    setActiveStudySession(studySession);
    
    // Add activity to tracker
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: 'study',
        title: `${achievement.title} Çalışması Başladı`,
        description: `${achievement.subject} - ${achievement.title} konusunda çalışmaya başlandı`,
        subject: achievement.subject,
        duration: 70
      });
    }
  };

  const handleCompleteActivity = (activityIndex: number) => {
    if (!activeStudySession) return;
    
    const updatedSession = { ...activeStudySession };
    updatedSession.activities[activityIndex].completed = true;
    setActiveStudySession(updatedSession);
    
    const activity = updatedSession.activities[activityIndex];
    
    // Add activity completion
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: activity.type,
        title: activity.title,
        description: `${activity.title} tamamlandı`,
        subject: activeStudySession.subject,
        duration: activity.duration
      });
    }
    
    // Check if all activities completed
    const allCompleted = updatedSession.activities.every((act: any) => act.completed);
    if (allCompleted) {
      setTimeout(() => {
        setActiveStudySession(null);
        // Update achievement progress
        const achievement = recentAchievements.find(a => a.id === activeStudySession.id);
        if (achievement && !achievement.mastered) {
          achievement.progress = Math.min(100, achievement.progress + 15);
          if (achievement.progress >= 100) {
            achievement.mastered = true;
          }
          setRecentAchievements([...recentAchievements]);
        }
      }, 2000);
    }
  };

  const handleEndStudySession = () => {
    setActiveStudySession(null);
  };

  // Study Session Component
  if (activeStudySession) {
    const completedCount = activeStudySession.activities.filter((act: any) => act.completed).length;
    const totalCount = activeStudySession.activities.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Study Session Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">📚 Çalışma Seansı</h2>
              <p className="text-primary-100 mb-2">{activeStudySession.title}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {activeStudySession.subject}
                </span>
                <span className="text-sm">
                  {completedCount}/{totalCount} Tamamlandı
                </span>
              </div>
            </div>
            <button
              onClick={handleEndStudySession}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              Çıkış
            </button>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Study Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeStudySession.activities.map((activity: any, index: number) => {
            const Icon = activity.type === 'reading' ? BookOpen :
                       activity.type === 'video' ? Video :
                       activity.type === 'exercise' ? Target :
                       Award;
            
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-200 ${
                  activity.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-100 hover:border-primary-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    activity.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-primary-100 text-primary-600'
                  }`}>
                    {activity.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.duration} dakika</p>
                  </div>
                </div>
                
                {activity.completed ? (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                    ✅ Tamamlandı
                  </div>
                ) : (
                  <button
                    onClick={() => handleCompleteActivity(index)}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Başla</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Study Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Çalışma İpuçları</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Her aktiviteyi sırayla tamamlayın</li>
            <li>• Anlamadığınız yerleri not alın</li>
            <li>• Mola vermekten çekinmeyin</li>
            <li>• Örnekleri dikkatlice inceleyin</li>
          </ul>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Merhaba {user?.name?.split(' ')[0] || 'Öğrenci'}! 👋</h2>
            <p className="text-primary-100 mb-4">
              Bugün {recentAchievements.filter(a => !a.mastered).length} kazanım üzerinde çalışmaya devam edebilirsin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm">AI Destekli Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Kişisel İçerik</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Studying"
              className="w-32 h-32 rounded-xl object-cover opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">son hafta</span>
                </div>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Progress Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Haftalık İlerleme</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{weeklyStats.totalStudyTime} dk</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>{weeklyStats.totalTasks} görev</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>{weeklyStats.averageScore}% ort.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weeklyProgress.map((day, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                day.isToday 
                  ? 'bg-primary-100 border-2 border-primary-500' 
                  : day.completedTasks > 0 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
              <div className="text-xs text-gray-500 mb-2">{day.date}</div>
              
              {day.completedTasks > 0 ? (
                <div className="space-y-1">
                  <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                    day.isToday ? 'bg-primary-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {day.completedTasks}
                  </div>
                  <div className="text-xs text-gray-600">{day.studyTime}dk</div>
                  <div className={`text-xs font-medium ${
                    day.score >= 80 ? 'text-green-600' : day.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {day.score}%
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full mx-auto bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">-</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Bu Hafta Hedefin</h4>
              <p className="text-sm text-blue-700">5 günde en az 3 görev tamamla</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.streak}/5</div>
              <div className="text-sm text-blue-600">gün aktif</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyStats.streak / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">İlerleme Grafiği</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
                  formatter={(value) => [`${value}%`, 'Skor']}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievement Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kazanım Dağılımı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={achievementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {achievementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Kazanım']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {achievementData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Son Kazanımlar</h3>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
            <span>Tümünü Gör</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {recentAchievements.slice(0, 3).map((achievement, index) => (
            <div 
              key={achievement.id} 
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {achievement.subject}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  
                  {/* Son Aktivite */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`p-1 rounded ${
                      achievement.recentActivity.type === 'completed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {achievement.recentActivity.type === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{achievement.recentActivity.message}</span>
                    <span className="text-xs text-gray-500">({achievement.recentActivity.date})</span>
                  </div>
                  
                  {/* İlerleme Çubuğu */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>İlerleme</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.mastered ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Sonraki Adımlar */}
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Sonraki Adımlar:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {achievement.nextSteps.slice(0, 2).map((step: string, stepIndex: number) => (
                        <li key={stepIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  {achievement.mastered ? (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium text-center">
                      ✅ Tamamlandı
                    </div>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium text-center">
                      🔄 Devam Ediyor
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleStartStudy(achievement)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Play className="h-4 w-4" />
                    <span>Çalış</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Önerileri</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📈 Bu Hafta</h4>
            <p className="text-gray-800 text-sm">
              {weeklyStats.streak >= 3 
                ? 'Harika gidiyorsun! Düzenli çalışma alışkanlığın gelişiyor.' 
                : 'Daha düzenli çalışarak hedefine ulaşabilirsin. Günde 30 dakika yeterli.'}
            </p>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Öncelik</h4>
            <p className="text-gray-800 text-sm">
              {recentAchievements.find(a => !a.mastered)?.title || 'Tüm kazanımlar'} konusuna 
              odaklanman öneriliyor. Bu hafta bu konuyu tamamlayabilirsin.
            </p>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">⏰ En İyi Zaman</h4>
            <p className="text-gray-800 text-sm">
              Performans verilerine göre öğleden sonra 14:00-16:00 arası 
              en verimli çalışma saatlerin.
            </p>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">💡 Strateji</h4>
            <p className="text-gray-800 text-sm">
              Öğrenme tarzın görsel-analitik. İnteraktif içerikleri 
              video derslerden önce denemen daha etkili olacak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;