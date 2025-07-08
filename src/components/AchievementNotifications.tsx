import React, { useState, useEffect, useContext } from 'react';
import { Award, AlertCircle, Star, Trophy, Target, BookOpen, Bell, Filter } from 'lucide-react';
import { getAchievementsFromLocalStorage } from '../models/Achievement';
import { ChildrenContext } from '../models/Child';

const AchievementNotifications: React.FC = () => {
  const { children } = useContext(ChildrenContext);
  const [filterType, setFilterType] = useState<string>('all');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    // LocalStorage'dan başarı bildirimlerini yükle
    const savedAchievements = getAchievementsFromLocalStorage();
    setAchievements(savedAchievements);
    
    // İlk çocuğu varsayılan olarak seç
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  // Seçilen çocuğa ait başarıları filtrele
  const childAchievements = achievements.filter(achievement => 
    achievement.childId === selectedChildId
  );

  const filteredAchievements = childAchievements.filter(achievement => {
    if (filterType !== 'all' && achievement.type !== filterType) return false;
    return true;
  });

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'exam':
        return <Trophy className="h-6 w-6" />;
      case 'goal':
        return <Target className="h-6 w-6" />;
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'competition':
        return <Star className="h-6 w-6" />;
      case 'habit':
        return <BookOpen className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'text-yellow-600';
      case 'goal':
        return 'text-blue-600';
      case 'award':
        return 'text-purple-600';
      case 'competition':
        return 'text-green-600';
      case 'habit':
        return 'text-orange-600';
      default:
        return 'text-purple-600';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-yellow-100 text-yellow-800';
      case 'goal':
        return 'bg-blue-100 text-blue-800';
      case 'award':
        return 'bg-purple-100 text-purple-800';
      case 'competition':
        return 'bg-green-100 text-green-800';
      case 'habit':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Başarı Bildirimleri</h2>
            <p className="text-purple-100 mb-4">
              Çocuğunuzun başarılarından anında haberdar olun.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="text-sm">Başarı Takibi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span className="text-sm">Anlık Bildirimler</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Award className="h-24 w-24 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Geliştirme Aşamasında</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Bu özellik şu anda geliştirme aşamasındadır. Aşağıda gösterilen veriler örnek amaçlıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label htmlFor="childSelector" className="block text-sm font-medium text-gray-700 mb-1">
            Çocuk Seçin
          </label>
          <select
            id="childSelector"
            value={selectedChildId || ''}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Başarı</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{childAchievements.length}</p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sınav Başarıları</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childAchievements.filter(a => a.type === 'exam').length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ödüller</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childAchievements.filter(a => a.type === 'award').length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hedef Başarıları</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childAchievements.filter(a => a.type === 'goal').length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Başarı Bildirimleri</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filtrele</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Başarı Türü
            </label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tümü</option>
              <option value="exam">Sınav Başarıları</option>
              <option value="award">Ödüller</option>
              <option value="goal">Hedef Başarıları</option>
              <option value="competition">Yarışmalar</option>
              <option value="habit">Alışkanlıklar</option>
            </select>
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-4">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                <Award className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-gray-700 font-medium">Başarı Bulunamadı</h3>
              <p className="text-gray-500 text-sm mt-1">Seçilen filtrelere uygun başarı bulunmamaktadır.</p>
            </div>
          ) : (
            filteredAchievements.map(achievement => (
              <div key={achievement.id} className={`${getBackgroundColor(achievement.type)} rounded-lg p-4`}>
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-white ${getIconColor(achievement.type)} mr-4`}>
                    {getIconComponent(achievement.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <span className="text-xs">
                        {new Date(achievement.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{achievement.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span>{achievement.subject}</span>
                      <span>{achievement.teacher}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Anlık Bildirimler</h4>
                <p className="text-sm text-gray-600 mt-1">Yeni başarılar kazanıldığında anlık bildirimler alın.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Başarı Rozet Sistemi</h4>
                <p className="text-sm text-gray-600 mt-1">Çocuğunuzun kazandığı başarı rozetlerini görüntüleyin.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Başarı Paylaşımı</h4>
                <p className="text-sm text-gray-600 mt-1">Çocuğunuzun başarılarını sosyal medyada paylaşın.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotifications; 