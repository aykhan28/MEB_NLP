import React, { useState, useEffect, useContext } from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle, Clock, BookOpen, XCircle, Filter } from 'lucide-react';
import { getHomeworkFromLocalStorage, Homework } from '../models/Homework';
import { ChildrenContext } from '../models/Child';

const HomeworkTracking: React.FC = () => {
  const { children } = useContext(ChildrenContext);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    // LocalStorage'dan ödev verilerini yükle
    const savedHomeworks = getHomeworkFromLocalStorage();
    if (savedHomeworks.length > 0) {
      setHomeworks(savedHomeworks);
    }
    
    // İlk çocuğu varsayılan olarak seç
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  // Seçilen çocuğa ait ödevleri filtrele
  const childHomeworks = homeworks.filter(homework => 
    homework.childId === selectedChildId
  );

  const filteredHomeworks = childHomeworks.filter(homework => {
    if (filterStatus !== 'all' && homework.status !== filterStatus) return false;
    if (filterSubject !== 'all' && homework.subject !== filterSubject) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Bekliyor';
      case 'overdue': return 'Gecikmiş';
      default: return status;
    }
  };

  const subjects = [...new Set(childHomeworks.map(hw => hw.subject))];

  // Eğer hiç ödev yoksa örnek mesaj göster
  if (homeworks.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ödev Takibi</h2>
              <p className="text-amber-100 mb-4">
                Ödevleri, projeleri ve sınavları tek bir yerden takip edin.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Ödev Yönetimi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Teslim Tarihleri</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <FileText className="h-24 w-24 text-white opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-amber-100 p-4 rounded-full inline-block mb-6">
              <FileText className="h-12 w-12 text-amber-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Henüz Ödev Bulunmuyor</h3>
            
            <p className="text-gray-600 mb-6">
              Çocuğunuzun ödevleri burada görüntülenecektir. Şu anda herhangi bir ödev bulunmamaktadır.
            </p>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">Geliştirme Aşamasında</h4>
              <p className="text-sm text-amber-700">
                Bu özellik şu anda geliştirme aşamasındadır. Yakında öğretmenler tarafından verilen ödevler burada görüntülenecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ödev Takibi</h2>
            <p className="text-amber-100 mb-4">
              Ödevleri, projeleri ve sınavları tek bir yerden takip edin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Ödev Yönetimi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Teslim Tarihleri</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <FileText className="h-24 w-24 text-white opacity-80" />
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
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Homework Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ödev</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{childHomeworks.length}</p>
            </div>
            <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childHomeworks.filter(hw => hw.status === 'completed').length}/{childHomeworks.length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: childHomeworks.length ? `${(childHomeworks.filter(hw => hw.status === 'completed').length / childHomeworks.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yaklaşan Teslim</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {childHomeworks.filter(hw => hw.status === 'pending').length}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-yellow-600 font-medium">
              {childHomeworks.filter(hw => hw.status === 'overdue').length} gecikmiş ödev
            </span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ödevler</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filtrele</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Tümü</option>
              <option value="completed">Tamamlanan</option>
              <option value="pending">Bekleyen</option>
              <option value="overdue">Gecikmiş</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Ders
            </label>
            <select
              id="subjectFilter"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Tüm Dersler</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Homework List */}
        <div className="space-y-4">
          {filteredHomeworks.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-gray-700 font-medium">Ödev Bulunamadı</h3>
              <p className="text-gray-500 text-sm mt-1">Seçilen filtrelere uygun ödev bulunmamaktadır.</p>
            </div>
          ) : (
            filteredHomeworks.map(homework => (
              <div key={homework.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900">{homework.title}</h4>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(homework.status)}`}>
                        {getStatusIcon(homework.status)}
                        <span>{getStatusText(homework.status)}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{homework.subject}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Teslim: {new Date(homework.dueDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{homework.description}</p>
                    
                    {homework.status === 'completed' && homework.grade && (
                      <div className="bg-green-50 p-2 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-800">Not: {homework.grade}/100</span>
                          <span className="text-xs text-green-600">
                            Tamamlandı: {homework.completedDate && new Date(homework.completedDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        {homework.feedback && (
                          <p className="text-xs text-green-700 mt-1">{homework.feedback}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <div className="text-sm text-gray-500">{homework.teacher}</div>
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
              <div className="bg-amber-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Takvim Görünümü</h4>
                <p className="text-sm text-gray-600 mt-1">Ödevleri takvim üzerinde görüntüleyin ve planlayın.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Hatırlatıcılar</h4>
                <p className="text-sm text-gray-600 mt-1">Yaklaşan ödevler için otomatik hatırlatmalar alın.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Dosya Yükleme</h4>
                <p className="text-sm text-gray-600 mt-1">Ödevleri doğrudan platforma yükleyin ve gönderin.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkTracking; 