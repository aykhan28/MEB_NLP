// OpenAI Service Implementation
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface OpenAIRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

class OpenAIService {
  private readonly apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  private readonly baseUrl = 'https://api.openai.com/v1';

  async generateText(prompt: string, options?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const payload: OpenAIRequest = {
        model: options?.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Sen Türkçe eğitim alanında uzman bir AI asistanısın. MEB müfredatına uygun, öğrenci seviyesine uygun açıklamalar yaparsın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 500
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI text generation failed:', error);
      throw error;
    }
  }

  async generateStudyPlan(studentData: any): Promise<any> {
    const { weakAreas, currentLevel, subject, studentId } = studentData;
    
    try {
      const prompt = `
      Bir 8. sınıf öğrencisi için ${subject} dersi çalışma planı hazırla.
      
      Öğrenci Bilgileri:
      - Zayıf Alanlar: ${weakAreas.join(', ')}
      - Mevcut Seviye: ${currentLevel}/100
      
      Lütfen 2 haftalık detaylı çalışma takvimi hazırla:
      1. Her gün için özel konular ve süre
      2. Zorluk seviyesi progresyonu
      3. Tekrar ve pekiştirme oturumları
      4. Değerlendirme testleri
      
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

      const response = await this.generateText(prompt, { max_tokens: 1000 });
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        parsedResponse = this.generateFallbackPlan(weakAreas);
      }

      return {
        id: Date.now().toString(),
        studentId,
        subject,
        weakAreas,
        studySchedule: parsedResponse.studySchedule.map((session: any, index: number) => ({
          id: `openai_session_${index}`,
          ...session,
          completed: false
        })),
        generatedAt: new Date().toISOString(),
        aiProvider: 'OpenAI'
      };
    } catch (error) {
      console.error('OpenAI study plan generation failed:', error);
      return this.generateFallbackStudyPlan(studentData);
    }
  }

  async generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<any[]> {
    try {
      const difficultyMap = {
        easy: 'kolay',
        medium: 'orta',
        hard: 'zor'
      };

      const prompt = `
      ${topic} konusu için ${difficultyMap[difficulty]} seviyesinde ${count} adet çoktan seçmeli soru hazırla.
      
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

      const response = await this.generateText(prompt, { max_tokens: 1500 });
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        return this.generateFallbackQuestions(topic, difficulty, count);
      }

      return parsedResponse.questions.map((q: any, index: number) => ({
        id: `openai_q_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        topic,
        achievement: topic,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('OpenAI question generation failed:', error);
      return this.generateFallbackQuestions(topic, difficulty, count);
    }
  }

  async generateConceptExplanation(topic: string): Promise<any> {
    try {
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

      const response = await this.generateText(prompt, { max_tokens: 1000 });
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        parsedResponse = this.generateFallbackExplanationData(topic);
      }

      return {
        id: `openai_concept_${Date.now()}`,
        topic,
        title: parsedResponse.title,
        content: parsedResponse.content,
        examples: parsedResponse.examples,
        keyPoints: parsedResponse.keyPoints,
        relatedTopics: parsedResponse.relatedTopics,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI concept explanation failed:', error);
      return this.getFallbackConceptExplanation(topic);
    }
  }

  async generatePersonalizedFeedback(studentProgress: any): Promise<string> {
    try {
      const prompt = `
      Bir öğrencinin performans analizi:
      - Tamamlanan oturum sayısı: ${studentProgress.completedSessions}
      - Ortalama başarı puanı: ${studentProgress.averageScore}%
      - Zayıf olduğu alanlar: ${studentProgress.weakAreas.join(', ')}
      - Güçlü olduğu alanlar: ${studentProgress.strongAreas.join(', ')}
      
      Bu öğrenci için:
      1. Motivasyonel geri bildirim
      2. Somut öneriler
      3. Kısa vadeli hedefler
      4. Çalışma stratejileri
      
      Pozitif ve yapıcı bir dille Türkçe olarak hazırla.
      `;

      const response = await this.generateText(prompt, { max_tokens: 400 });
      return response || this.getFallbackFeedback(studentProgress);
    } catch (error) {
      console.error('OpenAI feedback generation failed:', error);
      return this.getFallbackFeedback(studentProgress);
    }
  }

  // Fallback methods
  private generateFallbackPlan(weakAreas: string[]) {
    const today = new Date();
    const schedule = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        time: '14:00',
        topic: weakAreas[i % weakAreas.length] || 'Genel Tekrar',
        type: i % 4 === 0 ? 'test' : i % 3 === 0 ? 'review' : 'concept',
        duration: 30
      });
    }
    
    return { studySchedule: schedule };
  }

  private generateFallbackStudyPlan(studentData: any): any {
    const { weakAreas, subject, studentId } = studentData;
    const plan = this.generateFallbackPlan(weakAreas);
    
    return {
      id: Date.now().toString(),
      studentId,
      subject,
      weakAreas,
      studySchedule: plan.studySchedule.map((session: any, index: number) => ({
        id: `openai_fallback_session_${index}`,
        ...session,
        completed: false
      })),
      generatedAt: new Date().toISOString(),
      aiProvider: 'OpenAI-Fallback'
    };
  }

  private generateFallbackQuestions(topic: string, difficulty: string, count: number): any[] {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `openai_fallback_q_${Date.now()}_${i}`,
        question: `${topic} ile ilgili ${difficulty} seviyesinde soru ${i + 1}`,
        options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
        correctAnswer: 0,
        explanation: 'Bu sorunun açıklaması AI tarafından oluşturulacak.',
        difficulty,
        topic,
        achievement: topic,
        createdAt: new Date().toISOString()
      });
    }
    return questions;
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

  private getFallbackConceptExplanation(topic: string): any {
    return {
      id: `openai_fallback_concept_${Date.now()}`,
      topic,
      title: topic,
      content: `${topic} konusu 8. sınıf matematik müfredatının önemli bir parçasıdır.`,
      examples: ['Örnek 1', 'Örnek 2'],
      keyPoints: ['Temel kavram 1', 'Temel kavram 2'],
      relatedTopics: ['İlgili konu 1'],
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    };
  }

  private getFallbackFeedback(studentProgress: any): string {
    const { averageScore, completedSessions } = studentProgress;
    
    if (averageScore >= 80) {
      return `Harika gidiyorsun! ${completedSessions} oturum tamamladın ve ortalaman ${averageScore}%. Bu başarını sürdür!`;
    } else if (averageScore >= 60) {
      return `İyi ilerleme kaydediyorsun. ${completedSessions} oturum tamamladın. Biraz daha çalışarak hedefine ulaşabilirsin.`;
    } else {
      return `Çalışmaya devam et! ${completedSessions} oturum tamamladın. Düzenli çalışma ile başarın artacak.`;
    }
  }
}

export const openAIService = new OpenAIService();