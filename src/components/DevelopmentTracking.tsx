import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, Calendar, AlertCircle, Clock, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDevelopmentRecordsFromLocalStorage } from '../models/Development';
import { ChildrenContext } from '../models/Child';

const DevelopmentTracking: React.FC = () => {
  const { children } = useContext(ChildrenContext);
  const [developmentRecords, setDevelopmentRecords] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    // LocalStorage'dan gelişim kayıtlarını yükle
    const savedRecords = getDevelopmentRecordsFromLocalStorage();
    setDevelopmentRecords(savedRecords);
    
    // İlk çocuğu varsayılan olarak seç
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  // Seçilen çocuğa ait gelişim kayıtlarını filtrele
  const filteredRecords = developmentRecords.filter(record => 
    record.childId === selectedChildId
  );

  // Derslerin listesini al
  const subjects = [...new Set(filteredRecords.map(record => record.subject))];

  // İlerleme verilerini hazırla
  const progressData = filteredRecords
    .filter(record => selectedSubject === 'all' || record.subject === selectedSubject)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => ({
      date: record.date,
      score: record.score,
      subject: record.subject
    }));

  // Ders bazlı ilerleme verilerini hazırla
  const subjectProgress = subjects.map(subject => {
    const records = filteredRecords.filter(record => record.subject === subject);
    
    // Son iki kaydı al
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latestRecord = sortedRecords[0];
    const previousRecord = sortedRecords[1];
    
    const progress = latestRecord ? latestRecord.score : 0;
    const change = previousRecord ? latestRecord.score - previousRecord.score : 0;
    
    return { subject, progress, change };
  });

  // Haftalık istatistikleri hesapla
  const weeklyStats = {
    studyHours: 0,
    completedHomework: 0,
    totalHomework: 0,
    averageScore: 0,
    activeDays: 0
  };

  if (filteredRecords.length > 0) {
    // Ortalama puanı hesapla
    weeklyStats.averageScore = Math.round(
      filteredRecords.reduce((sum, record) => sum + record.score, 0) / filteredRecords.length
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gelişim Takibi</h2>
            <p className="text-blue-100 mb-4">
              Çocuğunuzun akademik gelişimini günlük, haftalık ve aylık olarak izleyin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Performans Analizi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Zaman Bazlı Takip</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="h-24 w-24 text-white opacity-80" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="childSelector" className="block text-sm font-medium text-gray-700 mb-1">
                Çocuk Seçin
              </label>
              <select
                id="childSelector"
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subjectSelector" className="block text-sm font-medium text-gray-700 mb-1">
                Ders Seçin
              </label>
              <select
                id="subjectSelector"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Dersler</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedSubject === 'all' ? 'Genel İlerleme Grafiği' : `${selectedSubject} Dersi İlerleme Grafiği`}
        </h3>
        {progressData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    props.payload.subject
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Henüz veri bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Subject Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ders Bazlı İlerleme</h3>
        {subjectProgress.length > 0 ? (
          <div className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                    <div className={`ml-2 flex items-center ${
                      subject.change > 0 ? 'text-green-600' : subject.change < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {subject.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : subject.change < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : null}
                      <span className="text-xs font-medium">
                        {subject.change > 0 ? `+${subject.change}%` : subject.change < 0 ? `${subject.change}%` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      subject.progress >= 80 ? 'bg-green-500' :
                      subject.progress >= 70 ? 'bg-blue-500' :
                      subject.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">Henüz ders bazlı ilerleme verisi bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Haftalık Çalışma</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{weeklyStats.studyHours} saat</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Son 7 gün</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanan Ödev</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{weeklyStats.completedHomework}/{weeklyStats.totalHomework}</p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: weeklyStats.totalHomework > 0 ? `${(weeklyStats.completedHomework / weeklyStats.totalHomework) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{weeklyStats.averageScore}%</p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Tüm sınavlar</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Gün</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{weeklyStats.activeDays}/7</p>
            </div>
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div 
                  key={day} 
                  className={`h-1.5 flex-1 rounded-full ${day <= weeklyStats.activeDays ? 'bg-indigo-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Karşılaştırmalı Analiz</h4>
                <p className="text-sm text-gray-600 mt-1">Çocuğunuzun performansını sınıf ve okul ortalamasıyla karşılaştırın.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Başarı Tahminleri</h4>
                <p className="text-sm text-gray-600 mt-1">Mevcut performansa dayalı gelecek başarı tahminleri.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Özelleştirilmiş Raporlar</h4>
                <p className="text-sm text-gray-600 mt-1">İstediğiniz zaman aralığı ve kriterlere göre özelleştirilmiş raporlar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentTracking; 