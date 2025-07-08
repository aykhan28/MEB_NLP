import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp, Award, BookOpen, Play, CheckCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'study' | 'test' | 'achievement' | 'login';
  title: string;
  description: string;
  duration?: number;
  score?: number;
  timestamp: string;
  subject?: string;
}

const ActivityTracker: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    // Simulated activities
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'study',
        title: 'Doğrusal Denklemler',
        description: 'Konu anlatımı tamamlandı',
        duration: 25,
        timestamp: new Date().toISOString(),
        subject: 'Matematik'
      },
      {
        id: '2',
        type: 'test',
        title: 'Geometri Testi',
        description: '8 soruluk test çözüldü',
        score: 87,
        duration: 15,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        subject: 'Matematik'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'İlk Test Tamamlandı',
        description: 'İlk matematik testini başarıyla tamamladın!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'login',
        title: 'Sisteme Giriş',
        description: 'Platforma giriş yapıldı',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setActivities(mockActivities);
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [newActivity, ...prev]);
    
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('user_activities') || '[]');
    saved.unshift(newActivity);
    localStorage.setItem('user_activities', JSON.stringify(saved.slice(0, 100))); // Keep last 100
  };

  const getFilteredActivities = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      
      switch (filter) {
        case 'today':
          return activityDate >= today;
        case 'week':
          return activityDate >= weekAgo;
        case 'month':
          return activityDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study': return BookOpen;
      case 'test': return Target;
      case 'achievement': return Award;
      case 'login': return Clock;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-600';
      case 'test': return 'bg-green-100 text-green-600';
      case 'achievement': return 'bg-yellow-100 text-yellow-600';
      case 'login': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString('tr-TR');
    } else if (hours > 0) {
      return `${hours} saat önce`;
    } else if (minutes > 0) {
      return `${minutes} dakika önce`;
    } else {
      return 'Az önce';
    }
  };

  const filteredActivities = getFilteredActivities();

  // Expose addActivity function globally for other components
  React.useEffect(() => {
    (window as any).addActivity = addActivity;
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <span>Aktivite Geçmişi</span>
        </h3>
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'today', label: 'Bugün' },
            { key: 'week', label: 'Bu Hafta' },
            { key: 'month', label: 'Bu Ay' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === option.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Bu dönemde aktivite bulunmuyor</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                    <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    {activity.subject && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {activity.subject}
                      </span>
                    )}
                    
                    {activity.duration && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration} dk</span>
                      </div>
                    )}
                    
                    {activity.score && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>{activity.score}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityTracker;