import React, { useState } from 'react';
import { FileText, Plus, Calendar, Clock, Users, Settings, Eye, Download, Share2, Copy, Edit, Trash2, X, CheckCircle, AlertCircle, BookOpen, Target, Timer, Award, BarChart3 } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  participants: number;
  averageScore?: number;
  createdAt: string;
  questions: string[];
}

const ExamCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'results'>('create');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    subject: 'matematik',
    grade: 8,
    duration: 60,
    startDate: '',
    endDate: '',
    questionCount: 20,
    allowRetake: false,
    shuffleQuestions: true,
    showResults: true,
    autoGrade: true
  });

  const mockExams: Exam[] = [
    {
      id: '1',
      title: '8. Sınıf Matematik Ara Sınavı',
      description: 'Cebir ve geometri konularını kapsayan ara sınav',
      subject: 'Matematik',
      grade: 8,
      duration: 60,
      totalQuestions: 25,
      totalPoints: 100,
      startDate: '2024-01-20T09:00:00Z',
      endDate: '2024-01-20T11:00:00Z',
      status: 'published',
      participants: 75,
      averageScore: 82,
      createdAt: '2024-01-15T10:00:00Z',
      questions: ['q1', 'q2', 'q3']
    },
    {
      id: '2',
      title: 'Türkçe Yazılı Sınavı',
      description: 'Edebiyat ve dil bilgisi konuları',
      subject: 'Türkçe',
      grade: 8,
      duration: 80,
      totalQuestions: 30,
      totalPoints: 120,
      startDate: '2024-01-25T10:00:00Z',
      endDate: '2024-01-25T12:00:00Z',
      status: 'draft',
      participants: 0,
      createdAt: '2024-01-18T14:30:00Z',
      questions: ['q4', 'q5', 'q6']
    }
  ];

  const handleCreateExam = () => {
    setShowCreateModal(true);
  };

  const handleSaveExam = () => {
    // Sınav kaydetme işlemi
    alert('Sınav başarıyla oluşturuldu!');
    setShowCreateModal(false);
  };

  const handlePublishExam = (examId: string) => {
    alert(`Sınav ${examId} yayınlandı!`);
  };

  const handleDuplicateExam = (exam: Exam) => {
    alert(`${exam.title} kopyalandı!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Taslak';
      case 'published': return 'Yayınlandı';
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <FileText className="h-8 w-8" />
              <span>Sınav Yönetimi</span>
            </h2>
            <p className="text-blue-100">Sınav oluşturun, yönetin ve sonuçları analiz edin</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleCreateExam}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Sınav</span>
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Ayarlar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'create', label: 'Sınav Oluştur', icon: Plus },
              { id: 'manage', label: 'Sınavları Yönet', icon: FileText },
              { id: 'results', label: 'Sonuçlar', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Yeni Sınav Oluşturun</h3>
                <p className="text-gray-600 mb-6">Öğrencileriniz için özelleştirilmiş sınavlar hazırlayın</p>
                <button 
                  onClick={handleCreateExam}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Sınav Oluştur</span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Hızlı Test</h4>
                  </div>
                  <p className="text-blue-700 text-sm mb-4">Mevcut soru bankasından hızlıca test oluşturun</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Başlat
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900">Şablon Kullan</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-4">Hazır şablonlardan birini seçerek başlayın</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    Şablonlar
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-900">AI Destekli</h4>
                  </div>
                  <p className="text-purple-700 text-sm mb-4">AI ile otomatik sınav oluşturun</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    AI Oluştur
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Tüm Sınavlar ({mockExams.length})</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Tüm Durumlar</option>
                    <option>Taslak</option>
                    <option>Yayınlandı</option>
                    <option>Aktif</option>
                    <option>Tamamlandı</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Tüm Dersler</option>
                    <option>Matematik</option>
                    <option>Türkçe</option>
                    <option>Fen Bilimleri</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {mockExams.map((exam) => (
                  <div key={exam.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{exam.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                            {getStatusText(exam.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{exam.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{exam.subject} - {exam.grade}. Sınıf</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{exam.duration} dakika</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{exam.totalQuestions} soru</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{exam.participants} katılımcı</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedExam(exam)}
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Önizle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDuplicateExam(exam)}
                          className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                          title="Kopyala"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Oluşturulma: {new Date(exam.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        {exam.averageScore && (
                          <span className="text-sm text-green-600 font-medium">
                            Ortalama: {exam.averageScore}%
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {exam.status === 'draft' && (
                          <button 
                            onClick={() => handlePublishExam(exam.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                          >
                            Yayınla
                          </button>
                        )}
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm flex items-center space-x-1">
                          <Share2 className="h-3 w-3" />
                          <span>Paylaş</span>
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>İndir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Sınav Sonuçları</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Toplam Sınav</p>
                      <p className="text-2xl font-bold text-blue-600">{mockExams.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tamamlanan</p>
                      <p className="text-2xl font-bold text-green-600">1</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Toplam Katılım</p>
                      <p className="text-2xl font-bold text-yellow-600">75</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ortalama Başarı</p>
                      <p className="text-2xl font-bold text-purple-600">82%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Results */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Son Sınav Sonuçları</h4>
                <div className="space-y-4">
                  {mockExams.filter(exam => exam.status === 'completed' || exam.averageScore).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{exam.title}</h5>
                        <p className="text-sm text-gray-600">{exam.participants} öğrenci katıldı</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{exam.averageScore}%</p>
                        <p className="text-sm text-gray-500">Ortalama</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Sınav Oluştur</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Başlığı</label>
                    <input 
                      type="text" 
                      value={examForm.title}
                      onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="örn: 8. Sınıf Matematik Ara Sınavı"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea 
                      value={examForm.description}
                      onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Sınav açıklaması..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                      <select 
                        value={examForm.subject}
                        onChange={(e) => setExamForm({...examForm, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="matematik">Matematik</option>
                        <option value="turkce">Türkçe</option>
                        <option value="fen">Fen Bilimleri</option>
                        <option value="sosyal">Sosyal Bilgiler</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                      <select 
                        value={examForm.grade}
                        onChange={(e) => setExamForm({...examForm, grade: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={5}>5. Sınıf</option>
                        <option value={6}>6. Sınıf</option>
                        <option value={7}>7. Sınıf</option>
                        <option value={8}>8. Sınıf</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Timing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Zamanlama</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                      <input 
                        type="datetime-local" 
                        value={examForm.startDate}
                        onChange={(e) => setExamForm({...examForm, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                      <input 
                        type="datetime-local" 
                        value={examForm.endDate}
                        onChange={(e) => setExamForm({...examForm, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                    <input 
                      type="number" 
                      value={examForm.duration}
                      onChange={(e) => setExamForm({...examForm, duration: parseInt(e.target.value)})}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sınav Ayarları</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={examForm.shuffleQuestions}
                        onChange={(e) => setExamForm({...examForm, shuffleQuestions: e.target.checked})}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Soruları karıştır</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={examForm.allowRetake}
                        onChange={(e) => setExamForm({...examForm, allowRetake: e.target.checked})}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Tekrar girişe izin ver</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={examForm.showResults}
                        onChange={(e) => setExamForm({...examForm, showResults: e.target.checked})}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Sonuçları öğrencilere göster</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={examForm.autoGrade}
                        onChange={(e) => setExamForm({...examForm, autoGrade: e.target.checked})}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Otomatik değerlendirme</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveExam}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sınavı Oluştur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCreator; 