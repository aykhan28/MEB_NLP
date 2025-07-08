import React, { useState } from 'react';
import { MessageCircle, Users, Mail, Phone, Calendar, Video, AlertCircle, FileText, Send } from 'lucide-react';
import ComingSoonFeature from './ComingSoonFeature';

const Communication: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    alert('İletişim özelliği henüz aktif değil. Mesajınız gönderilmedi.');
    setMessageText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">İletişim</h2>
            <p className="text-green-100 mb-4">
              Öğretmenler ve okul yönetimiyle iletişim kurun.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Hızlı Mesajlaşma</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Görüşme Planlama</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <MessageCircle className="h-24 w-24 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Demo Messaging Interface */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Mesaj</h3>
        
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
              Alıcı
            </label>
            <select
              id="teacher"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Öğretmen Seçin</option>
              <option value="1">Ayşe Öğretmen (Matematik)</option>
              <option value="2">Mehmet Öğretmen (Türkçe)</option>
              <option value="3">Zeynep Öğretmen (Fen Bilgisi)</option>
              <option value="4">Ali Öğretmen (Sosyal Bilgiler)</option>
              <option value="5">Okul Müdürü</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mesajınız
            </label>
            <textarea
              id="message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
              placeholder="Mesajınızı buraya yazın..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
              <span>Gönder</span>
            </button>
          </div>
        </form>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
            <AlertCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Bu özellik yakında eklenecek</h3>
          
          <p className="text-gray-600 mb-6">
            Öğretmenler ve okul yönetimiyle doğrudan iletişim kurmanızı sağlayacak 
            kapsamlı mesajlaşma ve görüşme planlama sistemi üzerinde çalışıyoruz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Anlık Mesajlaşma</h4>
                  <p className="text-sm text-gray-600">Öğretmenlerle hızlı ve kolay iletişim kurun.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Video className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Video Görüşme</h4>
                  <p className="text-sm text-gray-600">Öğretmenlerle çevrimiçi görüşme yapın.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Görüşme Planlama</h4>
                  <p className="text-sm text-gray-600">Veli toplantıları ve birebir görüşmeler için randevu alın.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Bildirimler</h4>
                  <p className="text-sm text-gray-600">Önemli duyuruları ve bildirimleri alın.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Bizi takip edin!</h4>
            <p className="text-sm text-green-700">
              Bu özelliğin ne zaman kullanıma sunulacağı hakkında bilgi almak için bildirimlerinizi açık tutun.
            </p>
          </div>
        </div>
      </div>

      {/* Yakında Eklenecek Özellikler */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek İletişim Özellikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComingSoonFeature 
            title="Öğretmen Mesajlaşma" 
            description="Öğretmenlerle doğrudan ve güvenli mesajlaşma."
            icon={MessageCircle}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Video Görüşme" 
            description="Öğretmenlerle çevrimiçi video görüşmesi yapma imkanı."
            icon={Video}
            availableDate="Ekim 2024"
          />
          
          <ComingSoonFeature 
            title="Toplu Duyurular" 
            description="Okul ve sınıf düzeyinde toplu duyuruları görüntüleme."
            icon={Mail}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Veli Toplantısı Planlama" 
            description="Veli toplantıları için uygun zamanları seçme ve randevu alma."
            icon={Calendar}
            availableDate="Ekim 2024"
          />
          
          <ComingSoonFeature 
            title="Rehberlik Servisi" 
            description="Okul rehberlik servisiyle iletişim kurma."
            icon={Users}
            availableDate="Kasım 2024"
          />
          
          <ComingSoonFeature 
            title="İletişim Geçmişi" 
            description="Tüm iletişim geçmişinizi görüntüleme ve arama."
            icon={Phone}
          />
        </div>
      </div>
    </div>
  );
};

export default Communication; 