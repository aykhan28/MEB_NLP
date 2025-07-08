import { Student, Achievement, TestQuestion, TestResult, LearningPlan, ProgressData } from '../types';

export const mockStudent: Student = {
  id: '1',
  name: 'Ahmet Yılmaz',
  grade: 8,
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
};

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Doğrusal Denklemler',
    description: 'Bir bilinmeyenli birinci derece denklemleri çözer',
    subject: 'Matematik',
    mastered: true,
    progress: 95,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Geometrik Şekiller',
    description: 'Üçgen ve dörtgenlerin özelliklerini analiz eder',
    subject: 'Matematik',
    mastered: false,
    progress: 65,
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    title: 'Oran ve Orantı',
    description: 'Oran ve orantı problemlerini çözer',
    subject: 'Matematik',
    mastered: false,
    progress: 40,
    lastUpdated: '2024-01-13'
  },
  {
    id: '4',
    title: 'Veri Analizi',
    description: 'Grafik ve tabloları yorumlar',
    subject: 'Matematik',
    mastered: true,
    progress: 88,
    lastUpdated: '2024-01-12'
  }
];

export const mockQuestions: TestQuestion[] = [
  {
    id: '1',
    question: 'Aşağıdaki denklemlerden hangisi doğru çözümü verir? 2x + 5 = 13',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 1,
    subject: 'Matematik',
    achievement: 'Doğrusal Denklemler',
    difficulty: 'medium'
  },
  {
    id: '2',
    question: 'Bir üçgenin iç açıları toplamı kaç derecedir?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: 1,
    subject: 'Matematik',
    achievement: 'Geometrik Şekiller',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: '12:18 oranı aşağıdakilerden hangisine eşittir?',
    options: ['2:3', '3:2', '4:6', '6:9'],
    correctAnswer: 0,
    subject: 'Matematik',
    achievement: 'Oran ve Orantı',
    difficulty: 'medium'
  }
];

export const mockTestResults: TestResult[] = [
  {
    id: '1',
    testId: 'test-1',
    studentId: '1',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    completedAt: '2024-01-15T10:30:00Z',
    timeSpent: 25,
    weakAchievements: ['Oran ve Orantı']
  },
  {
    id: '2',
    testId: 'test-2',
    studentId: '1',
    score: 72,
    totalQuestions: 8,
    correctAnswers: 6,
    completedAt: '2024-01-14T14:20:00Z',
    timeSpent: 18,
    weakAchievements: ['Geometrik Şekiller', 'Oran ve Orantı']
  }
];

export const mockLearningPlan: LearningPlan = {
  id: '1',
  studentId: '1',
  subject: 'Matematik',
  weeklyGoals: [
    'Oran ve orantı problemlerinde %75 başarı',
    'Geometrik şekillerin özelliklerini pekiştir',
    'Günlük 3 soru çöz'
  ],
  recommendedContent: [
    {
      id: '1',
      title: 'Oran ve Orantı Temel Kavramlar',
      type: 'video',
      duration: 15,
      difficulty: 'easy',
      achievement: 'Oran ve Orantı',
      completed: false
    },
    {
      id: '2',
      title: 'Üçgen Özellikleri Alıştırmaları',
      type: 'exercise',
      duration: 20,
      difficulty: 'medium',
      achievement: 'Geometrik Şekiller',
      completed: true
    },
    {
      id: '3',
      title: 'İnteraktif Geometri Simülasyonu',
      type: 'interactive',
      duration: 30,
      difficulty: 'medium',
      achievement: 'Geometrik Şekiller',
      completed: false
    }
  ],
  createdAt: '2024-01-10T09:00:00Z',
  updatedAt: '2024-01-15T16:30:00Z'
};

export const mockProgressData: ProgressData[] = [
  { date: '2024-01-01', score: 65, subject: 'Matematik' },
  { date: '2024-01-02', score: 72, subject: 'Matematik' },
  { date: '2024-01-03', score: 68, subject: 'Matematik' },
  { date: '2024-01-04', score: 75, subject: 'Matematik' },
  { date: '2024-01-05', score: 78, subject: 'Matematik' },
  { date: '2024-01-06', score: 82, subject: 'Matematik' },
  { date: '2024-01-07', score: 85, subject: 'Matematik' },
  { date: '2024-01-08', score: 88, subject: 'Matematik' },
  { date: '2024-01-09', score: 85, subject: 'Matematik' },
  { date: '2024-01-10', score: 90, subject: 'Matematik' },
  { date: '2024-01-11', score: 87, subject: 'Matematik' },
  { date: '2024-01-12', score: 92, subject: 'Matematik' },
  { date: '2024-01-13', score: 89, subject: 'Matematik' },
  { date: '2024-01-14', score: 94, subject: 'Matematik' },
  { date: '2024-01-15', score: 96, subject: 'Matematik' }
];