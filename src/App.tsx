import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChildrenProvider } from './contexts/ChildrenContext';
import AuthPage from './components/auth/AuthPage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TestInterface from './components/TestInterface';
import LearningPlan from './components/LearningPlan';
import AILearningPlan from './components/AILearningPlan';
import Achievements from './components/Achievements';
import ClassManagement from './components/ClassManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContentManagement from './components/ContentManagement';
import MessagingSystem from './components/MessagingSystem';
import AIChat from './components/AIChat';
import ActivityTracker from './components/ActivityTracker';
import VideoLearning from './components/VideoLearning';
import Calendar from './components/Calendar';
import Children from './components/Children';
import Communication from './components/Communication';
import Reports from './components/Reports';
import DevelopmentTracking from './components/DevelopmentTracking';
import HomeworkTracking from './components/HomeworkTracking';
import AchievementNotifications from './components/AchievementNotifications';
import StudyTimeAnalytics from './components/StudyTimeAnalytics';
import QuestionGenerator from './components/QuestionGenerator';
import ExamCreator from './components/ExamCreator';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  // viewChange olayını dinleyen event listener
  React.useEffect(() => {
    const handleViewChange = (event: any) => {
      if (event.detail) {
        setCurrentView(event.detail);
      }
    };

    window.addEventListener('viewChange', handleViewChange);
    return () => {
      window.removeEventListener('viewChange', handleViewChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard />
            <ActivityTracker />
          </div>
        );
      case 'test':
        return <TestInterface />;
      case 'plan':
        return <LearningPlan />;
      case 'ai-plan':
        return <AILearningPlan />;
      case 'achievements':
        return <Achievements />;
      case 'students':
        return <ClassManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content':
        return <ContentManagement />;
      case 'messaging':
        return <MessagingSystem />;
      case 'ai-chat':
        return <AIChat />;
      case 'video-learning':
        return <VideoLearning topic="Doğrusal Denklemler" />;
      case 'calendar':
        return <Calendar />;
      case 'children':
        return <Children />;
      case 'reports':
        return <Reports />;
      case 'communication':
        return <Communication />;
      case 'development-tracking':
        return <DevelopmentTracking />;
      case 'homework-tracking':
        return <HomeworkTracking />;
      case 'achievement-notifications':
        return <AchievementNotifications />;
      case 'study-time-analytics':
        return <StudyTimeAnalytics />;
      case 'question-generator':
        return <QuestionGenerator />;
      case 'exam-creator':
        return <ExamCreator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ChildrenProvider>
        <AppContent />
      </ChildrenProvider>
    </AuthProvider>
  );
}

export default App;