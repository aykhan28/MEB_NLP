import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, GraduationCap, Users, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'student',
    grade: 8,
    studentNumber: '',
    subjects: [],
    school: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const subjects = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce'];
  const grades = [5, 6, 7, 8, 9, 10, 11, 12];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('Lütfen zorunlu alanları doldurun');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    const success = await register(formData);
    if (!success) {
      setError('Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  const handleRoleChange = (role: 'student' | 'teacher' | 'parent') => {
    setFormData(prev => ({
      ...prev,
      role,
      grade: role === 'student' ? 8 : undefined,
      subjects: role === 'teacher' ? [] : undefined,
      school: role === 'teacher' ? '' : undefined,
      phone: role === 'parent' ? '' : undefined,
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...(prev.subjects || []), subject]
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return GraduationCap;
      case 'teacher': return Users;
      case 'parent': return Heart;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-blue-600 bg-blue-100';
      case 'teacher': return 'text-green-600 bg-green-100';
      case 'parent': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Ol</h2>
          <p className="text-gray-600">NLP MEB'e katılın ve öğrenmeye başlayın</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rol Seçimi *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['student', 'teacher', 'parent'] as const).map((role) => {
                const Icon = getRoleIcon(role);
                const isSelected = formData.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isSelected ? 'bg-primary-100 text-primary-600' : getRoleColor(role)
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      {role === 'student' ? 'Öğrenci' : role === 'teacher' ? 'Öğretmen' : 'Veli'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Sınıf
                </label>
                <select
                  id="grade"
                  value={formData.grade || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                  className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}. Sınıf</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Öğrenci Numarası
                </label>
                <input
                  id="studentNumber"
                  type="text"
                  value={formData.studentNumber || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
                  className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123456"
                />
              </div>
            </div>
          )}

          {formData.role === 'teacher' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                  Okul
                </label>
                <input
                  id="school"
                  type="text"
                  value={formData.school || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Okul adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branşlar
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects?.includes(subject) || false}
                        onChange={() => handleSubjectToggle(subject)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.role === 'parent' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0555 123 45 67"
              />
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <span className="ml-2 text-sm text-gray-600">
              <a href="#" className="text-primary-600 hover:text-primary-700">Kullanım Şartları</a> ve{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Kayıt Ol</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Giriş yapın
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;