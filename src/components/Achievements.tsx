import React, { useState } from 'react';
import { Trophy, TrendingUp, Target, Brain, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { mockAchievements } from '../data/mockData';

const Achievements: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');

  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler'];
  
  const filteredAchievements = mockAchievements.filter(achievement => {
    const subjectMatch = achievement.subject === selectedSubject;
    const statusMatch = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? achievement.mastered :
      !achievement.mastered;
    
    return subjectMatch && statusMatch;
  });

  const stats = {
    total: mockAchievements.length,
    completed: mockAchievements.filter(a => a.mastered).length,
    inProgress: mockAchievements.filter(a => !a.mastered).length,
    averageProgress: Math.round(mockAchievements.reduce((sum, a) => sum + a.progress, 0) / mockAchievements.length)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Kazanım Durumun</h2>
            <p className="text-primary-100 mb-4">
              MEB müfredatına göre bireysel ilerleme takibin
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span className="text-sm">{stats.completed} Tamamlandı</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span className="text-sm">{stats.inProgress} Devam Ediyor</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-center">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.averageProgress}%</div>
              <div className="text-sm text-primary-100">Ortalama İlerleme</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam Kazanım</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-600">Tamamlanan</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-sm text-gray-600">Devam Eden</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
          <p className="text-sm text-gray-600">Ortalama</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kazanımları Filtrele</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedSubject === subject
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'completed', label: 'Tamamlanan' },
              { key: 'in-progress', label: 'Devam Eden' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filterStatus === filter.key
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {filteredAchievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.mastered 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {achievement.mastered ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>İlerleme Durumu</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        achievement.mastered 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-primary-500 to-primary-600'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {achievement.subject}
                    </span>
                    <span className="text-sm text-gray-500">
                      Son güncelleme: {new Date(achievement.lastUpdated).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {achievement.mastered ? (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                        <Trophy className="h-4 w-4" />
                        <span>Tamamlandı</span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200">
                          Çalışmaya Devam Et
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1">
                          <Brain className="h-4 w-4" />
                          <span>AI Önerisi</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kazanım Bulunamadı</h3>
          <p className="text-gray-600">Seçili filtrelere uygun kazanım bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;