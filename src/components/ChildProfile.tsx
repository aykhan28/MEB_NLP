import React, { useState, useContext, useEffect } from 'react';
import { User, Calendar, Book, Award, Clock, School, MapPin, Phone, Mail, Edit, ChevronLeft } from 'lucide-react';
import { ChildrenContext } from '../models/Child';
import { getHomeworkFromLocalStorage } from '../models/Homework';
import { getAchievementsFromLocalStorage } from '../models/Achievement';
import { getDevelopmentRecordsFromLocalStorage } from '../models/Development';

interface ChildProfileProps {
  childId: string;
  onBack: () => void;
}

const ChildProfile: React.FC<ChildProfileProps> = ({ childId, onBack }) => {
  const { getChildById } = useContext(ChildrenContext);
  const [child, setChild] = useState<any>(null);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [developmentRecords, setDevelopmentRecords] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    // Çocuk bilgilerini al
    const childData = getChildById(childId);
    if (childData) {
      setChild(childData);
    }

    // Ödevleri al
    const allHomeworks = getHomeworkFromLocalStorage();
    const childHomeworks = allHomeworks.filter(hw => hw.childId === childId);
    setHomeworks(childHomeworks);

    // Başarıları al
    const allAchievements = getAchievementsFromLocalStorage();
    const childAchievements = allAchievements.filter(ach => ach.childId === childId);
    setAchievements(childAchievements);

    // Gelişim kayıtlarını al
    const allDevelopmentRecords = getDevelopmentRecordsFromLocalStorage();
    const childDevelopmentRecords = allDevelopmentRecords.filter(rec => rec.childId === childId);
    setDevelopmentRecords(childDevelopmentRecords);
  }, [childId, getChildById]);

  if (!child) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-indigo-100 p-4 rounded-full inline-block mb-6">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Profil Bulunamadı</h3>
          
          <p className="text-gray-600 mb-6">
            İstenen çocuk profili bulunamadı. Lütfen geçerli bir profil seçin.
          </p>
          
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Özet Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tamamlanan Ödevler</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {homeworks.filter(hw => hw.status === 'completed').length}/{homeworks.length}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                    <Book className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${homeworks.length ? (homeworks.filter(hw => hw.status === 'completed').length / homeworks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Başarılar</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{achievements.length}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-purple-600 font-medium">
                    {achievements.filter(a => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} yeni başarı (son 7 gün)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Not</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {developmentRecords.length > 0 
                        ? Math.round(developmentRecords.reduce((sum, rec) => sum + rec.score, 0) / developmentRecords.length) 
                        : 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-blue-600 font-medium">
                    {developmentRecords.length} kayıt üzerinden
                  </span>
                </div>
              </div>
            </div>

            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ad Soyad</p>
                      <p className="font-medium text-gray-900">{child.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <School className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Okul</p>
                      <p className="font-medium text-gray-900">{child.school}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Book className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sınıf</p>
                      <p className="font-medium text-gray-900">{child.grade}. Sınıf</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adres</p>
                      <p className="font-medium text-gray-900">Bilgi girilmemiş</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <p className="font-medium text-gray-900">Bilgi girilmemiş</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <p className="font-medium text-gray-900">Bilgi girilmemiş</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                  onClick={() => alert('Profil düzenleme özelliği yakında eklenecektir!')}
                >
                  <Edit className="h-4 w-4" />
                  <span>Düzenle</span>
                </button>
              </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
              
              {homeworks.length === 0 && achievements.length === 0 && developmentRecords.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-gray-700 font-medium">Henüz Aktivite Yok</h3>
                  <p className="text-gray-500 text-sm mt-1">Çocuğunuzun aktiviteleri burada görüntülenecektir.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Son eklenen ödevler */}
                  {homeworks.slice(0, 2).map(homework => (
                    <div key={homework.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-lg mr-3">
                          <Book className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{homework.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(homework.dueDate).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{homework.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Son eklenen başarılar */}
                  {achievements.slice(0, 2).map(achievement => (
                    <div key={achievement.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(achievement.date).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'homeworks':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödevler</h3>
            
            {homeworks.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                  <Book className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-medium">Henüz Ödev Yok</h3>
                <p className="text-gray-500 text-sm mt-1">Çocuğunuzun ödevleri burada görüntülenecektir.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {homeworks.map(homework => (
                  <div key={homework.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${
                        homework.status === 'completed' ? 'bg-green-100' : 
                        homework.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        <Book className={`h-5 w-5 ${
                          homework.status === 'completed' ? 'text-green-600' : 
                          homework.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{homework.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            homework.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            homework.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {homework.status === 'completed' ? 'Tamamlandı' : 
                             homework.status === 'pending' ? 'Bekliyor' : 'Gecikmiş'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{homework.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>Teslim: {new Date(homework.dueDate).toLocaleDateString('tr-TR')}</span>
                          <span>{homework.subject}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'achievements':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Başarılar</h3>
            
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                  <Award className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-medium">Henüz Başarı Yok</h3>
                <p className="text-gray-500 text-sm mt-1">Çocuğunuzun başarıları burada görüntülenecektir.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(achievement.date).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>{achievement.subject}</span>
                          <span>{achievement.teacher}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'development':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelişim Takibi</h3>
            
            {developmentRecords.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-gray-700 font-medium">Henüz Gelişim Kaydı Yok</h3>
                <p className="text-gray-500 text-sm mt-1">Çocuğunuzun gelişim kayıtları burada görüntülenecektir.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {developmentRecords.map(record => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{record.subject}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Not: {record.score}/100</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.score >= 85 ? 'bg-green-100 text-green-800' : 
                            record.score >= 70 ? 'bg-blue-100 text-blue-800' : 
                            record.score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.score >= 85 ? 'Çok İyi' : 
                             record.score >= 70 ? 'İyi' : 
                             record.score >= 50 ? 'Orta' : 'Geliştirilmeli'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{record.comments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1 mr-4 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Geri</span>
          </button>
          <h2 className="text-2xl font-bold">Profil Detayları</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-white p-4 rounded-full">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{child.name}</h3>
              <p className="text-indigo-100">{child.grade}. Sınıf · {child.school}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors duration-200"
              onClick={() => alert('Profil düzenleme özelliği yakında eklenecektir!')}
            >
              Profili Düzenle
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto">
          <button 
            className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Genel Bakış
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'homeworks' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('homeworks')}
          >
            Ödevler
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'achievements' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('achievements')}
          >
            Başarılar
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm flex-shrink-0 border-b-2 ${activeTab === 'development' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('development')}
          >
            Gelişim Takibi
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ChildProfile; 