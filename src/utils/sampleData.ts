import { Child } from '../models/Child';
import { Homework } from '../models/Homework';
import { Achievement } from '../models/Achievement';
import { StudySession } from '../models/StudyTime';
import { DevelopmentRecord } from '../models/Development';
import { generateId } from './helpers';

// Örnek çocuk verileri
export const sampleChildren: Child[] = [
  {
    id: generateId(),
    name: 'Ahmet Yılmaz',
    grade: '5',
    school: 'Atatürk İlkokulu',
    parentId: 'current-user-id',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    name: 'Ayşe Demir',
    grade: '3',
    school: 'Cumhuriyet İlkokulu',
    parentId: 'current-user-id',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Örnek ödev verileri
export const sampleHomework: Homework[] = [
  {
    id: generateId(),
    title: 'Matematik Çalışma Kitabı',
    subject: 'Matematik',
    description: 'Sayfa 45-48 arası tüm soruları çözün.',
    dueDate: '2024-07-15',
    status: 'completed',
    childId: sampleChildren[0].id,
    teacher: 'Ayşe Öğretmen',
    completedDate: '2024-07-14',
    grade: 95,
    feedback: 'Çok iyi çalışma, tüm sorular doğru çözülmüş.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Türkçe Kompozisyon',
    subject: 'Türkçe',
    description: 'Çevre kirliliği konusunda bir kompozisyon yazın.',
    dueDate: '2024-07-20',
    status: 'pending',
    childId: sampleChildren[0].id,
    teacher: 'Mehmet Öğretmen',
    completedDate: null,
    grade: null,
    feedback: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Fen Bilgisi Deney Raporu',
    subject: 'Fen Bilgisi',
    description: 'Fotosentez deneyinin raporunu hazırlayın.',
    dueDate: '2024-07-18',
    status: 'pending',
    childId: sampleChildren[0].id,
    teacher: 'Zeynep Öğretmen',
    completedDate: null,
    grade: null,
    feedback: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Okuma Ödevi',
    subject: 'Türkçe',
    description: 'Kitabın 15-20 sayfalarını okuyun ve özet çıkarın.',
    dueDate: '2024-07-14',
    status: 'completed',
    childId: sampleChildren[1].id,
    teacher: 'Mehmet Öğretmen',
    completedDate: '2024-07-13',
    grade: 90,
    feedback: 'Güzel bir özet, ana fikirleri iyi yakalamış.',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Örnek başarı bildirimleri
export const sampleAchievements: Achievement[] = [
  {
    id: generateId(),
    title: 'Matematik Sınavında Başarı',
    type: 'exam',
    description: 'Matematik sınavında 95 puan alarak sınıf birincisi oldu.',
    date: '2024-07-10',
    childId: sampleChildren[0].id,
    teacher: 'Ayşe Öğretmen',
    subject: 'Matematik',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Okuma Hedefi Tamamlandı',
    type: 'goal',
    description: 'Aylık 5 kitap okuma hedefini başarıyla tamamladı.',
    date: '2024-07-05',
    childId: sampleChildren[1].id,
    teacher: 'Mehmet Öğretmen',
    subject: 'Türkçe',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Örnek çalışma oturumları
export const sampleStudySessions: StudySession[] = [
  {
    id: generateId(),
    childId: sampleChildren[0].id,
    date: '2024-07-10',
    subject: 'Matematik',
    hours: 2.5,
    timeOfDay: 'afternoon',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    childId: sampleChildren[0].id,
    date: '2024-07-11',
    subject: 'Türkçe',
    hours: 1.8,
    timeOfDay: 'morning',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    childId: sampleChildren[1].id,
    date: '2024-07-10',
    subject: 'Türkçe',
    hours: 1.5,
    timeOfDay: 'evening',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Örnek gelişim kayıtları
export const sampleDevelopmentRecords: DevelopmentRecord[] = [
  {
    id: generateId(),
    childId: sampleChildren[0].id,
    date: '2024-06-01',
    subject: 'Matematik',
    score: 65,
    teacherId: 'teacher-1',
    examType: 'quiz',
    comments: 'İyi bir başlangıç, daha fazla pratik yapmalı.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    childId: sampleChildren[0].id,
    date: '2024-07-01',
    subject: 'Matematik',
    score: 80,
    teacherId: 'teacher-1',
    examType: 'midterm',
    comments: 'Önemli bir ilerleme gösterdi.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    childId: sampleChildren[1].id,
    date: '2024-06-15',
    subject: 'Türkçe',
    score: 85,
    teacherId: 'teacher-2',
    examType: 'quiz',
    comments: 'Okuma ve anlama becerileri çok iyi.',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Tüm örnek verileri localStorage'a yükle
export const loadSampleData = () => {
  localStorage.setItem('children', JSON.stringify(sampleChildren));
  localStorage.setItem('homework', JSON.stringify(sampleHomework));
  localStorage.setItem('achievements', JSON.stringify(sampleAchievements));
  localStorage.setItem('studySessions', JSON.stringify(sampleStudySessions));
  localStorage.setItem('developmentRecords', JSON.stringify(sampleDevelopmentRecords));
  
  console.log('Örnek veriler yüklendi!');
}; 