import React, { useState, useRef } from 'react';
import { Brain, Wand2, BookOpen, FileText, Settings, Download, Upload, Sparkles, Target, Clock, Users, CheckCircle, X, Plus, Trash2, Edit, Copy, Save, RefreshCw, Zap, MessageSquare, PenTool, List, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'open_ended' | 'true_false' | 'fill_blank' | 'matching';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  estimatedTime: number;
  tags: string[];
  aiGenerated: boolean;
  createdAt: string;
}

interface QuestionSet {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  questions: Question[];
  totalPoints: number;
  estimatedDuration: number;
  createdAt: string;
  lastModified: string;
}

const QuestionGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'library' | 'sets'>('generator');
  const [selectedSubject, setSelectedSubject] = useState('matematik');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'open_ended' | 'true_false' | 'fill_blank' | 'matching'>('multiple_choice');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showCreateSetModal, setShowCreateSetModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const subjects = [
    { id: 'matematik', name: 'Matematik', topics: ['Cebir', 'Geometri', 'Trigonometri', 'İstatistik', 'Olasılık'] },
    { id: 'turkce', name: 'Türkçe', topics: ['Dil Bilgisi', 'Edebiyat', 'Yazım Kuralları', 'Anlam Bilgisi'] },
    { id: 'fen', name: 'Fen Bilimleri', topics: ['Fizik', 'Kimya', 'Biyoloji', 'Yer Bilimleri'] },
    { id: 'sosyal', name: 'Sosyal Bilgiler', topics: ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Ekonomi'] }
  ];

  const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'multiple_choice',
      subject: 'Matematik',
      topic: 'Cebir',
      difficulty: 'medium',
      question: 'x + 5 = 12 denkleminde x\'in değeri nedir?',
      options: ['5', '7', '12', '17'],
      correctAnswer: 1,
      explanation: 'x + 5 = 12 denkleminde x = 12 - 5 = 7 olur.',
      points: 10,
      estimatedTime: 2,
      tags: ['denklem', 'temel cebir'],
      aiGenerated: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'open_ended',
      subject: 'Türkçe',
      topic: 'Edebiyat',
      difficulty: 'hard',
      question: 'Tanzimat Dönemi edebiyatının özelliklerini açıklayınız.',
      correctAnswer: 'Tanzimat Dönemi edebiyatı Batı etkisinde gelişmiş, toplumsal konuları işlemiş ve yeni türler ortaya çıkarmıştır.',
      explanation: 'Bu dönemde roman, hikaye gibi türler gelişmiş, toplumsal eleştiri ön plana çıkmıştır.',
      points: 25,
      estimatedTime: 15,
      tags: ['tanzimat', 'edebiyat tarihi'],
      aiGenerated: false,
      createdAt: '2024-01-14T14:20:00Z'
    }
  ];

  const mockQuestionSets: QuestionSet[] = [
    {
      id: '1',
      title: '8. Sınıf Matematik - Cebir Testi',
      description: 'Temel cebir konularını kapsayan kapsamlı test',
      subject: 'Matematik',
      grade: 8,
      questions: mockQuestions,
      totalPoints: 100,
      estimatedDuration: 45,
      createdAt: '2024-01-15T09:00:00Z',
      lastModified: '2024-01-15T16:30:00Z'
    }
  ];

  // AI Question Generation Simulation
  const generateQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newQuestions: Question[] = [];
    const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
    
    for (let i = 0; i < questionCount; i++) {
      const question: Question = {
        id: `gen_${Date.now()}_${i}`,
        type: questionType,
        subject: selectedSubjectData?.name || 'Matematik',
        topic: selectedTopic || selectedSubjectData?.topics[0] || 'Genel',
        difficulty: selectedDifficulty,
        question: generateSampleQuestion(questionType, selectedSubject, selectedTopic, selectedDifficulty),
        ...(questionType === 'multiple_choice' && {
          options: generateOptions(selectedSubject, selectedTopic)
        }),
        correctAnswer: questionType === 'multiple_choice' ? 0 : 'Örnek doğru cevap',
        explanation: 'AI tarafından oluşturulan açıklama',
        points: selectedDifficulty === 'easy' ? 5 : selectedDifficulty === 'medium' ? 10 : 15,
        estimatedTime: selectedDifficulty === 'easy' ? 2 : selectedDifficulty === 'medium' ? 5 : 8,
        tags: [selectedTopic.toLowerCase(), selectedDifficulty],
        aiGenerated: true,
        createdAt: new Date().toISOString()
      };
      
      newQuestions.push(question);
    }
    
    setGeneratedQuestions(newQuestions);
    setIsGenerating(false);
  };

  const generateSampleQuestion = (type: string, subject: string, topic: string, difficulty: string): string => {
    const templates = {
      matematik: {
        easy: 'Basit matematik problemi: 2 + 3 = ?',
        medium: 'Orta seviye problem: x + 5 = 12 denkleminde x kaçtır?',
        hard: 'Zor problem: f(x) = 2x² + 3x - 1 fonksiyonunun türevi nedir?'
      },
      turkce: {
        easy: 'Aşağıdaki kelimelerin hangisi isimdir?',
        medium: 'Verilen cümlede özne hangisidir?',
        hard: 'Tanzimat Dönemi edebiyatının özelliklerini açıklayınız.'
      }
    };
    
    return templates[subject as keyof typeof templates]?.[difficulty as keyof typeof templates.matematik] || 
           'AI tarafından oluşturulan örnek soru';
  };

  const generateOptions = (subject: string, topic: string): string[] => {
    return ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'];
  };

  const handleQuestionEdit = (question: Question) => {
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const handleQuestionDelete = (questionId: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleQuestionDuplicate = (question: Question) => {
    const duplicated = {
      ...question,
      id: `dup_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGeneratedQuestions(prev => [...prev, duplicated]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      alert(`${file.name} dosyası yükleniyor... Sorular çıkarılacak.`);
      setShowUploadModal(false);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <List className="h-4 w-4" />;
      case 'open_ended': return <MessageSquare className="h-4 w-4" />;
      case 'true_false': return <CheckCircle className="h-4 w-4" />;
      case 'fill_blank': return <PenTool className="h-4 w-4" />;
      case 'matching': return <Target className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
              <Brain className="h-8 w-8" />
              <span>AI Soru Üretici</span>
            </h2>
            <p className="text-purple-100">RAG ve fine-tuning ile akıllı soru hazırlama sistemi</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>İçerik Yükle</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>AI Ayarları</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'generator', label: 'Soru Üretici', icon: Wand2 },
              { id: 'library', label: 'Soru Bankası', icon: BookOpen },
              { id: 'sets', label: 'Soru Setleri', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
          {/* Generator Tab */}
          {activeTab === 'generator' && (
            <div className="space-y-6">
              {/* Generation Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ders</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Tüm Konular</option>
                    {subjects.find(s => s.id === selectedSubject)?.topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="easy">Kolay</option>
                    <option value="medium">Orta</option>
                    <option value="hard">Zor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soru Tipi</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="multiple_choice">Çoktan Seçmeli</option>
                    <option value="open_ended">Açık Uçlu</option>
                    <option value="true_false">Doğru/Yanlış</option>
                    <option value="fill_blank">Boşluk Doldurma</option>
                    <option value="matching">Eşleştirme</option>
                  </select>
                </div>
              </div>

              {/* Generation Controls */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Soru Üretimi</h3>
                    <p className="text-sm text-gray-600">AI ile otomatik soru oluşturun</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soru Sayısı</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <button
                      onClick={generateQuestions}
                      disabled={isGenerating}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{isGenerating ? 'Üretiliyor...' : 'Soru Üret'}</span>
                    </button>
                  </div>
                </div>

                {isGenerating && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse bg-purple-100 p-2 rounded-lg">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">AI Soru Üretiyor...</p>
                        <p className="text-sm text-gray-600">RAG algoritması ile içerik analiz ediliyor</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Questions */}
              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Üretilen Sorular ({generatedQuestions.length})</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowCreateSetModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Set Olarak Kaydet</span>
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Dışa Aktar</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {generatedQuestions.map((question, index) => (
                      <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              {getQuestionTypeIcon(question.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Soru {index + 1}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty === 'easy' ? 'Kolay' : question.difficulty === 'medium' ? 'Orta' : 'Zor'}
                                </span>
                                <span className="text-xs text-gray-500">{question.points} puan</span>
                                <span className="text-xs text-gray-500">{question.estimatedTime} dk</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleQuestionEdit(question)}
                              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleQuestionDuplicate(question)}
                              className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleQuestionDelete(question.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                          {question.options && (
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex}
                                  className={`p-2 rounded-lg border text-sm ${
                                    optionIndex === question.correctAnswer 
                                      ? 'bg-green-50 border-green-200 text-green-800' 
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}) {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Açıklama:</span> {question.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Soru Bankası</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Manuel Soru Ekle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          {getQuestionTypeIcon(question.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{question.subject} - {question.topic}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty === 'easy' ? 'Kolay' : question.difficulty === 'medium' ? 'Orta' : 'Zor'}
                            </span>
                            {question.aiGenerated && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center space-x-1">
                                <Zap className="h-3 w-3" />
                                <span>AI</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{question.question}</p>
                    
                    {question.options && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded-lg border text-sm ${
                              optionIndex === question.correctAnswer 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}) {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sets Tab */}
          {activeTab === 'sets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Soru Setleri</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Yeni Set Oluştur</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockQuestionSets.map((set) => (
                  <div key={set.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{set.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{set.description}</p>
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {set.subject} - {set.grade}. Sınıf
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Soru Sayısı</span>
                        <span className="font-medium">{set.questions.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Toplam Puan</span>
                        <span className="font-medium">{set.totalPoints}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Süre</span>
                        <span className="font-medium">{set.estimatedDuration} dk</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-6">
                      <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
                        Düzenle
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm">
                        Önizle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">İçerik Yükle</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Dosya yükleyin veya sürükleyip bırakın</p>
                  <p className="text-sm text-gray-500">PDF, DOCX, TXT desteklenir</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Dosya Seç
                  </button>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI İçerik Analizi</h4>
                  <p className="text-sm text-blue-700">
                    Yüklenen içerik AI tarafından analiz edilecek ve otomatik olarak sorular üretilecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Set Modal */}
      {showCreateSetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Soru Seti Oluştur</h2>
                <button 
                  onClick={() => setShowCreateSetModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Set Adı</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="örn: 8. Sınıf Matematik Testi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    placeholder="Test açıklaması..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf Seviyesi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option>5. Sınıf</option>
                    <option>6. Sınıf</option>
                    <option>7. Sınıf</option>
                    <option>8. Sınıf</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateSetModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Oluştur
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

export default QuestionGenerator; 