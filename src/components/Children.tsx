import React, { useState, useContext } from 'react';
import { Calendar, Clock, BookOpen, Award, Brain, AlertCircle, Users, MessageCircle, FileText, BarChart4, Backpack, PlusCircle, X, ChevronRight } from 'lucide-react';
import ComingSoonFeature from './ComingSoonFeature';
import { ChildrenContext } from '../models/Child';
import ChildProfile from './ChildProfile';

const Children: React.FC = () => {
  const { children: childrenData, addChild } = useContext(ChildrenContext);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [childSchool, setChildSchool] = useState('');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    // Context API aracılığıyla çocuk ekleme
    addChild({
      name: childName,
      grade: childGrade,
      school: childSchool
    });
    
    alert(`Çocuk başarıyla eklendi.\n\nEklenen çocuk bilgileri:\nAd: ${childName}\nSınıf: ${childGrade}\nOkul: ${childSchool}`);
    setShowAddChildForm(false);
    setChildName('');
    setChildGrade('');
    setChildSchool('');
  };

  // Profil görüntüleme işlemi
  const handleBackFromProfile = () => {
    setSelectedChildId(null);
  };

  // Eğer bir çocuk seçilmişse profil detaylarını göster
  if (selectedChildId) {
    return <ChildProfile childId={selectedChildId} onBack={handleBackFromProfile} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Çocuklarım</h2>
            <p className="text-purple-100 mb-4">
              Çocuklarınızın eğitim yolculuğunu takip edin ve destekleyin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm">Kişiselleştirilmiş Eğitim</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="text-sm">Başarı Takibi</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Users className="h-24 w-24 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Add Child Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Çocuk Ekle</h3>
          <button 
            onClick={() => setShowAddChildForm(!showAddChildForm)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              showAddChildForm 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {showAddChildForm ? (
              <>
                <X className="h-5 w-5" />
                <span>İptal</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Çocuk Ekle</span>
              </>
            )}
          </button>
        </div>

        {showAddChildForm ? (
          <form onSubmit={handleAddChild} className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                  Çocuğunuzun Adı
                </label>
                <input
                  type="text"
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Adı ve Soyadı"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="childGrade" className="block text-sm font-medium text-gray-700 mb-1">
                  Sınıfı
                </label>
                <select
                  id="childGrade"
                  value={childGrade}
                  onChange={(e) => setChildGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Sınıf Seçin</option>
                  <option value="1">1. Sınıf</option>
                  <option value="2">2. Sınıf</option>
                  <option value="3">3. Sınıf</option>
                  <option value="4">4. Sınıf</option>
                  <option value="5">5. Sınıf</option>
                  <option value="6">6. Sınıf</option>
                  <option value="7">7. Sınıf</option>
                  <option value="8">8. Sınıf</option>
                  <option value="9">9. Sınıf</option>
                  <option value="10">10. Sınıf</option>
                  <option value="11">11. Sınıf</option>
                  <option value="12">12. Sınıf</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="childSchool" className="block text-sm font-medium text-gray-700 mb-1">
                  Okulu
                </label>
                <input
                  type="text"
                  id="childSchool"
                  value={childSchool}
                  onChange={(e) => setChildSchool(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Okul Adı"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Ekle
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-600 text-sm">
            Çocuklarınızı sisteme ekleyerek onların eğitim süreçlerini takip edebilirsiniz. 
            Şu anda bu özellik geliştirme aşamasındadır, ancak "Çocuk Ekle" düğmesine tıklayarak 
            arayüzü inceleyebilirsiniz.
          </p>
        )}
      </div>

      {/* Children List Section */}
      {childrenData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kayıtlı Çocuklarım</h3>
          <div className="space-y-4">
            {childrenData.map(child => (
              <div key={child.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{child.name}</h4>
                      <div className="flex items-center text-sm text-gray-600 space-x-3">
                        <span>{child.grade}. Sınıf</span>
                        <span>•</span>
                        <span>{child.school}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    Profili Görüntüle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Links Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Çocuk Takip Özellikleri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'development-tracking' }))}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <Calendar className="h-10 w-10 text-white" />
              <div className="text-left">
                <h4 className="text-lg font-bold mb-2">Gelişim Takibi</h4>
                <p className="text-sm text-blue-100">
                  Çocuğunuzun akademik gelişimini günlük, haftalık ve aylık olarak izleyin.
                </p>
                <div className="mt-4 flex items-center text-blue-100">
                  <span className="text-sm">İncele</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'homework-tracking' }))}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <BookOpen className="h-10 w-10 text-white" />
              <div className="text-left">
                <h4 className="text-lg font-bold mb-2">Ödev Takibi</h4>
                <p className="text-sm text-amber-100">
                  Ödevleri, projeleri ve sınavları tek bir yerden takip edin.
                </p>
                <div className="mt-4 flex items-center text-amber-100">
                  <span className="text-sm">İncele</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'achievement-notifications' }))}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <Award className="h-10 w-10 text-white" />
              <div className="text-left">
                <h4 className="text-lg font-bold mb-2">Başarı Bildirimleri</h4>
                <p className="text-sm text-purple-100">
                  Çocuğunuzun başarılarından anında haberdar olun.
                </p>
                <div className="mt-4 flex items-center text-purple-100">
                  <span className="text-sm">İncele</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'study-time-analytics' }))}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              <Clock className="h-10 w-10 text-white" />
              <div className="text-left">
                <h4 className="text-lg font-bold mb-2">Çalışma Süresi</h4>
                <p className="text-sm text-cyan-100">
                  Çocuğunuzun çalışma alışkanlıklarını ve süresini analiz edin.
                </p>
                <div className="mt-4 flex items-center text-cyan-100">
                  <span className="text-sm">İncele</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </button>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg text-center">
          <h4 className="font-medium text-indigo-900 mb-2">Geliştirme Aşamasında</h4>
          <p className="text-sm text-indigo-700">
            Bu özellikler şu anda geliştirme aşamasındadır. Yukarıdaki bağlantılara tıklayarak örnek arayüzleri inceleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Yakında Eklenecek Özellikler */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">Çocuk Profilleri</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Yeni</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Çocuklarınızın detaylı profil bilgilerini görüntüleyin ve düzenleyin.
                </p>
                <p className="text-xs text-green-600 font-medium mt-2">
                  Artık kullanılabilir!
                </p>
              </div>
            </div>
          </div>
          
          <ComingSoonFeature 
            title="Başarı Raporları" 
            description="Çocuğunuzun akademik başarısını detaylı grafikler ve raporlarla analiz edin."
            icon={BarChart4}
            availableDate="Ekim 2024"
          />
          
          <ComingSoonFeature 
            title="Öğretmen İletişimi" 
            description="Çocuğunuzun öğretmenleriyle doğrudan mesajlaşma ve görüşme planlama."
            icon={MessageCircle}
            availableDate="Kasım 2024"
          />
          
          <ComingSoonFeature 
            title="Ödev Takibi" 
            description="Çocuğunuzun ödevlerini ve projelerini takip edin, teslim tarihlerini görün."
            icon={FileText}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Okul Etkinlikleri" 
            description="Okul takvimini ve etkinliklerini takip edin, hatırlatmalar alın."
            icon={Calendar}
          />
          
          <ComingSoonFeature 
            title="Okul Malzemeleri" 
            description="Çocuğunuzun ihtiyaç duyduğu okul malzemelerini takip edin."
            icon={Backpack}
          />
        </div>
      </div>
    </div>
  );
};

export default Children; 