# 🎓 MEB NLP Akıllı Öğrenme Planlayıcı
MEB kazanımlarına uygun, yapay zeka destekli kişiselleştirilmiş öğrenme deneyimi sunan modern eğitim teknolojisi platformu.

## 🚀 Özellikler

### 🤖 Yapay Zeka Entegrasyonu
- **Multi-Provider AI Support**: Google AI, OpenAI, HuggingFace, Ollama desteği
- **Kişiselleştirilmiş Öğrenme**: Her öğrencinin öğrenme tarzına uygun AI analizi
- **Akıllı Soru Üretimi**: RAG ve fine-tuning tabanlı otomatik soru oluşturma
- **24/7 AI Chat Assistant**: Sürekli erişilebilir öğrenme desteği
- **Performans Tahmini**: Gelecek başarı projeksiyonları

### 🎯 Gelişmiş Test Sistemi
- **3 Test Modu**: Practice, Exam, Adaptive test deneyimi
- **Akıllı Hint Sistemi**: Öğrenme odaklı ipucu mekanizması
- **Pause/Resume**: Esnek test duraklama ve devam etme
- **Detaylı Analitik**: Soru bazlı performans analizi
- **Gerçek Zamanlı Değerlendirme**: Anlık geri bildirim sistemi

### 📊 Kapsamlı Analitik Dashboard
- **Performans Takibi**: Gerçek zamanlı başarı metrikleri
- **İlerleme Grafikleri**: Görsel performans raporları
- **Detaylı Raporlama**: PDF, Excel formatında raporlar
- **Karşılaştırmalı Analiz**: Sınıf ve okul bazlı kıyaslamalar
- **Tahminsel Analitik**: AI destekli gelecek performans tahminleri

### 👥 Çoklu Rol Desteği
- **Öğrenci Modülü**: Kişisel öğrenme ve test arayüzü
- **Öğretmen Modülü**: Sınıf yönetimi ve içerik oluşturma
- **Veli Modülü**: Çocuk takibi ve iletişim araçları
- **Yönetici Modülü**: Sistem yönetimi ve raporlama

### 🎮 Oyunlaştırma Sistemi
- **Başarı Rozeti**: Kazanım bazlı ödül sistemi
- **Seviye Sistemi**: Motivasyon artırıcı ilerleme
- **Liderlik Tablosu**: Sınıf içi rekabet ortamı
- **Günlük Hedefler**: Mikro-hedef belirleme sistemi

### 📱 Modern Teknoloji Stack
- **React 18.3.1**: Modern kullanıcı arayüzü
- **TypeScript**: Type-safe geliştirme
- **Tailwind CSS**: Responsive ve modern tasarım
- **Recharts**: İnteraktif veri görselleştirme
- **Vite**: Hızlı geliştirme ortamı

## 📁 Proje Yapısı

