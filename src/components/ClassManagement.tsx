import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MoreVertical, UserPlus, BookOpen, BarChart3, X, Mail, Phone, Calendar, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentNumber: string;
  avatar: string;
  grade: number;
  subjects: string[];
  averageScore: number;
  lastActivity: string;
  status: 'active' | 'inactive';
  email?: string;
  phone?: string;
  birthDate?: string;
  parentName?: string;
  parentPhone?: string;
  achievements?: string[];
  totalTests?: number;
  completedHomework?: number;
  studyHours?: number;
}

interface Class {
  id: string;
  name: string;
  grade: number;
  subject: string;
  studentCount: number;
  teacher: string;
  schedule: string;
  students?: Student[];
}

const ClassManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'students'>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedClassForAnalytics, setSelectedClassForAnalytics] = useState<Class | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const mockClasses: Class[] = [
    {
      id: '1',
      name: '8-A Matematik',
      grade: 8,
      subject: 'Matematik',
      studentCount: 25,
      teacher: 'Ayşe Öğretmen',
      schedule: 'Pazartesi 09:00-10:00'
    },
    {
      id: '2',
      name: '8-B Matematik',
      grade: 8,
      subject: 'Matematik',
      studentCount: 23,
      teacher: 'Ayşe Öğretmen',
      schedule: 'Salı 10:00-11:00'
    },
    {
      id: '3',
      name: '7-A Matematik',
      grade: 7,
      subject: 'Matematik',
      studentCount: 28,
      teacher: 'Ayşe Öğretmen',
      schedule: 'Çarşamba 11:00-12:00'
    }
  ];

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      studentNumber: '2024001',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      grade: 8,
      subjects: ['Matematik'],
      averageScore: 85,
      lastActivity: '2 saat önce',
      status: 'active',
      email: 'ahmet.yilmaz@email.com',
      phone: '0532 123 4567',
      birthDate: '2010-05-15',
      parentName: 'Mehmet Yılmaz',
      parentPhone: '0532 987 6543',
      achievements: ['Matematik Olimpiyatı 3. lük', 'Mükemmel Devam'],
      totalTests: 24,
      completedHomework: 18,
      studyHours: 45
    },
    {
      id: '2',
      name: 'Zeynep Kaya',
      studentNumber: '2024002',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      grade: 8,
      subjects: ['Matematik'],
      averageScore: 92,
      lastActivity: '1 gün önce',
      status: 'active',
      email: 'zeynep.kaya@email.com',
      phone: '0533 234 5678',
      birthDate: '2010-03-22',
      parentName: 'Fatma Kaya',
      parentPhone: '0533 876 5432',
      achievements: ['Sınıf Birincisi', 'Matematik Yıldızı', 'Proje Ödülü'],
      totalTests: 26,
      completedHomework: 22,
      studyHours: 52
    },
    {
      id: '3',
      name: 'Mehmet Demir',
      studentNumber: '2024003',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      grade: 8,
      subjects: ['Matematik'],
      averageScore: 78,
      lastActivity: '3 gün önce',
      status: 'inactive',
      email: 'mehmet.demir@email.com',
      phone: '0534 345 6789',
      birthDate: '2010-07-08',
      parentName: 'Ali Demir',
      parentPhone: '0534 765 4321',
      achievements: ['Takım Çalışması Ödülü'],
      totalTests: 20,
      completedHomework: 15,
      studyHours: 38
    }
  ];

  const filteredClasses = mockClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.includes(searchTerm)
  );

  // Handler functions
  const handleViewStudents = (classId: string) => {
    setSelectedClass(classId);
    setActiveTab('students');
  };

  const handleViewAnalytics = (cls: Class) => {
    setSelectedClassForAnalytics(cls);
    setShowAnalyticsModal(true);
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleSendMessage = (student: Student) => {
    // Mesajlaşma sistemini aç
    alert(`${student.name} ile mesajlaşma başlatılıyor...`);
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Sınıf Yönetimi</h2>
        <p className="text-primary-100">Sınıflarınızı ve öğrencilerinizi yönetin</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'classes', label: 'Sınıflar', icon: Users },
              { id: 'students', label: 'Öğrenciler', icon: UserPlus }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
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
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`${activeTab === 'classes' ? 'Sınıf' : 'Öğrenci'} ara...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
                          <button 
              onClick={handleFilter}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filtrele</span>
            </button>
          </div>
          
          <button 
            onClick={handleAddNew}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{activeTab === 'classes' ? 'Yeni Sınıf' : 'Öğrenci Ekle'}</span>
          </button>
          </div>

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-gray-600">{cls.teacher}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Öğrenci Sayısı</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sınıf</span>
                      <span className="font-medium">{cls.grade}. Sınıf</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Program</span>
                      <span className="font-medium">{cls.schedule}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
                    <button 
                      onClick={() => handleViewStudents(cls.id)}
                      className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm flex items-center justify-center space-x-1"
                    >
                      <Users className="h-4 w-4" />
                      <span>Öğrenciler</span>
                    </button>
                    <button 
                      onClick={() => handleViewAnalytics(cls)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm flex items-center justify-center space-x-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Analitik</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-gray-600">No: {student.studentNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{student.averageScore}%</p>
                        <p className="text-sm text-gray-600">Ortalama</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{student.grade}. Sınıf</p>
                        <p className="text-sm text-gray-600">Seviye</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status === 'active' ? 'Aktif' : 'Pasif'}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{student.lastActivity}</p>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {student.subjects.map((subject, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewStudentDetails(student)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm flex items-center space-x-1"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Detaylar</span>
                      </button>
                      <button 
                        onClick={() => handleSendMessage(student)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                      >
                        Mesaj Gönder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Öğrenci Detayları</h2>
                <button 
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-center">
                      <img 
                        src={selectedStudent.avatar} 
                        alt={selectedStudent.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-gray-600 mb-2">No: {selectedStudent.studentNumber}</p>
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        selectedStudent.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedStudent.status === 'active' ? 'Aktif' : 'Pasif'}
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedStudent.birthDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div className="bg-blue-50 rounded-xl p-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Veli Bilgileri</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Ad:</span> {selectedStudent.parentName}</p>
                      <p className="text-sm"><span className="font-medium">Telefon:</span> {selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats and Details */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ortalama</p>
                          <p className="text-xl font-bold text-blue-600">{selectedStudent.averageScore}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tamamlanan Test</p>
                          <p className="text-xl font-bold text-green-600">{selectedStudent.totalTests}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Çalışma Saati</p>
                          <p className="text-xl font-bold text-purple-600">{selectedStudent.studyHours}h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span>Kazanımlar</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.achievements?.map((achievement, index) => (
                        <span 
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subjects */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Dersler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.subjects.map((subject, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedClassForAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedClassForAnalytics.name} - Sınıf Analitikleri
                </h2>
                <button 
                  onClick={() => setShowAnalyticsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Toplam Öğrenci</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedClassForAnalytics.studentCount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Sınıf Ortalaması</p>
                      <p className="text-2xl font-bold text-green-600">84%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Aktif Öğrenci</p>
                      <p className="text-2xl font-bold text-purple-600">{Math.floor(selectedClassForAnalytics.studentCount * 0.85)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sınıf Performans Özeti</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">En Başarılı Öğrenciler</h4>
                    <div className="space-y-2">
                      {mockStudents.slice(0, 3).map((student, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium">{student.name}</span>
                          </div>
                          <span className="text-green-600 font-bold">{student.averageScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Gelişim Gereken Alanlar</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Geometri</span>
                          <span className="text-sm text-gray-600">65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Cebir</span>
                          <span className="text-sm text-gray-600">72%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'classes' ? 'Yeni Sınıf Ekle' : 'Yeni Öğrenci Ekle'}
                </h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                {activeTab === 'classes' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf Adı</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="örn: 8-A Matematik"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option>Matematik</option>
                        <option>Türkçe</option>
                        <option>Fen Bilimleri</option>
                        <option>Sosyal Bilgiler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf Seviyesi</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option>5. Sınıf</option>
                        <option>6. Sınıf</option>
                        <option>7. Sınıf</option>
                        <option>8. Sınıf</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Öğrenci adı ve soyadı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Numarası</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="2024001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="ogrenci@email.com"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Filtrele</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf Seviyesi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Tümü</option>
                    <option>5. Sınıf</option>
                    <option>6. Sınıf</option>
                    <option>7. Sınıf</option>
                    <option>8. Sınıf</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Tümü</option>
                    <option>Matematik</option>
                    <option>Türkçe</option>
                    <option>Fen Bilimleri</option>
                    <option>Sosyal Bilgiler</option>
                  </select>
                </div>
                
                {activeTab === 'students' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option>Tümü</option>
                      <option>Aktif</option>
                      <option>Pasif</option>
                    </select>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={() => setShowFilterModal(false)}
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
    </div>
  );
};

export default ClassManagement;