import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw, Trophy, AlertCircle, BookOpen, Target, Brain, Star, TrendingUp, Award, Play, Pause, Settings, BarChart3, PieChart, Users, Lightbulb } from 'lucide-react';
import { mockQuestions } from '../data/mockData';
import { TestQuestion } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const TestInterface: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [testMode, setTestMode] = useState<'practice' | 'exam' | 'adaptive'>('practice');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [testStarted, setTestStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);

  useEffect(() => {
    if (timeRemaining > 0 && !testCompleted && testStarted && !isPaused) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && testStarted) {
      handleSubmit();
    }
  }, [timeRemaining, testCompleted, testStarted, isPaused]);

  useEffect(() => {
    if (testStarted && !testCompleted) {
      setCurrentQuestionStartTime(Date.now());
    }
  }, [currentQuestion, testStarted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestionStartTime(Date.now());
    setTimeRemaining(testMode === 'practice' ? 1800 : testMode === 'exam' ? 3600 : 2400);
  };

  const pauseTest = () => {
    setIsPaused(!isPaused);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    // Record time spent on this question
    const timeSpent = Math.round((Date.now() - currentQuestionStartTime) / 1000);
    const newTimes = [...questionTimes];
    newTimes[currentQuestion] = timeSpent;
    setQuestionTimes(newTimes);

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Show correct answer in practice mode
    if (testMode === 'practice') {
      setShowCorrectAnswer(true);
    }
    
    // Add activity
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: 'test',
        title: `Soru ${currentQuestion + 1} Yanıtlandı`,
        description: `${mockQuestions[currentQuestion].achievement} sorusu yanıtlandı`,
        subject: mockQuestions[currentQuestion].subject
      });
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed([...hintsUsed, currentQuestion]);
  };

  const handleNext = () => {
    setShowCorrectAnswer(false);
    setShowHint(false);
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    setShowCorrectAnswer(false);
    setShowHint(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setTestCompleted(true);
    setShowResults(true);
    
    // Add completion activity
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: 'achievement',
        title: 'Test Tamamlandı',
        description: `${mockQuestions.length} soruluk test başarıyla tamamlandı`,
        score: calculateScore()
      });
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === mockQuestions[index]?.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / mockQuestions.length) * 100);
  };

  const getDetailedAnalysis = () => {
    const score = calculateScore();
    const totalTime = 1800 - timeRemaining;
    const avgTimePerQuestion = totalTime / mockQuestions.length;
    
    const subjectPerformance: { [key: string]: { correct: number; total: number } } = {};
    const difficultyPerformance: { [key: string]: { correct: number; total: number } } = {};
    
    selectedAnswers.forEach((answer, index) => {
      const question = mockQuestions[index];
      const isCorrect = answer === question?.correctAnswer;
      
      // Subject analysis
      if (!subjectPerformance[question.subject]) {
        subjectPerformance[question.subject] = { correct: 0, total: 0 };
      }
      subjectPerformance[question.subject].total++;
      if (isCorrect) subjectPerformance[question.subject].correct++;
      
      // Difficulty analysis
      const diff = question.difficulty || 'medium';
      if (!difficultyPerformance[diff]) {
        difficultyPerformance[diff] = { correct: 0, total: 0 };
      }
      difficultyPerformance[diff].total++;
      if (isCorrect) difficultyPerformance[diff].correct++;
    });

    const weakAreas = Object.entries(subjectPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) < 0.7)
      .map(([subject]) => subject);

    const strongAreas = Object.entries(subjectPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) >= 0.8)
      .map(([subject]) => subject);

    return {
      score,
      totalTime,
      avgTimePerQuestion,
      subjectPerformance,
      difficultyPerformance,
      weakAreas,
      strongAreas,
      hintsUsed: hintsUsed.length,
      correct: selectedAnswers.filter((answer, index) => answer === mockQuestions[index]?.correctAnswer).length,
      total: mockQuestions.length,
      questionTimes
    };
  };

  const getPersonalizedRecommendations = (analysis: any) => {
    const recommendations = [];
    
    if (analysis.score >= 90) {
      recommendations.push("🌟 Mükemmel performans! Daha zorlu konulara geçebilirsin.");
    } else if (analysis.score >= 70) {
      recommendations.push("👍 İyi bir performans! Eksik konuları pekiştir.");
    } else {
      recommendations.push("📚 Temel konuları tekrar etmen öneriliyor.");
    }
    
    if (analysis.avgTimePerQuestion > 120) {
      recommendations.push("⏱️ Zaman yönetimini geliştir. Daha hızlı karar vermeye çalış.");
    } else if (analysis.avgTimePerQuestion < 60) {
      recommendations.push("🤔 Sorulara daha dikkatli yaklaş. Acele etme.");
    }
    
    if (analysis.hintsUsed > mockQuestions.length * 0.3) {
      recommendations.push("💡 Çok fazla ipucu kullandın. Özgüvenini artır.");
    }
    
    analysis.weakAreas.forEach((area: string) => {
      recommendations.push(`📖 ${area} konusunda ek çalışma yapman öneriliyor.`);
    });
    
    return recommendations;
  };

  // Test Setup Screen
  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-2">Akıllı Test Sistemi</h2>
          <p className="text-primary-100">AI destekli kişiselleştirilmiş değerlendirme</p>
        </div>

        {/* Test Mode Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Türü Seç</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                mode: 'practice' as const,
                title: 'Pratik Modu',
                description: 'Anında geri bildirim, ipucu kullanımı',
                duration: '30 dakika',
                icon: BookOpen,
                color: 'bg-blue-50 border-blue-200 text-blue-800'
              },
              {
                mode: 'exam' as const,
                title: 'Sınav Modu',
                description: 'Gerçek sınav koşulları, zaman baskısı',
                duration: '60 dakika',
                icon: Award,
                color: 'bg-red-50 border-red-200 text-red-800'
              },
              {
                mode: 'adaptive' as const,
                title: 'Uyarlanabilir Test',
                description: 'AI tarafından seviye ayarlaması',
                duration: '40 dakika',
                icon: Brain,
                color: 'bg-purple-50 border-purple-200 text-purple-800'
              }
            ].map((testType) => (
              <div
                key={testType.mode}
                onClick={() => setTestMode(testType.mode)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  testMode === testType.mode
                    ? testType.color
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <testType.icon className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-semibold text-center mb-2">{testType.title}</h4>
                <p className="text-sm text-gray-600 text-center mb-2">{testType.description}</p>
                <p className="text-xs text-gray-500 text-center">{testType.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zorluk Seviyesi</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { level: 'easy' as const, label: 'Kolay', color: 'bg-green-100 text-green-800' },
              { level: 'medium' as const, label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
              { level: 'hard' as const, label: 'Zor', color: 'bg-red-100 text-red-800' }
            ].map((diff) => (
              <button
                key={diff.level}
                onClick={() => setDifficulty(diff.level)}
                className={`p-3 rounded-lg text-center font-medium transition-colors duration-200 ${
                  difficulty === diff.level
                    ? diff.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test İstatistikleri</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-900">{mockQuestions.length}</p>
              <p className="text-sm text-blue-600">Soru</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-900">1.247</p>
              <p className="text-sm text-green-600">Katılımcı</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-900">78%</p>
              <p className="text-sm text-yellow-600">Ortalama</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-900">4.8</p>
              <p className="text-sm text-purple-600">Değerlendirme</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startTest}
          className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <Play className="h-6 w-6" />
          <span>Teste Başla</span>
        </button>
      </div>
    );
  }

  if (showResults) {
    const analysis = getDetailedAnalysis();
    const recommendations = getPersonalizedRecommendations(analysis);
    
    const subjectChartData = Object.entries(analysis.subjectPerformance).map(([subject, perf]) => ({
      subject,
      percentage: Math.round((perf.correct / perf.total) * 100),
      correct: perf.correct,
      total: perf.total
    }));

    const difficultyChartData = Object.entries(analysis.difficultyPerformance).map(([difficulty, perf]) => ({
      difficulty: difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor',
      percentage: Math.round((perf.correct / perf.total) * 100),
      correct: perf.correct,
      total: perf.total
    }));

    const timeChartData = analysis.questionTimes.map((time, index) => ({
      question: `S${index + 1}`,
      time,
      avgTime: analysis.avgTimePerQuestion
    }));
    
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-2">Test Sonuçların</h2>
          <p className="text-primary-100">Detaylı analiz ve kişiselleştirilmiş öneriler</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-600">{analysis.score}%</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Genel Başarı</h3>
            <p className="text-gray-600 text-sm">{analysis.correct}/{analysis.total} doğru</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">Süre</h3>
            <p className="text-gray-600 text-sm">{formatTime(analysis.totalTime)}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <Target className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">Ortalama Süre</h3>
            <p className="text-gray-600 text-sm">{Math.round(analysis.avgTimePerQuestion)}s/soru</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <Lightbulb className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">İpucu</h3>
            <p className="text-gray-600 text-sm">{analysis.hintsUsed} kullanıldı</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konu Bazında Performans</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Başarı Oranı']} />
                  <Bar dataKey="percentage" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Soru Bazında Süre Analizi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}s`, 'Süre']} />
                  <Line type="monotone" dataKey="time" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="avgTime" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Destekli Analiz</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths and Weaknesses */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Güçlü ve Zayıf Alanlar</h4>
              <div className="space-y-3">
                {analysis.strongAreas.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">💪 Güçlü Alanlar</h5>
                    <ul className="text-green-800 text-sm space-y-1">
                      {analysis.strongAreas.map((area: string, index: number) => (
                        <li key={index}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysis.weakAreas.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">📚 Geliştirilmesi Gereken Alanlar</h5>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      {analysis.weakAreas.map((area: string, index: number) => (
                        <li key={index}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Kişiselleştirilmiş Öneriler</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="text-blue-800 space-y-2 text-sm">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswers([]);
              setTestCompleted(false);
              setShowResults(false);
              setShowCorrectAnswer(false);
              setTestStarted(false);
              setQuestionTimes([]);
              setHintsUsed([]);
              setTimeRemaining(1800);
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Yeni Test</span>
          </button>
          
          <button className="bg-secondary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-700 transition-colors duration-200 flex items-center justify-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Öğrenme Planı</span>
          </button>
          
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Detaylı Rapor</span>
          </button>
        </div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const correctAnswer = question?.correctAnswer;
  const progressPercentage = ((currentQuestion + 1) / mockQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Test Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              Soru {currentQuestion + 1} / {mockQuestions.length}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              testMode === 'practice' ? 'bg-blue-100 text-blue-800' :
              testMode === 'exam' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {testMode === 'practice' ? 'Pratik' : testMode === 'exam' ? 'Sınav' : 'Uyarlanabilir'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={pauseTest}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {isPaused && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Pause className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-800 font-medium">Test Duraklatıldı</p>
            <p className="text-yellow-600 text-sm">Devam etmek için oynat butonuna tıklayın</p>
          </div>
        )}
      </div>

      {!isPaused && (
        <>
          {/* Question Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {question.subject}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {question.achievement}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
              </div>
              
              {testMode === 'practice' && !hintsUsed.includes(currentQuestion) && (
                <button
                  onClick={useHint}
                  className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>İpucu</span>
                </button>
              )}
            </div>

            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">İpucu</span>
                </div>
                <p className="text-yellow-800 text-sm">
                  Bu soru {question.subject} konusunda {question.achievement} kazanımıyla ilgilidir. 
                  Temel kavramları hatırlayarak adım adım çözmeye çalışın.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === correctAnswer;
                const showAnswer = showCorrectAnswer && isAnswered;
                
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
                
                if (showAnswer) {
                  if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-50 text-green-900";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "border-red-500 bg-red-50 text-red-900";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                  }
                } else if (isSelected) {
                  buttonClass += "border-primary-500 bg-primary-50 text-primary-900";
                } else {
                  buttonClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => !isAnswered && handleAnswerSelect(index)}
                    disabled={isAnswered && testMode !== 'practice'}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showAnswer && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showAnswer && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showCorrectAnswer && testMode === 'practice' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Açıklama</h4>
                <p className="text-blue-800 text-sm">
                  Doğru cevap: {question.options[correctAnswer]}. 
                  Bu soru {question.achievement} konusundaki temel kavramları test etmektedir.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>

            <div className="flex items-center space-x-2">
              {mockQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                    index === currentQuestion
                      ? 'bg-primary-600 text-white'
                      : selectedAnswers[index] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === mockQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Testi Bitir
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Sonraki
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TestInterface;