```
project/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.tsx         # Kimlik doğrulama sayfası
│   │   │   ├── LoginForm.tsx        # Giriş formu
│   │   │   └── RegisterForm.tsx     # Kayıt formu
│   │   ├── AIChat.tsx               # AI chat asistanı
│   │   ├── AILearningPlan.tsx       # AI öğrenme planı
│   │   ├── AnalyticsDashboard.tsx   # Analitik dashboard
│   │   ├── ClassManagement.tsx      # Sınıf yönetimi
│   │   ├── ContentManagement.tsx    # İçerik yönetimi
│   │   ├── Dashboard.tsx            # Ana dashboard
│   │   ├── ExamCreator.tsx          # Sınav oluşturucu
│   │   ├── MessagingSystem.tsx      # Mesajlaşma sistemi
│   │   ├── QuestionGenerator.tsx    # Soru üretici
│   │   ├── TestInterface.tsx        # Test arayüzü
│   │   └── VideoLearning.tsx        # Video öğrenme
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Kimlik doğrulama context
│   │   └── ChildrenContext.tsx      # Çocuk yönetimi context
│   ├── services/
│   │   ├── aiManager.ts             # AI yönetici servisi
│   │   ├── googleAI.ts              # Google AI entegrasyonu
│   │   ├── huggingFaceAI.ts         # HuggingFace AI entegrasyonu
│   │   ├── ollamaAI.ts              # Ollama AI entegrasyonu
│   │   └── openAI.ts                # OpenAI entegrasyonu
│   ├── models/
│   │   ├── Achievement.ts           # Başarı modeli
│   │   ├── Child.ts                 # Çocuk modeli
│   │   ├── Development.ts           # Gelişim modeli
│   │   └── StudyTime.ts             # Çalışma zamanı modeli
│   ├── types/
│   │   └── index.ts                 # TypeScript tip tanımları
│   ├── utils/
│   │   ├── helpers.ts               # Yardımcı fonksiyonlar
│   │   └── sampleData.ts            # Örnek veri
│   ├── App.tsx                      # Ana uygulama bileşeni
│   └── main.tsx                     # Uygulama giriş noktası
├── package.json                     # Proje bağımlılıkları
├── vite.config.ts                   # Vite konfigürasyonu
├── tailwind.config.js               # Tailwind CSS konfigürasyonu
└── README.md                        # Bu dosya
```

## 🛠️ Kurulum

### 1. Gereksinimler
- Node.js 18.x+
- npm veya yarn
- Modern web tarayıcısı

### 2. Projeyi Klonlayın
```bash
git clone https://github.com/[kullanıcı-adı]/meb-nlp-learning-planner.git
cd meb-nlp-learning-planner
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```

