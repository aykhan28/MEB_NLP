import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Target, Calendar, Download, Filter, X, FileText, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterData, setFilterData] = useState({
    dateRange: 'month',
    class: 'all',
    subject: 'all',
    reportType: 'performance'
  });

  // Mock data
  const performanceData = [
    { date: '01/01', matematik: 75, turkce: 82, fen: 78 },
    { date: '08/01', matematik: 78, turkce: 85, fen: 80 },
    { date: '15/01', matematik: 82, turkce: 88, fen: 85 },
    { date: '22/01', matematik: 85, turkce: 90, fen: 87 },
    { date: '29/01', matematik: 88, turkce: 92, fen: 90 }
  ];

  const subjectDistribution = [
    { name: 'Matematik', value: 35, color: '#3B82F6' },
    { name: 'Türkçe', value: 30, color: '#10B981' },
    { name: 'Fen Bilimleri', value: 25, color: '#F59E0B' },
    { name: 'Sosyal Bilgiler', value: 10, color: '#EF4444' }
  ];

  const classPerformance = [
    { class: '8-A', average: 85, students: 25 },
    { class: '8-B', average: 82, students: 23 },
    { class: '8-C', average: 88, students: 24 },
    { class: '7-A', average: 79, students: 28 },
    { class: '7-B', average: 83, students: 26 }
  ];

  const stats = [
    {
      title: 'Toplam Öğrenci',
      value: '126',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Ortalama Başarı',
      value: '84%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tamamlanan Testler',
      value: '342',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Aktif Dersler',
      value: '18',
      change: '+2',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Handler functions
  const handleDownloadReport = () => {
    setShowReportModal(true);
  };

  const handleShowFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setTimeRange(filterData.dateRange as any);
    setSelectedClass(filterData.class);
    setShowFilterModal(false);
    // Burada filtreleme mantığı uygulanır
  };

  const handleGenerateReport = (reportType: string) => {
    // Rapor oluşturma simülasyonu
    const reportData = {
      type: reportType,
      dateRange: filterData.dateRange,
      class: filterData.class,
      generatedAt: new Date().toISOString()
    };
    
    // Gerçek uygulamada burada PDF oluşturma veya veri indirme işlemi yapılır
    alert(`${reportType} raporu oluşturuluyor... Kısa süre sonra indirilecek.`);
    setShowReportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analitik Dashboard</h2>
            <p className="text-primary-100">Öğrenci performansı ve sınıf analizleri</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleDownloadReport}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Rapor İndir</span>
            </button>
            <button 
              onClick={handleShowFilter}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtrele</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Aralığı</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="semester">Bu Dönem</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Tüm Sınıflar</option>
                <option value="8a">8-A</option>
                <option value="8b">8-B</option>
                <option value="8c">8-C</option>
                <option value="7a">7-A</option>
                <option value="7b">7-B</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">son aydan</span>
                </div>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Trendi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="matematik" stroke="#3B82F6" strokeWidth={3} name="Matematik" />
                <Line type="monotone" dataKey="turkce" stroke="#10B981" strokeWidth={3} name="Türkçe" />
                <Line type="monotone" dataKey="fen" stroke="#F59E0B" strokeWidth={3} name="Fen Bilimleri" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ders Dağılımı</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
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
          <div className="flex justify-center space-x-6 mt-4">
            {subjectDistribution.map((entry, index) => (
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

      {/* Class Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sınıf Performansları</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'average' ? `${value}%` : value,
                name === 'average' ? 'Ortalama' : 'Öğrenci Sayısı'
              ]} />
              <Bar dataKey="average" fill="#3B82F6" name="average" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">En Başarılı Öğrenciler</h3>
          <div className="space-y-4">
            {[
              { name: 'Zeynep Kaya', class: '8-A', score: 95, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Ahmet Yılmaz', class: '8-B', score: 92, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Elif Demir', class: '8-C', score: 90, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200' }
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{student.score}%</p>
                  <p className="text-xs text-gray-500">Ortalama</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelişim Alanları</h3>
          <div className="space-y-4">
            {[
              { topic: 'Oran ve Orantı', difficulty: 68, students: 45 },
              { topic: 'Geometrik Şekiller', difficulty: 72, students: 38 },
              { topic: 'Doğrusal Denklemler', difficulty: 75, students: 32 },
              { topic: 'Veri Analizi', difficulty: 78, students: 28 }
            ].map((area, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{area.topic}</h4>
                  <span className="text-sm text-gray-600">{area.students} öğrenci</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        area.difficulty < 70 ? 'bg-red-500' : 
                        area.difficulty < 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${area.difficulty}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{area.difficulty}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Analitik Filtreleri</span>
                </h2>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Aralığı</label>
                  <select 
                    value={filterData.dateRange}
                    onChange={(e) => setFilterData({...filterData, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="week">Bu Hafta</option>
                    <option value="month">Bu Ay</option>
                    <option value="semester">Bu Dönem</option>
                    <option value="year">Bu Yıl</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                  <select 
                    value={filterData.class}
                    onChange={(e) => setFilterData({...filterData, class: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Tüm Sınıflar</option>
                    <option value="8a">8-A</option>
                    <option value="8b">8-B</option>
                    <option value="8c">8-C</option>
                    <option value="7a">7-A</option>
                    <option value="7b">7-B</option>
                    <option value="6a">6-A</option>
                    <option value="5a">5-A</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                  <select 
                    value={filterData.subject}
                    onChange={(e) => setFilterData({...filterData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Tüm Dersler</option>
                    <option value="matematik">Matematik</option>
                    <option value="turkce">Türkçe</option>
                    <option value="fen">Fen Bilimleri</option>
                    <option value="sosyal">Sosyal Bilgiler</option>
                    <option value="ingilizce">İngilizce</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analiz Türü</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="analysisType" 
                        value="performance"
                        checked={filterData.reportType === 'performance'}
                        onChange={(e) => setFilterData({...filterData, reportType: e.target.value})}
                        className="mr-2"
                      />
                      <span className="text-sm">Performans Analizi</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="analysisType" 
                        value="attendance"
                        checked={filterData.reportType === 'attendance'}
                        onChange={(e) => setFilterData({...filterData, reportType: e.target.value})}
                        className="mr-2"
                      />
                      <span className="text-sm">Devam Durumu</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="analysisType" 
                        value="improvement"
                        checked={filterData.reportType === 'improvement'}
                        onChange={(e) => setFilterData({...filterData, reportType: e.target.value})}
                        className="mr-2"
                      />
                      <span className="text-sm">Gelişim Analizi</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={handleApplyFilter}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Download Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Rapor İndir</span>
                </h2>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rapor Türü Seçin</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleGenerateReport('Performans Raporu')}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Performans Raporu</p>
                          <p className="text-sm text-gray-600">Öğrenci başarı ve performans analizi</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={() => handleGenerateReport('Sınıf Analizi')}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Sınıf Analizi</p>
                          <p className="text-sm text-gray-600">Sınıf bazlı detaylı analiz raporu</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={() => handleGenerateReport('Ders Bazlı Analiz')}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Ders Bazlı Analiz</p>
                          <p className="text-sm text-gray-600">Ders konularına göre başarı analizi</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={() => handleGenerateReport('Gelişim Raporu')}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Target className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Gelişim Raporu</p>
                          <p className="text-sm text-gray-600">Öğrenci gelişim ve ilerleme raporu</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Rapor Detayları</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Zaman Aralığı:</span> {
                      filterData.dateRange === 'week' ? 'Bu Hafta' :
                      filterData.dateRange === 'month' ? 'Bu Ay' :
                      filterData.dateRange === 'semester' ? 'Bu Dönem' : 'Bu Yıl'
                    }</p>
                    <p><span className="font-medium">Sınıf:</span> {
                      filterData.class === 'all' ? 'Tüm Sınıflar' : filterData.class.toUpperCase()
                    }</p>
                    <p><span className="font-medium">Ders:</span> {
                      filterData.subject === 'all' ? 'Tüm Dersler' : 
                      filterData.subject.charAt(0).toUpperCase() + filterData.subject.slice(1)
                    }</p>
                    <p><span className="font-medium">Format:</span> PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;