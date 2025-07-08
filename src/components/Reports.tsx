import React, { useState } from 'react';
import { BarChart4, PieChart, LineChart, BarChart, AlertCircle, FileText, Calendar, Download, Filter } from 'lucide-react';
import ComingSoonFeature from './ComingSoonFeature';

const Reports: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Rapor oluşturma özelliği henüz aktif değil.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Raporlar</h2>
            <p className="text-blue-100 mb-4">
              Çocuğunuzun akademik ilerlemesini detaylı raporlarla takip edin.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart4 className="h-5 w-5" />
                <span className="text-sm">Performans Analizleri</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Detaylı Raporlar</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <BarChart4 className="h-24 w-24 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Report Generator Interface */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapor Oluştur</h3>
        
        <form onSubmit={handleGenerateReport}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-1">
                Çocuk
              </label>
              <select
                id="child"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Çocuk Seçin</option>
                <option value="1">Ahmet Yılmaz</option>
                <option value="2">Ayşe Yılmaz</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Rapor Türü
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Rapor Türü Seçin</option>
                <option value="academic">Akademik Performans</option>
                <option value="attendance">Devam Durumu</option>
                <option value="behavior">Davranış Raporu</option>
                <option value="progress">İlerleme Raporu</option>
                <option value="exam">Sınav Sonuçları</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                Tarih Aralığı
              </label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Tarih Aralığı Seçin</option>
                <option value="week">Son Hafta</option>
                <option value="month">Son Ay</option>
                <option value="quarter">Son 3 Ay</option>
                <option value="semester">Bu Dönem</option>
                <option value="year">Bu Yıl</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Daha fazla filtreleme seçeneği yakında eklenecek</span>
            </div>
            
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Rapor Oluştur</span>
            </button>
          </div>
        </form>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 p-4 rounded-full inline-block mb-6">
            <AlertCircle className="h-12 w-12 text-blue-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Bu özellik yakında eklenecek</h3>
          
          <p className="text-gray-600 mb-6">
            Çocuğunuzun akademik performansını, devam durumunu ve gelişimini takip edebileceğiniz 
            kapsamlı raporlama sistemi üzerinde çalışıyoruz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <BarChart className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Akademik Performans</h4>
                  <p className="text-sm text-gray-600">Çocuğunuzun derslerindeki başarısını grafiklerle takip edin.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <LineChart className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Gelişim Takibi</h4>
                  <p className="text-sm text-gray-600">Çocuğunuzun zaman içindeki gelişimini analiz edin.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <PieChart className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Konu Dağılımı</h4>
                  <p className="text-sm text-gray-600">Hangi konularda daha fazla çalışma gerektiğini görün.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Devam Durumu</h4>
                  <p className="text-sm text-gray-600">Çocuğunuzun okula devam durumunu takip edin.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Bizi takip edin!</h4>
            <p className="text-sm text-blue-700">
              Bu özelliğin ne zaman kullanıma sunulacağı hakkında bilgi almak için bildirimlerinizi açık tutun.
            </p>
          </div>
        </div>
      </div>

      {/* Yakında Eklenecek Özellikler */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yakında Eklenecek Rapor Özellikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComingSoonFeature 
            title="Akademik Performans Raporları" 
            description="Çocuğunuzun akademik performansını detaylı grafiklerle analiz edin."
            icon={BarChart}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Gelişim Takibi" 
            description="Çocuğunuzun zaman içindeki akademik gelişimini izleyin."
            icon={LineChart}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Konu Bazlı Analiz" 
            description="Hangi konularda güçlü, hangi konularda desteğe ihtiyaç var görün."
            icon={PieChart}
            availableDate="Ekim 2024"
          />
          
          <ComingSoonFeature 
            title="Karşılaştırmalı Raporlar" 
            description="Çocuğunuzun performansını sınıf ve okul ortalamasıyla karşılaştırın."
            icon={BarChart4}
            availableDate="Kasım 2024"
          />
          
          <ComingSoonFeature 
            title="PDF Raporlar" 
            description="Tüm raporları PDF formatında indirin ve saklayın."
            icon={FileText}
            availableDate="Eylül 2024"
          />
          
          <ComingSoonFeature 
            title="Öğretmen Yorumları" 
            description="Öğretmenlerin çocuğunuzla ilgili detaylı geri bildirimleri."
            icon={FileText}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports; 