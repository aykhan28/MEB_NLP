export interface Student {
  id: string;
  name: string;
  grade: number;
  avatar: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  subject: string;
  mastered: boolean;
  progress: number;
  lastUpdated: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  achievement: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpent: number;
  weakAchievements: string[];
}

export interface LearningPlan {
  id: string;
  studentId: string;
  subject: string;
  weeklyGoals: string[];
  recommendedContent: ContentRecommendation[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  type: 'video' | 'exercise' | 'reading' | 'interactive';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  achievement: string;
  completed: boolean;
}

export interface ProgressData {
  date: string;
  score: number;
  subject: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'parent';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface StudentUser extends User {
  role: 'student';
  grade: number;
  studentNumber: string;
  parentId?: string;
  teacherId?: string;
  subjects: string[];
}

export interface TeacherUser extends User {
  role: 'teacher';
  subjects: string[];
  grades: number[];
  school: string;
  studentIds: string[];
}

export interface ParentUser extends User {
  role: 'parent';
  children: string[];
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: 'student' | 'teacher' | 'parent';
  grade?: number;
  studentNumber?: string;
  subjects?: string[];
  school?: string;
  phone?: string;
}