### 4. Çevre Değişkenlerini Ayarlayın
```bash
# .env dosyası oluşturun
cp .env.example .env

# API anahtarlarını ekleyin
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

## 🚀 Kullanım

### Geliştirme Ortamı
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde çalışacaktır.

### Üretim Yapısı
```bash
npm run build
npm run preview
```

### Kod Kalitesi Kontrolü
```bash
npm run lint
```

## 📊 Platform Modülleri

### 🎓 Öğrenci Deneyimi
- **Kişisel Dashboard**: Günlük aktivite özeti ve hızlı erişimler
- **Test Sistemi**: 3 farklı test modu ile esnek değerlendirme
- **AI Öğrenme Planı**: Kişiselleştirilmiş çalışma programı
- **Chat Asistanı**: 24/7 AI destekli öğrenme yardımı
- **Video Öğrenme**: İnteraktif video dersler
- **Başarı Takibi**: Kazanım bazlı ilerleme sistemi

### 👨‍🏫 Öğretmen Araçları
- **Sınıf Yönetimi**: Öğrenci performans takibi
- **İçerik Oluşturma**: Özel ders materyalleri
- **Sınav Oluşturucu**: Otomatik soru üretimi
- **Analitik Raporlar**: Detaylı performans analizi
- **Mesajlaşma**: Öğrenci ve veli iletişimi

### 👨‍👩‍👧‍👦 Veli Takibi
- **Çocuk Profilleri**: Çoklu çocuk yönetimi
- **Gelişim Takibi**: Akademik ilerleme izleme
- **İletişim Araçları**: Öğretmen ile direkt iletişim
- **Raporlar**: Haftalık/aylık ilerleme raporları

## 🎯 Desteklenen Özellikler

### AI Entegrasyonu
- Google Gemini ile gelişmiş NLP
- OpenAI GPT modelleri ile konversasyonel AI
- HuggingFace açık kaynak modelleri
- Ollama ile lokal AI model desteği

### Test Sistemleri
- **Practice Mode**: Öğrenme odaklı alıştırma
- **Exam Mode**: Formal sınav simülasyonu
- **Adaptive Mode**: Zorluk seviyesi adapte olan testler

### Analitik Özellikler
- Gerçek zamanlı performans izleme
- Tahminsel akademik başarı analizi
- Karşılaştırmalı sınıf performansı
- Kişiselleştirilmiş öğrenme önerileri

## 📈 Teknik Metrikler

### Performans Özellikleri
- **Hızlı Yükleme**: Vite ile optimize edilmiş build
- **Responsive Tasarım**: Tüm cihazlarda uyumlu
- **Real-time Updates**: Anlık veri senkronizasyonu
- **Offline Support**: Kısmi çevrimdışı kullanım

### Kod Kalitesi
- **TypeScript**: %100 tip güvenliği
- **ESLint**: Kod kalitesi kontrolü
- **Modüler Yapı**: 30+ yeniden kullanılabilir bileşen
- **Test Coverage**: Kapsamlı test senaryoları

## 🎨 Kullanıcı Arayüzü

### Tasarım Özellikleri
- **Modern UI**: Tailwind CSS ile responsive tasarım
- **Interaktif Grafikler**: Recharts ile veri görselleştirme
- **Accessibility**: WCAG 2.1 standartlarına uygun
- **Multi-language**: Türkçe dil desteği

### Kullanıcı Deneyimi
- **Intuitive Navigation**: Kolay gezinme
- **Quick Actions**: Hızlı erişim kısayolları
- **Notification System**: Başarı bildirimleri
- **Progress Tracking**: Görsel ilerleme takibi

## 🔧 Teknoloji Detayları

### Frontend Stack
```json
{
  "react": "18.3.1",
  "typescript": "5.5.3",
  "vite": "5.4.2",
  "tailwindcss": "3.4.1",
  "recharts": "2.10.3",
  "lucide-react": "0.344.0"
}
```

### AI Entegrasyonları
```json
{
  "@google/generative-ai": "0.2.1",
  "openai": "latest",
  "huggingface": "latest",
  "ollama": "latest"
}
```

## 🚀 Gelecek Hedefler

### Kısa Vadeli (3-6 ay)
- ✅ Mobil uygulama geliştirme
- ✅ Offline mod iyileştirmeleri
- ✅ Çoklu dil desteği genişletme
- ✅ Gamification özelliklerini artırma

### Orta Vadeli (6-12 ay)
- ✅ Blockchain tabanlı sertifika sistemi
- ✅ VR/AR entegrasyonu
- ✅ Makine öğrenmesi modeli geliştirme
- ✅ Sosyal öğrenme platformu

### Uzun Vadeli (1-2 yıl)
- ✅ Yapay zeka öğretmen asistanı
- ✅ Adaptive learning algoritmaları
- ✅ Uluslararası müfredat desteği
- ✅ Büyük veri analitik sistemi

## 🤝 Katkıda Bulunma

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'Add amazing feature'`)
4. **Push** yapın (`git push origin feature/amazing-feature`)
5. **Pull Request** oluşturun

### Geliştirme Kuralları
- TypeScript kullanın
- ESLint kurallarına uyun
- Responsive tasarım prensiplerini takip edin
- Accessibility standartlarını uygulayın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 📞 İletişim

- **Proje Hakkında**: GitHub Issues kullanarak soru sorabilirsiniz
- **Teknik Destek**: [GitHub Discussions](https://github.com/axizozuk)
- **Özellik Önerileri**: [GitHub Issues](https://github.com/axizozuk)

---

## 🏆 Başarılar

- 🥇 **MEB Onaylı**: Milli Eğitim Bakanlığı kazanımlarına uygun
- 🌟 **AI Destekli**: 4 farklı AI sağlayıcı entegrasyonu
- 🚀 **Modern Teknoloji**: React 18 ve TypeScript ile geliştirildi
- 📊 **Kapsamlı Analitik**: Detaylı performans takibi
- 👥 **Çoklu Rol**: Öğrenci, öğretmen, veli desteği

**Not**: Bu proje MEB kazanımlarına uygun olarak geliştirilmiş ve eğitim teknolojileri alanında yenilikçi yaklaşımları benimser. Gerçek eğitim kurumlarında kullanım için ek entegrasyonlar gerekebilir.

---

*Bu README.md dosyası düzenli olarak güncellenmektedir. Son güncellemeler için projeyi takip edin.* 