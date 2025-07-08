import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Video, FileText, Image, Upload, Edit, Trash2, Eye, Play, Download, Share2, MoreVertical, Star, TrendingUp, Users, Clock, CheckCircle, AlertCircle, X, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Flag, History, FileType, User, Tag, BarChart3, ExternalLink, Copy } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'interactive';
  subject: string;
  grade: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  rating: number;
  thumbnail?: string;
  description?: string;
  duration?: number; // dakika cinsinden
  fileSize?: string;
  fileType?: string;
  author?: string;
  tags?: string[];
  downloadCount?: number;
  shareCount?: number;
  comments?: Comment[];
  versions?: ContentVersion[];
  metadata?: {
    resolution?: string;
    format?: string;
    language?: string;
    subtitles?: boolean;
  };
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating?: number;
  createdAt: string;
  replies?: Comment[];
}

interface ContentVersion {
  id: string;
  version: string;
  description: string;
  createdAt: string;
  author: string;
  changes: string[];
}

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'documents' | 'images' | 'interactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewTab, setPreviewTab] = useState<'overview' | 'comments' | 'versions' | 'analytics'>('overview');
  const [newComment, setNewComment] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [newContent, setNewContent] = useState<{
    type: 'video' | 'document' | 'image' | 'interactive';
    title: string;
    subject: string;
    grade: number;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
  }>({
    type: 'video',
    title: '',
    subject: 'matematik',
    grade: 8,
    topic: '',
    difficulty: 'medium',
    description: ''
  });

  const mockContent: Content[] = [
    {
      id: '1',
      title: 'Doğrusal Denklemler Konu Anlatımı',
      type: 'video',
      subject: 'Matematik',
      grade: 8,
      topic: 'Doğrusal Denklemler',
      difficulty: 'medium',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      status: 'published',
      views: 245,
      rating: 4.8,
      thumbnail: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Bu videoda doğrusal denklemlerin temel kavramları ve çözüm yöntemleri detaylı olarak anlatılmaktadır. Öğrencilerin konuyu daha iyi anlaması için çok sayıda örnek ve alıştırma yer almaktadır.',
      duration: 25,
      fileSize: '145 MB',
      fileType: 'MP4',
      author: 'Ayşe Matematik Öğretmeni',
      tags: ['matematik', 'denklem', '8.sınıf', 'cebir'],
      downloadCount: 89,
      shareCount: 34,
      metadata: {
        resolution: '1080p',
        format: 'MP4',
        language: 'Türkçe',
        subtitles: true
      },
      comments: [
        {
          id: '1',
          userId: 'student1',
          userName: 'Ahmet Yılmaz',
          userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
          content: 'Çok açıklayıcı bir video olmuş, teşekkürler!',
          rating: 5,
          createdAt: '2024-01-16T10:30:00Z',
          replies: [
            {
              id: '2',
              userId: 'teacher1',
              userName: 'Ayşe Öğretmen',
              userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
              content: 'Teşekkürler Ahmet, başarılar!',
              createdAt: '2024-01-16T11:00:00Z'
            }
          ]
        }
      ],
      versions: [
        {
          id: 'v2',
          version: '2.0',
          description: 'Ses kalitesi iyileştirildi, yeni örnekler eklendi',
          createdAt: '2024-01-15T14:00:00Z',
          author: 'Ayşe Öğretmen',
          changes: ['Ses kalitesi iyileştirildi', 'Yeni örnekler eklendi', 'Altyazı düzeltmeleri']
        },
        {
          id: 'v1',
          version: '1.0',
          description: 'İlk versiyon',
          createdAt: '2024-01-10T09:00:00Z',
          author: 'Ayşe Öğretmen',
          changes: ['İlk yayın']
        }
      ]
    },
    {
      id: '2',
      title: 'Geometri Formülleri Özet',
      type: 'document',
      subject: 'Matematik',
      grade: 8,
      topic: 'Geometrik Şekiller',
      difficulty: 'easy',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      status: 'published',
      views: 189,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Üçgen Çeşitleri Görseli',
      type: 'image',
      subject: 'Matematik',
      grade: 8,
      topic: 'Geometrik Şekiller',
      difficulty: 'easy',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10',
      status: 'published',
      views: 156,
      rating: 4.4,
      thumbnail: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '4',
      title: 'İnteraktif Oran-Orantı Simülasyonu',
      type: 'interactive',
      subject: 'Matematik',
      grade: 8,
      topic: 'Oran ve Orantı',
      difficulty: 'hard',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-16',
      status: 'draft',
      views: 0,
      rating: 0
    }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'image': return Image;
      case 'interactive': return BookOpen;
      default: return FileText;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'interactive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContent = mockContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || content.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreateContent = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          setNewContent({
            type: 'video',
            title: '',
            subject: 'matematik',
            grade: 8,
            topic: '',
            difficulty: 'medium',
            description: ''
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setShowPreview(true);
  };

  const handleEditContent = (content: Content) => {
    setNewContent({
      type: content.type,
      title: content.title,
      subject: content.subject,
      grade: content.grade,
      topic: content.topic,
      difficulty: content.difficulty,
      description: content.topic // Using topic as description for now
    });
    setShowUploadModal(true);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      // Handle deletion logic here
      console.log('Deleting content:', contentId);
    }
  };

  const contentStats = {
    total: mockContent.length,
    videos: mockContent.filter(c => c.type === 'video').length,
    documents: mockContent.filter(c => c.type === 'document').length,
    images: mockContent.filter(c => c.type === 'image').length,
    interactive: mockContent.filter(c => c.type === 'interactive').length,
    published: mockContent.filter(c => c.status === 'published').length,
    draft: mockContent.filter(c => c.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">İçerik Yönetimi</h2>
            <p className="text-primary-100">Eğitim materyallerinizi oluşturun ve yönetin</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni İçerik</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Toplam', value: contentStats.total, color: 'bg-blue-50 text-blue-600' },
          { label: 'Video', value: contentStats.videos, color: 'bg-red-50 text-red-600' },
          { label: 'Doküman', value: contentStats.documents, color: 'bg-blue-50 text-blue-600' },
          { label: 'Görsel', value: contentStats.images, color: 'bg-green-50 text-green-600' },
          { label: 'İnteraktif', value: contentStats.interactive, color: 'bg-purple-50 text-purple-600' },
          { label: 'Yayında', value: contentStats.published, color: 'bg-green-50 text-green-600' },
          { label: 'Taslak', value: contentStats.draft, color: 'bg-yellow-50 text-yellow-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
              <span className="text-lg font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'videos', label: 'Videolar' },
              { key: 'documents', label: 'Dokümanlar' },
              { key: 'images', label: 'Görseller' },
              { key: 'interactive', label: 'İnteraktif' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="İçerik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>Filtrele</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => {
          const Icon = getContentIcon(content.type);
          
          return (
            <div key={content.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-100">
                {content.thumbnail ? (
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}>
                    {content.type === 'video' ? 'Video' :
                     content.type === 'document' ? 'Doküman' :
                     content.type === 'image' ? 'Görsel' : 'İnteraktif'}
                  </span>
                </div>
                
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                    {content.status === 'published' ? 'Yayında' :
                     content.status === 'draft' ? 'Taslak' : 'Arşiv'}
                  </span>
                </div>
              </div>
              
              {/* Content Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {content.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {content.grade}. Sınıf
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty === 'easy' ? 'Kolay' :
                     content.difficulty === 'medium' ? 'Orta' : 'Zor'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{content.topic}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{content.views} görüntüleme</span>
                  {content.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{content.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewContent(content)}
                    className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Görüntüle</span>
                  </button>
                  <button 
                    onClick={() => handleEditContent(content)}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteContent(content.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Preview Modal */}
      {showPreview && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  {React.createElement(getContentIcon(selectedContent.type), { className: "h-6 w-6 text-primary-600" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedContent.title}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedContent.author} • {new Date(selectedContent.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: Eye },
                  { id: 'comments', label: 'Yorumlar', icon: MessageSquare },
                  { id: 'versions', label: 'Sürümler', icon: History },
                  { id: 'analytics', label: 'Analitik', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPreviewTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      previewTab === tab.id
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {previewTab === 'overview' && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Media Preview */}
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg p-6 text-center">
                        {selectedContent.thumbnail ? (
                          <img
                            src={selectedContent.thumbnail}
                            alt={selectedContent.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                            {React.createElement(getContentIcon(selectedContent.type), { className: "h-16 w-16 text-gray-400" })}
                          </div>
                        )}
                        
                        <div className="flex justify-center space-x-3">
                          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Oynat</span>
                          </button>
                          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>İndir</span>
                          </button>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                            <Share2 className="h-4 w-4" />
                            <span>Paylaş</span>
                          </button>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                            <Copy className="h-4 w-4" />
                            <span>Kopyala</span>
                          </button>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <FileType className="h-4 w-4" />
                          <span>Dosya Bilgileri</span>
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Boyut:</span>
                            <span className="ml-2 font-medium">{selectedContent.fileSize}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tür:</span>
                            <span className="ml-2 font-medium">{selectedContent.fileType}</span>
                          </div>
                          {selectedContent.duration && (
                            <div>
                              <span className="text-gray-600">Süre:</span>
                              <span className="ml-2 font-medium">{selectedContent.duration} dk</span>
                            </div>
                          )}
                          {selectedContent.metadata?.resolution && (
                            <div>
                              <span className="text-gray-600">Çözünürlük:</span>
                              <span className="ml-2 font-medium">{selectedContent.metadata.resolution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">İçerik Detayları</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(selectedContent.type)}`}>
                            {selectedContent.type === 'video' ? 'Video' :
                             selectedContent.type === 'document' ? 'Doküman' :
                             selectedContent.type === 'image' ? 'Görsel' : 'İnteraktif'}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {selectedContent.subject}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {selectedContent.grade}. Sınıf
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedContent.difficulty)}`}>
                            {selectedContent.difficulty === 'easy' ? 'Kolay' :
                             selectedContent.difficulty === 'medium' ? 'Orta' : 'Zor'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContent.status)}`}>
                            {selectedContent.status === 'published' ? 'Yayında' :
                             selectedContent.status === 'draft' ? 'Taslak' : 'Arşiv'}
                          </span>
                        </div>
                        
                        {selectedContent.description && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">Açıklama</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{selectedContent.description}</p>
                          </div>
                        )}

                        {selectedContent.tags && selectedContent.tags.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                              <Tag className="h-4 w-4" />
                              <span>Etiketler</span>
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedContent.tags.map((tag, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Görüntüleme</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">{selectedContent.views}</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Değerlendirme</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{selectedContent.rating}/5</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Download className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">İndirme</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">{selectedContent.downloadCount || 0}</p>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <Share2 className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">Paylaşım</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600">{selectedContent.shareCount || 0}</p>
                        </div>
                      </div>

                      {/* Author & Dates */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Yazar & Tarihler</span>
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yazar:</span>
                            <span className="font-medium">{selectedContent.author}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Oluşturulma:</span>
                            <span className="font-medium">{new Date(selectedContent.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Güncellenme:</span>
                            <span className="font-medium">{new Date(selectedContent.updatedAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'comments' && (
                <div className="p-6 space-y-6">
                  {/* Add Comment */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Yorum Ekle</h5>
                    <div className="space-y-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Yorumunuzu yazın..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Puan:</span>
                          <select 
                            value={commentRating}
                            onChange={(e) => setCommentRating(parseInt(e.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded"
                          >
                            {[1,2,3,4,5].map(rating => (
                              <option key={rating} value={rating}>{rating} ⭐</option>
                            ))}
                          </select>
                        </div>
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                          Yorum Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Yorumlar ({selectedContent.comments?.length || 0})</h5>
                    {selectedContent.comments?.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h6 className="font-medium text-gray-900">{comment.userName}</h6>
                              {comment.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">{comment.rating}</span>
                                </div>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.content}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="text-gray-500 hover:text-primary-600 flex items-center space-x-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>Beğen</span>
                              </button>
                              <button className="text-gray-500 hover:text-primary-600">Yanıtla</button>
                              <button className="text-gray-500 hover:text-red-600 flex items-center space-x-1">
                                <Flag className="h-3 w-3" />
                                <span>Şikayet Et</span>
                              </button>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start space-x-3">
                                    <img
                                      src={reply.userAvatar}
                                      alt={reply.userName}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h6 className="font-medium text-gray-900 text-sm">{reply.userName}</h6>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewTab === 'versions' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">Sürüm Geçmişi</h5>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Yeni Sürüm Oluştur
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedContent.versions?.map((version, index) => (
                      <div key={version.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              v{version.version}
                            </div>
                            {index === 0 && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Güncel
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-primary-600">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-primary-600">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h6 className="font-medium text-gray-900 mb-2">{version.description}</h6>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{version.author}</span>
                          <span>•</span>
                          <span>{new Date(version.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Değişiklikler:</h6>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {version.changes.map((change, changeIndex) => (
                              <li key={changeIndex}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewTab === 'analytics' && (
                <div className="p-6 space-y-6">
                  <h5 className="font-medium text-gray-900">İçerik Analitikleri</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Toplam Görüntüleme</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{selectedContent.views}</p>
                      <p className="text-sm text-blue-600">+12% bu hafta</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Download className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">İndirme</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{selectedContent.downloadCount}</p>
                      <p className="text-sm text-green-600">+8% bu hafta</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Share2 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Paylaşım</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{selectedContent.shareCount}</p>
                      <p className="text-sm text-purple-600">+15% bu hafta</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Yorum</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{selectedContent.comments?.length || 0}</p>
                      <p className="text-sm text-yellow-600">+3 yeni yorum</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h6 className="font-medium text-gray-900 mb-3">Kullanım Trendi</h6>
                    <div className="h-32 bg-white rounded border flex items-center justify-center">
                      <p className="text-gray-500">Grafik burada gösterilecek</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">En Çok Görüntüleyen Sınıflar</h6>
                      <div className="space-y-2">
                        {['8-A', '8-B', '7-A', '8-C'].map((grade, index) => (
                          <div key={grade} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{grade}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full" 
                                  style={{width: `${90 - index * 15}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{45 - index * 8}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">Ortalama Değerlendirme</h6>
                      <div className="space-y-2">
                        {[5,4,3,2,1].map((star) => (
                          <div key={star} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{star} ⭐</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : 3}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : star === 2 ? '3%' : '2%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Yeni İçerik Ekle</h3>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateContent(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik Türü</label>
                <select 
                  value={newContent.type}
                  onChange={(e) => setNewContent({...newContent, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="video">Video</option>
                  <option value="document">Doküman</option>
                  <option value="image">Görsel</option>
                  <option value="interactive">İnteraktif</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="İçerik başlığı"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ders</label>
                  <select 
                    value={newContent.subject}
                    onChange={(e) => setNewContent({...newContent, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="matematik">Matematik</option>
                    <option value="turkce">Türkçe</option>
                    <option value="fen">Fen Bilimleri</option>
                    <option value="sosyal">Sosyal Bilgiler</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sınıf</label>
                  <select 
                    value={newContent.grade}
                    onChange={(e) => setNewContent({...newContent, grade: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="5">5. Sınıf</option>
                    <option value="6">6. Sınıf</option>
                    <option value="7">7. Sınıf</option>
                    <option value="8">8. Sınıf</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                <input
                  type="text"
                  value={newContent.topic}
                  onChange={(e) => setNewContent({...newContent, topic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Konu başlığı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk Seviyesi</label>
                <select 
                  value={newContent.difficulty}
                  onChange={(e) => setNewContent({...newContent, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="easy">Kolay</option>
                  <option value="medium">Orta</option>
                  <option value="hard">Zor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosya Yükle</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Dosyayı buraya sürükleyin veya seçin</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept={
                      newContent.type === 'video' ? 'video/*' :
                      newContent.type === 'image' ? 'image/*' :
                      newContent.type === 'document' ? '.pdf,.doc,.docx,.ppt,.pptx' :
                      '*/*'
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('Dosya seçildi:', file.name);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Dosya Seç
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  rows={4}
                  value={newContent.description}
                  onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="İçerik açıklaması"
                />
              </div>
              
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Yükleniyor...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !newContent.title}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <span>Kaydet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;