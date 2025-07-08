import { GoogleGenerativeAI } from '@google/generative-ai';
import { huggingFaceAIService } from './huggingFaceAI';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.warn('Google AI API key not found, using Hugging Face as primary AI service');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface StudyPlan {
  id: string;
  studentId: string;
  subject: string;
  weakAreas: string[];
  studySchedule: StudySession[];
  generatedQuestions: GeneratedQuestion[];
  conceptExplanations: ConceptExplanation[];
  createdAt: string;
  updatedAt: string;
  aiProvider?: string;
}

export interface StudySession {
  id: string;
  date: string;
  time: string;
  topic: string;
  type: 'concept' | 'practice' | 'review' | 'test';
  duration: number;
  completed: boolean;
  score?: number;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  achievement: string;
  createdAt: string;
}

export interface ConceptExplanation {
  id: string;
  topic: string;
  title: string;
  content: string;
  examples: string[];
  keyPoints: string[];
  relatedTopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface StudentProgress {
  studentId: string;
  subject: string;
  completedSessions: number;
  totalSessions: number;
  averageScore: number;
  weakAreas: string[];
  strongAreas: string[];
  lastStudyDate: string;
  streakDays: number;
  aiInsights?: string;
}

class GoogleAIService {
  private model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

  // MEB Kazanım Dokümanları (RAG için)
  private readonly mebDocuments = {
    matematik_8: `
    8. SINIF MATEMATİK KAZANIMLARI:
    
    1. SAYILAR VE İŞLEMLER
    - Üslü ifadeleri tanır ve hesaplar
    - Kareköklü ifadeleri hesaplar
    - Bilimsel gösterim kullanır
    
    2. CEBİR
    - Doğrusal denklemleri çözer
    - Eşitsizlikleri çözer
    - Özdeşlikleri kullanır
    
    3. GEOMETRİ
    - Üçgenlerin özelliklerini bilir
    - Dörtgenlerin özelliklerini analiz eder
    - Dönüşüm geometrisi uygular
    
    4. VERİ İŞLEME
    - Merkezi eğilim ölçülerini hesaplar
    - Grafikleri yorumlar
    - Olasılık hesaplar
    `,
    
    turkce_8: `
    8. SINIF TÜRKÇE KAZANIMLARI:
    
    1. DİNLEME/İZLEME
    - Dinlediklerinin ana fikrini belirler
    - Dinlediklerini özetler
    - Eleştirel dinleme yapar
    
    2. KONUŞMA
    - Hazırlıklı konuşma yapar
    - Tartışmalara katılır
    - Sunum yapar
    
    3. OKUMA
    - Okuduklarını analiz eder
    - Çıkarımda bulunur
    - Eleştirel okuma yapar
    
    4. YAZMA
    - Farklı türlerde metin yazar
    - Yazım kurallarını uygular
    - Düzenleme yapar
    `
  };

  async generateStudyPlan(
    studentId: string,
    subject: string,
    weakAreas: string[],
    currentLevel: number
  ): Promise<StudyPlan> {
    try {
      // Önce Hugging Face ile dene
      const hfPlan = await huggingFaceAIService.generateStudyPlan({
        studentId,
        subject,
        weakAreas,
        currentLevel
      });

      if (hfPlan && hfPlan.studySchedule.length > 0) {
        return {
          ...hfPlan,
          generatedQuestions: [],
          conceptExplanations: [],
          updatedAt: new Date().toISOString()
        };
      }

      // Hugging Face başarısız olursa Google AI'yi dene
      if (this.model) {
        return await this.generateWithGoogleAI(studentId, subject, weakAreas, currentLevel);
      }

      // Her ikisi de başarısız olursa fallback plan
      throw new Error('AI services unavailable');
    } catch (error) {
      console.error('Study plan generation failed:', error);
      return this.generateFallbackPlan(studentId, subject, weakAreas);
    }
  }

