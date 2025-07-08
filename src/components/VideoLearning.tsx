import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, CheckCircle, BookOpen } from 'lucide-react';

interface VideoLearningProps {
  topic: string;
  onComplete?: () => void;
}

const VideoLearning: React.FC<VideoLearningProps> = ({ topic, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  // Mock video data
  const videoData = {
    title: `${topic} - Video Ders`,
    description: `${topic} konusunu detaylı olarak öğrenin. Bu videoda temel kavramlar, örnekler ve uygulamalar yer almaktadır.`,
    thumbnail: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
    chapters: [
      { time: 0, title: 'Giriş ve Temel Kavramlar' },
      { time: 60, title: 'Örnekler ve Uygulamalar' },
      { time: 180, title: 'Problem Çözme Teknikleri' },
      { time: 240, title: 'Özet ve Değerlendirme' }
    ]
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgress((newTime / duration) * 100);
          
          if (newTime >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            if (onComplete) onComplete();
            
            // Add completion activity
            if ((window as any).addActivity) {
              (window as any).addActivity({
                type: 'study',
                title: `${topic} Video Dersi`,
                description: 'Video ders başarıyla tamamlandı',
                duration: Math.floor(duration / 60),
                subject: 'Matematik'
              });
            }
            
            return duration;
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const jumpToChapter = (time: number) => {
    setCurrentTime(time);
    setProgress((time / duration) * 100);
  };

  const getCurrentChapter = () => {
    return videoData.chapters
      .slice()
      .reverse()
      .find(chapter => currentTime >= chapter.time);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Video Player */}
      <div className="relative bg-black aspect-video">
        <img
          src={videoData.thumbnail}
          alt={videoData.title}
          className="w-full h-full object-cover"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-4 text-white">
            <button onClick={togglePlay} className="hover:text-primary-400 transition-colors duration-200">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hover:text-primary-400 transition-colors duration-200"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            
            <div className="flex-1 flex items-center space-x-2">
              <span className="text-sm">{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div
                  className="bg-primary-500 h-1 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm">{formatTime(duration)}</span>
            </div>
            
            <button className="hover:text-primary-400 transition-colors duration-200">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Current Chapter Indicator */}
        {getCurrentChapter() && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm">
            {getCurrentChapter()?.title}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{videoData.title}</h3>
        <p className="text-gray-600 mb-4">{videoData.description}</p>

        {/* Chapters */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Bölümler</h4>
          <div className="space-y-2">
            {videoData.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => jumpToChapter(chapter.time)}
                className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                  getCurrentChapter()?.time === chapter.time
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-sm text-gray-500">{formatTime(chapter.time)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Notlarım</h4>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showNotes ? 'Gizle' : 'Göster'}
            </button>
          </div>
          
          {showNotes && (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Video ile ilgili notlarınızı buraya yazabilirsiniz..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm">
                Notu Kaydet
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => {
              setCurrentTime(0);
              setProgress(0);
              setIsPlaying(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Baştan İzle</span>
          </button>
          
          {progress >= 80 && (
            <button
              onClick={onComplete}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Dersi Tamamla</span>
            </button>
          )}
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            <BookOpen className="h-4 w-4" />
            <span>Alıştırmalara Geç</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoLearning;