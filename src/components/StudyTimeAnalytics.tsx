import React, { useState, useEffect, useContext } from 'react';
import { Clock, Calendar, AlertCircle, BarChart, PieChart, TrendingUp, BookOpen, Filter } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { getStudySessionsFromLocalStorage } from '../models/StudyTime';
import { ChildrenContext } from '../models/Child';

const StudyTimeAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('week');
  const { children } = useContext(ChildrenContext);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  useEffect(() => {
    // LocalStorage'dan çalışma oturumlarını yükle
    const savedStudySessions = getStudySessionsFromLocalStorage();
    setStudySessions(savedStudySessions);
    
    // İlk çocuğu varsayılan olarak seç
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  // Seçilen çocuğa ait çalışma oturumlarını filtrele
  const filteredSessions = studySessions.filter(session => 
    session.childId === selectedChildId
  );
  
  // Haftalık verileri hazırla
  const weeklyData = [
    { day: 'Pzt', hours: 0, subject: '', color: '#3B82F6' },
    { day: 'Sal', hours: 0, subject: '', color: '#10B981' },
    { day: 'Çar', hours: 0, subject: '', color: '#F59E0B' },
    { day: 'Per', hours: 0, subject: '', color: '#8B5CF6' },
    { day: 'Cum', hours: 0, subject: '', color: '#EC4899' },
    { day: 'Cmt', hours: 0, subject: '', color: '#6B7280' },
    { day: 'Paz', hours: 0, subject: '', color: '#6B7280' }
  ];
  
  // Gerçek verileri ekle
  filteredSessions.forEach(session => {
    const date = new Date(session.date);
    const dayOfWeek = date.getDay(); // 0 = Pazar, 1 = Pazartesi, ...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Pazartesi, ... 6 = Pazar
    
    if (dayIndex >= 0 && dayIndex < 7) {
      weeklyData[dayIndex].hours += session.hours;
      weeklyData[dayIndex].subject = session.subject;
    }
  });

  // Aylık verileri hazırla
  const monthlyData = [
    { week: 'Hafta 1', hours: 0 },
    { week: 'Hafta 2', hours: 0 },
    { week: 'Hafta 3', hours: 0 },
    { week: 'Hafta 4', hours: 0 }
  ];
  
  // Gerçek verileri ekle
  filteredSessions.forEach(session => {
    const date = new Date(session.date);
    const dayOfMonth = date.getDate();
    
    // Haftayı belirle (1-7: Hafta 1, 8-14: Hafta 2, 15-21: Hafta 3, 22+: Hafta 4)
    let weekIndex = 0;
    if (dayOfMonth <= 7) weekIndex = 0;
    else if (dayOfMonth <= 14) weekIndex = 1;
    else if (dayOfMonth <= 21) weekIndex = 2;
    else weekIndex = 3;
    
    monthlyData[weekIndex].hours += session.hours;
  });

  // Ders bazlı dağılım
  const subjectMap = new Map();
  filteredSessions.forEach(session => {
    const subject = session.subject;
    const hours = session.hours;
    
    if (subjectMap.has(subject)) {
      subjectMap.set(subject, subjectMap.get(subject) + hours);
    } else {
      subjectMap.set(subject, hours);
    }
  });
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];
  
  const subjectData = Array.from(subjectMap.entries()).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));
  
  // Günün saatlerine göre dağılım
  const timeOfDayMap = {
    'morning': { name: 'Sabah (06:00-12:00)', value: 0, color: '#FBBF24' },
    'afternoon': { name: 'Öğlen (12:00-18:00)', value: 0, color: '#F97316' },
    'evening': { name: 'Akşam (18:00-24:00)', value: 0, color: '#7C3AED' }
  };
  
  filteredSessions.forEach(session => {
    const timeOfDay = session.timeOfDay as 'morning' | 'afternoon' | 'evening';
    if (timeOfDayMap[timeOfDay]) {
      timeOfDayMap[timeOfDay].value += session.hours;
    }
  });
  
  const timeOfDayData = Object.values(timeOfDayMap);

  const totalHours = filteredSessions.reduce((sum, session) => sum + session.hours, 0);
  const averageHoursPerDay = filteredSessions.length > 0 ? (totalHours / 7).toFixed(1) : '0.0';
  
  // En verimli günü bul
  const dayTotals = weeklyData.map(day => ({ day: day.day, hours: day.hours }));
  const mostProductiveDay = dayTotals.length > 0 ? 
    [...dayTotals].sort((a, b) => b.hours - a.hours)[0] : 
    { day: '-', hours: 0 };
  
  // En çok çalışılan dersi bul
  const mostStudiedSubject = subjectData.length > 0 ? 
    [...subjectData].sort((a, b) => b.value - a.value)[0] : 
    { name: '-', value: 0 };

  const renderActiveData = () => {
    if (timeRange === 'week') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
              <Bar dataKey="hours" fill="#3B82F6" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (timeRange === 'month') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
              <Bar dataKey="hours" fill="#8B5CF6" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Çalışma Süresi</h2>
            <p className="text-cyan-100 mb-4">
              Çocuğunuzun çalışma alışkanlıklarını ve süresini analiz edin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Zaman Analizi</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span className="text-sm">Verimlilik Takibi</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Clock className="h-24 w-24 text-white opacity-80" />
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
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Study Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Süre</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalHours.toFixed(1)} saat</p>
            </div>
            <div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Bu hafta</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Günlük Ortalama</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageHoursPerDay} saat</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Son 7 gün</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Verimli Gün</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mostProductiveDay.day}</p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">{mostProductiveDay.hours.toFixed(1)} saat</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Çok Çalışılan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mostStudiedSubject.name}</p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-purple-600">{mostStudiedSubject.value.toFixed(1)} saat</span>
          </div>
        </div>
      </div>

      {/* Time Range Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Çalışma Süresi Analizi</h3>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="week">Haftalık</option>
              <option value="month">Aylık</option>
            </select>
          </div>
        </div>

        {renderActiveData()}
      </div>

      {/* Subject Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ders Dağılımı</h3>
          {subjectData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Henüz veri bulunmuyor</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Günün Saatlerine Göre</h3>
          {timeOfDayData.some(item => item.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={timeOfDayData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {timeOfDayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} saat`, 'Çalışma Süresi']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Henüz veri bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Çalışma Hedefleri</h4>
                <p className="text-sm text-gray-600 mt-1">Haftalık ve aylık çalışma hedefleri belirleyin ve takip edin.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <BarChart className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Verimlilik Analizi</h4>
                <p className="text-sm text-gray-600 mt-1">Çalışma süresinin verimlilik analizini görüntüleyin.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Karşılaştırmalı Raporlar</h4>
                <p className="text-sm text-gray-600 mt-1">Önceki dönemlerle karşılaştırmalı çalışma raporları.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeAnalytics; 