  async generateQuestions(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<GeneratedQuestion[]> {
    try {
      // Önce Hugging Face ile dene
      const hfQuestions = await huggingFaceAIService.generateQuestions(topic, difficulty, count);
      
      if (hfQuestions && hfQuestions.length > 0) {
        return hfQuestions;
      }

      // Hugging Face başarısız olursa Google AI'yi dene
      if (this.model) {
        return await this.generateQuestionsWithGoogleAI(topic, difficulty, count);
      }

      // Fallback
      return this.generateFallbackQuestions(topic, difficulty, count);
    } catch (error) {
      console.error('Question generation failed:', error);
      return this.generateFallbackQuestions(topic, difficulty, count);
    }
  }

  async generateConceptExplanation(topic: string): Promise<ConceptExplanation> {
    try {
      // Önce Hugging Face ile dene
      const hfExplanation = await huggingFaceAIService.generateConceptExplanation(topic);
      
      if (hfExplanation && hfExplanation.content) {
        return hfExplanation;
      }

      // Hugging Face başarısız olursa Google AI'yi dene
      if (this.model) {
        return await this.generateExplanationWithGoogleAI(topic);
      }

      // Fallback
      return this.generateFallbackExplanation(topic);
    } catch (error) {
      console.error('Concept explanation generation failed:', error);
      return this.generateFallbackExplanation(topic);
    }
  }

  async analyzeStudentProgress(studentId: string): Promise<StudentProgress> {
    const studyPlans = this.getStudyPlans(studentId);
    const completedSessions = studyPlans.flatMap(plan => 
      plan.studySchedule.filter(session => session.completed)
    );
    
    const totalSessions = studyPlans.flatMap(plan => plan.studySchedule).length;
    const scores = completedSessions.filter(s => s.score).map(s => s.score!);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // AI insights oluştur
    let aiInsights = '';
    try {
      const progressData = {
        completedSessions: completedSessions.length,
        averageScore,
        weakAreas: this.identifyWeakAreas(completedSessions),
        strongAreas: this.identifyStrongAreas(completedSessions)
      };

      aiInsights = await huggingFaceAIService.generatePersonalizedFeedback(progressData);
    } catch (error) {
      console.error('AI insights generation failed:', error);
      aiInsights = 'Çalışmaya devam et! İlerleme kaydediyorsun.';
    }

    return {
      studentId,
      subject: 'Matematik',
      completedSessions: completedSessions.length,
      totalSessions,
      averageScore,
      weakAreas: this.identifyWeakAreas(completedSessions),
      strongAreas: this.identifyStrongAreas(completedSessions),
      lastStudyDate: completedSessions.length > 0 ? 
        Math.max(...completedSessions.map(s => new Date(s.date).getTime())).toString() : '',
      streakDays: this.calculateStreakDays(completedSessions),
      aiInsights
    };
  }

  // Google AI ile çalışma planı oluşturma
  private async generateWithGoogleAI(
    studentId: string,
    subject: string,
    weakAreas: string[],
    currentLevel: number
  ): Promise<StudyPlan> {
    const prompt = `
    Bir 8. sınıf öğrencisi için ${subject} dersi kişiselleştirilmiş çalışma planı hazırla.
    
    Öğrenci Bilgileri:
    - ID: ${studentId}
    - Zayıf Alanlar: ${weakAreas.join(', ')}
    - Mevcut Seviye: ${currentLevel}/100
    
    MEB Kazanımları:
    ${this.mebDocuments[subject as keyof typeof this.mebDocuments] || this.mebDocuments.matematik_8}
    
    Lütfen şunları içeren bir plan hazırla:
    1. 2 haftalık detaylı çalışma takvimi
    2. Her gün için özel konular ve süre
    3. Zorluk seviyesi progresyonu
    4. Tekrar ve pekiştirme oturumları
    
    JSON formatında yanıt ver:
    {
      "studySchedule": [
        {
          "date": "2024-01-XX",
          "time": "14:00",
          "topic": "Konu adı",
          "type": "concept|practice|review|test",
          "duration": 30
        }
      ]
    }
    `;

    const result = await this.model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch {
      parsedResponse = this.generateFallbackPlan(studentId, subject, weakAreas);
    }

    return {
      id: Date.now().toString(),
      studentId,
      subject,
      weakAreas,
      studySchedule: parsedResponse.studySchedule.map((session: any, index: number) => ({
        id: `session_${index}`,
        ...session,
        completed: false
      })),
      generatedQuestions: [],
      conceptExplanations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiProvider: 'Google-Gemini'
    };
  }

  // Google AI ile soru oluşturma
  private async generateQuestionsWithGoogleAI(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number
  ): Promise<GeneratedQuestion[]> {
    const prompt = `
    ${topic} konusu için ${difficulty} seviyesinde ${count} adet çoktan seçmeli soru hazırla.
    
    MEB 8. sınıf müfredatına uygun olsun.
    Her soru için:
    - Açık ve anlaşılır soru metni
    - 4 seçenek (A, B, C, D)
    - Doğru cevap
    - Detaylı açıklama
    
    JSON formatında yanıt ver:
    {
      "questions": [
        {
          "question": "Soru metni",
          "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
          "correctAnswer": 0,
          "explanation": "Detaylı açıklama"
        }
      ]
    }
    `;

    const result = await this.model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch {
      return this.generateFallbackQuestions(topic, difficulty, count);
    }

    return parsedResponse.questions.map((q: any, index: number) => ({
      id: `gai_q_${Date.now()}_${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty,
      topic,
      achievement: topic,
      createdAt: new Date().toISOString()
    }));
  }

  // Google AI ile konu anlatımı
  private async generateExplanationWithGoogleAI(topic: string): Promise<ConceptExplanation> {
    const prompt = `
    ${topic} konusunu 8. sınıf seviyesinde detaylı olarak açıkla.
    
    Şunları içersin:
    - Konunun tanımı ve önemi
    - Temel kavramlar
    - Örnekler
    - Anahtar noktalar
    - İlgili konular
    
    JSON formatında yanıt ver:
    {
      "title": "Konu başlığı",
      "content": "Detaylı açıklama",
      "examples": ["Örnek 1", "Örnek 2"],
      "keyPoints": ["Anahtar nokta 1", "Anahtar nokta 2"],
      "relatedTopics": ["İlgili konu 1", "İlgili konu 2"]
    }
    `;

    const result = await this.model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch {
      parsedResponse = this.generateFallbackExplanationData(topic);
    }

    return {
      id: `gai_concept_${Date.now()}`,
      topic,
      title: parsedResponse.title,
      content: parsedResponse.content,
      examples: parsedResponse.examples,
      keyPoints: parsedResponse.keyPoints,
      relatedTopics: parsedResponse.relatedTopics,
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    };
  }

  // Fallback methods
  private generateFallbackPlan(studentId: string, subject: string, weakAreas: string[]): StudyPlan {
    const today = new Date();
    const schedule = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      schedule.push({
        id: `fallback_session_${i}`,
        date: date.toISOString().split('T')[0],
        time: '14:00',
        topic: weakAreas[i % weakAreas.length] || 'Genel Tekrar',
        type: i % 4 === 0 ? 'test' : i % 3 === 0 ? 'review' : 'concept',
        duration: 30,
        completed: false
      });
    }
    
    return {
      id: Date.now().toString(),
      studentId,
      subject,
      weakAreas,
      studySchedule: schedule,
      generatedQuestions: [],
      conceptExplanations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiProvider: 'Fallback'
    };
  }

  private generateFallbackQuestions(topic: string, difficulty: string, count: number): GeneratedQuestion[] {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `fallback_${Date.now()}_${i}`,
        question: `${topic} ile ilgili ${difficulty} seviyesinde soru ${i + 1}`,
        options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
        correctAnswer: 0,
        explanation: 'Bu sorunun açıklaması AI tarafından oluşturulacak.',
        difficulty: difficulty as any,
        topic,
        achievement: topic,
        createdAt: new Date().toISOString()
      });
    }
    return questions;
  }

  private generateFallbackExplanation(topic: string): ConceptExplanation {
    return {
      id: `fallback_${Date.now()}`,
      topic,
      title: topic,
      content: `${topic} konusu hakkında detaylı açıklama AI tarafından oluşturulacak.`,
      examples: ['Örnek 1', 'Örnek 2'],
      keyPoints: ['Anahtar nokta 1', 'Anahtar nokta 2'],
      relatedTopics: ['İlgili konu 1'],
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    };
  }

  private generateFallbackExplanationData(topic: string) {
    return {
      title: topic,
      content: `${topic} konusu hakkında detaylı açıklama AI tarafından oluşturulacak.`,
      examples: ['Örnek 1', 'Örnek 2'],
      keyPoints: ['Anahtar nokta 1', 'Anahtar nokta 2'],
      relatedTopics: ['İlgili konu 1']
    };
  }

  // Local storage methods
  private saveStudyPlan(plan: StudyPlan) {
    const plans = this.getStudyPlans(plan.studentId);
    plans.push(plan);
    localStorage.setItem(`study_plans_${plan.studentId}`, JSON.stringify(plans));
  }

  private getStudyPlans(studentId: string): StudyPlan[] {
    const stored = localStorage.getItem(`study_plans_${studentId}`);
    return stored ? JSON.parse(stored) : [];
  }

  private identifyWeakAreas(sessions: StudySession[]): string[] {
    const topicScores: { [key: string]: number[] } = {};
    
    sessions.forEach(session => {
      if (session.score !== undefined) {
        if (!topicScores[session.topic]) {
          topicScores[session.topic] = [];
        }
        topicScores[session.topic].push(session.score);
      }
    });

    return Object.entries(topicScores)
      .filter(([_, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg < 70;
      })
      .map(([topic]) => topic);
  }

  private identifyStrongAreas(sessions: StudySession[]): string[] {
    const topicScores: { [key: string]: number[] } = {};
    
    sessions.forEach(session => {
      if (session.score !== undefined) {
        if (!topicScores[session.topic]) {
          topicScores[session.topic] = [];
        }
        topicScores[session.topic].push(session.score);
      }
    });

    return Object.entries(topicScores)
      .filter(([_, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg >= 85;
      })
      .map(([topic]) => topic);
  }

  private calculateStreakDays(sessions: StudySession[]): number {
    if (sessions.length === 0) return 0;
    
    const dates = sessions
      .map(s => new Date(s.date).toDateString())
      .sort()
      .reverse();
    
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (dates[i] === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const googleAIService = new GoogleAIService();