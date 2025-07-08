import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Users, BookOpen } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'lesson' | 'test' | 'meeting' | 'assignment';
  subject?: string;
  participants?: string[];
  description?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Matematik Dersi',
      date: '2024-01-15',
      time: '09:00',
      type: 'lesson',
      subject: 'Matematik',
      participants: ['Ahmet Öğretmen'],
      description: 'Doğrusal denklemler konusu'
    },
    {
      id: '2',
      title: 'Geometri Testi',
      date: '2024-01-16',
      time: '14:00',
      type: 'test',
      subject: 'Matematik',
      description: 'Üçgenler ve dörtgenler konularından test'
    },
    {
      id: '3',
      title: 'Veli Toplantısı',
      date: '2024-01-18',
      time: '19:00',
      type: 'meeting',
      participants: ['Ayşe Öğretmen', 'Veliler'],
      description: 'Dönem sonu değerlendirme toplantısı'
    }
  ]);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'test': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'assignment': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'test': return Clock;
      case 'meeting': return Users;
      case 'assignment': return CalendarIcon;
      default: return CalendarIcon;
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowEventModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Etkinlik Ekle</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isToday = day.date.toDateString() === today.toDateString();
          const isSelected = selectedDate?.toDateString() === day.date.toDateString();
          
          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${
                isSelected ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => {
                  const Icon = getEventTypeIcon(event.type);
                  return (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                    >
                      <div className="flex items-center space-x-1">
                        <Icon className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="truncate">{event.title}</div>
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} daha
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDate(selectedDate).map(event => {
              const Icon = getEventTypeIcon(event.type);
              return (
                <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{event.time}</span>
                        {event.subject && <span>{event.subject}</span>}
                        {event.participants && (
                          <span>{event.participants.join(', ')}</span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {getEventsForDate(selectedDate).length === 0 && (
              <p className="text-gray-500 text-center py-4">Bu tarihte etkinlik bulunmuyor</p>
            )}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Etkinlik</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Etkinlik başlığı"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="lesson">Ders</option>
                  <option value="test">Test</option>
                  <option value="meeting">Toplantı</option>
                  <option value="assignment">Ödev</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Etkinlik açıklaması"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;