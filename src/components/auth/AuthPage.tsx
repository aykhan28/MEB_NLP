import React, { useState } from 'react';
import { Brain, BookOpen, Target, Users } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: Brain,
      title: 'AI Destekli Öğrenme',
      description: 'Yapay zeka ile kişiselleştirilmiş öğrenme deneyimi'
    },
    {
      icon: Target,
      title: 'Hedef Odaklı Plan',
      description: 'MEB kazanımlarına uygun bireysel öğrenme planları'
    },
    {
      icon: BookOpen,
      title: 'Kapsamlı İçerik',
      description: 'Tüm sınıf seviyelerine uygun zengin içerik kütüphanesi'
    },
    {
      icon: Users,
      title: 'Çoklu Rol Desteği',
      description: 'Öğrenci, öğretmen ve veli için özel arayüzler'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-lg mx-auto lg:mx-0">
            {/* Logo & Title */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">NLP MEB</h1>
                  <p className="text-gray-600">Akıllı Öğrenme Planlayıcı</p>
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Türkçe NLP Destekli Öğrenme Platformu
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                MEB müfredatına uygun, yapay zeka destekli kişiselleştirilmiş eğitim deneyimi. 
                Öğrenciler, öğretmenler ve veliler için tasarlanmış kapsamlı öğrenme çözümü.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">1000+</div>
                <div className="text-sm text-gray-600">Aktif Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">50+</div>
                <div className="text-sm text-gray-600">Öğretmen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">95%</div>
                <div className="text-sm text-gray-600">Başarı Oranı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;