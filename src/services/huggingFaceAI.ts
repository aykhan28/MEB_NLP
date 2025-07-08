interface HuggingFaceResponse {
  generated_text?: string;
  answer?: string;
  score?: number;
  label?: string;
}

interface QuestionGenerationRequest {
  inputs: {
    question: string;
    context: string;
  };
}

interface TextGenerationRequest {
  inputs: string;
  parameters?: {
    max_length?: number;
    temperature?: number;
    do_sample?: boolean;
    top_p?: number;
  };
}

class HuggingFaceAIService {
  private readonly apiKey = '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';
  private readonly baseUrl = 'https://api-inference.huggingface.co/models';

  // Türkçe dil modelleri
  private readonly models = {
    textGeneration: 'microsoft/DialoGPT-medium',
    turkishGPT: 'ytu-ce-cosmos/turkish-gpt2',
    questionAnswering: 'savasy/bert-base-turkish-squad',
    textClassification: 'savasy/bert-base-turkish-sentiment-cased',
    summarization: 'facebook/bart-large-cnn',
    translation: 'Helsinki-NLP/opus-mt-tr-en'
  };

  private async makeRequest(model: string, payload: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Hugging Face API request failed:', error);
      throw error;
    }
  }

  async generateTurkishContent(topic: string, contentType: 'explanation' | 'question' | 'summary'): Promise<string> {
    const prompts = {
      explanation: `${topic} konusunu 8. sınıf öğrencilerine uygun şekilde açıkla. Örnekler ver ve anlaşılır dil kullan.`,
      question: `${topic} konusu hakkında 8. sınıf seviyesinde çoktan seçmeli bir soru hazırla. 4 seçenek sun.`,
      summary: `${topic} konusunun ana noktalarını özetle. Anahtar kavramları listele.`
    };

    try {
      const payload: TextGenerationRequest = {
        inputs: prompts[contentType],
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      };

      const response = await this.makeRequest(this.models.turkishGPT, payload);
      return response[0]?.generated_text || '';
    } catch (error) {
      console.error('Turkish content generation failed:', error);
      return this.getFallbackContent(topic, contentType);
    }
  }

  async generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<any[]> {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const difficultyPrompts = {
          easy: 'kolay seviyede temel kavramları test eden',
          medium: 'orta seviyede analiz gerektiren',
          hard: 'zor seviyede sentez ve değerlendirme gerektiren'
        };

        const prompt = `${topic} konusu hakkında ${difficultyPrompts[difficulty]} bir çoktan seçmeli soru hazırla. 
        Soru formatı:
        SORU: [soru metni]
        A) [seçenek 1]
        B) [seçenek 2] 
        C) [seçenek 3]
        D) [seçenek 4]
        DOĞRU CEVAP: [A, B, C veya D]
        AÇIKLAMA: [neden bu cevap doğru]`;

        const response = await this.generateTurkishContent(prompt, 'question');
        const parsedQuestion = this.parseQuestionResponse(response, topic, difficulty);
        
        if (parsedQuestion) {
          questions.push(parsedQuestion);
        }
      } catch (error) {
        console.error(`Question ${i + 1} generation failed:`, error);
        questions.push(this.generateFallbackQuestion(topic, difficulty, i));
      }
    }

    return questions;
  }

  async generateConceptExplanation(topic: string): Promise<any> {
    try {
      const explanation = await this.generateTurkishContent(topic, 'explanation');
      const summary = await this.generateTurkishContent(topic, 'summary');

      return {
        id: `concept_${Date.now()}`,
        topic,
        title: topic,
        content: explanation || this.getFallbackExplanation(topic),
        examples: this.generateExamples(topic),
        keyPoints: this.extractKeyPoints(summary),
        relatedTopics: this.getRelatedTopics(topic),
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Concept explanation generation failed:', error);
      return this.getFallbackConceptExplanation(topic);
    }
  }

  async analyzeStudentText(text: string): Promise<any> {
    try {
      // Türkçe sentiment analizi
      const sentimentPayload = {
        inputs: text
      };

      const sentimentResponse = await this.makeRequest(
        this.models.textClassification, 
        sentimentPayload
      );

      return {
        sentiment: sentimentResponse[0]?.label || 'NEUTRAL',
        confidence: sentimentResponse[0]?.score || 0.5,
        summary: text.substring(0, 100),
        analysis: this.generateTextAnalysis(text, sentimentResponse[0])
      };
    } catch (error) {
      console.error('Text analysis failed:', error);
      return {
        sentiment: 'NEUTRAL',
        confidence: 0.5,
        summary: text.substring(0, 100),
        analysis: 'Metin analizi yapılamadı.'
      };
    }
  }

  async generateStudyPlan(studentData: any): Promise<any> {
    const { weakAreas, currentLevel, subject } = studentData;
    
    try {
      const planPrompt = `
      Bir 8. sınıf öğrencisi için ${subject} dersi çalışma planı hazırla.
      Zayıf alanlar: ${weakAreas.join(', ')}
      Mevcut seviye: ${currentLevel}/100
      
      2 haftalık detaylı plan hazırla:
      - Her gün için konu ve süre
      - Zorluk seviyesi progresyonu
      - Tekrar oturumları
      - Değerlendirme testleri
      `;

      const planText = await this.generateTurkishContent(planPrompt, 'explanation');
      const parsedPlan = this.parseStudyPlan(planText, weakAreas);

      return {
        id: Date.now().toString(),
        studentId: studentData.studentId,
        subject,
        weakAreas,
        studySchedule: parsedPlan,
        generatedAt: new Date().toISOString(),
        aiProvider: 'HuggingFace'
      };
    } catch (error) {
      console.error('Study plan generation failed:', error);
      return this.generateFallbackStudyPlan(studentData);
    }
  }

  async generatePersonalizedFeedback(studentProgress: any): Promise<string> {
    try {
      const feedbackPrompt = `
      Öğrenci performans analizi:
      - Tamamlanan oturum: ${studentProgress.completedSessions}
      - Ortalama puan: ${studentProgress.averageScore}
      - Zayıf alanlar: ${studentProgress.weakAreas.join(', ')}
      - Güçlü alanlar: ${studentProgress.strongAreas.join(', ')}
      
      Bu öğrenci için motivasyonel ve yapıcı geri bildirim hazırla.
      Somut öneriler ve hedefler ver.
      `;

      const feedback = await this.generateTurkishContent(feedbackPrompt, 'explanation');
      return feedback || this.getFallbackFeedback(studentProgress);
    } catch (error) {
      console.error('Feedback generation failed:', error);
      return this.getFallbackFeedback(studentProgress);
    }
  }

  // Yardımcı metodlar
  private parseQuestionResponse(response: string, topic: string, difficulty: string): any | null {
    try {
      const lines = response.split('\n').filter(line => line.trim());
      let question = '';
      let options: string[] = [];
      let correctAnswer = 0;
      let explanation = '';

      for (const line of lines) {
        if (line.startsWith('SORU:')) {
          question = line.replace('SORU:', '').trim();
        } else if (line.match(/^[A-D]\)/)) {
          options.push(line.substring(2).trim());
        } else if (line.startsWith('DOĞRU CEVAP:')) {
          const answer = line.replace('DOĞRU CEVAP:', '').trim();
          correctAnswer = ['A', 'B', 'C', 'D'].indexOf(answer);
        } else if (line.startsWith('AÇIKLAMA:')) {
          explanation = line.replace('AÇIKLAMA:', '').trim();
        }
      }

      if (question && options.length === 4 && correctAnswer >= 0) {
        return {
          id: `hf_q_${Date.now()}_${Math.random()}`,
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
          topic,
          achievement: topic,
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Question parsing failed:', error);
    }
    
    return null;
  }

  private parseStudyPlan(planText: string, weakAreas: string[]): any[] {
    const schedule = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const topic = weakAreas[i % weakAreas.length] || 'Genel Tekrar';
      const types = ['concept', 'practice', 'review', 'test'];
      const type = types[i % types.length];
      
      schedule.push({
        id: `session_${i}`,
        date: date.toISOString().split('T')[0],
        time: '14:00',
        topic,
        type,
        duration: 30 + (i % 3) * 15,
        completed: false
      });
    }
    
    return schedule;
  }

  private generateExamples(topic: string): string[] {
    const exampleMap: { [key: string]: string[] } = {
      'Doğrusal Denklemler': [
        '2x + 5 = 13 → x = 4',
        '3x - 7 = 2x + 1 → x = 8',
        'x/2 + 3 = 7 → x = 8'
      ],
      'Oran ve Orantı': [
        '12:18 = 2:3',
        'Bir tarif 4 kişilik ise, 6 kişi için malzemeler 1.5 katına çıkar',
        'Harita ölçeği 1:100000 ise, 1 cm = 1 km'
      ],
      'Geometrik Şekiller': [
        'Üçgenin iç açıları toplamı = 180°',
        'Karenin alanı = kenar²',
        'Dikdörtgenin çevresi = 2(uzunluk + genişlik)'
      ]
    };

    return exampleMap[topic] || [
      `${topic} ile ilgili örnek 1`,
      `${topic} ile ilgili örnek 2`
    ];
  }

  private extractKeyPoints(summary: string): string[] {
    const points = summary.split('.').filter(point => point.trim().length > 10);
    return points.slice(0, 5).map(point => point.trim());
  }

  private getRelatedTopics(topic: string): string[] {
    const relatedMap: { [key: string]: string[] } = {
      'Doğrusal Denklemler': ['Eşitsizlikler', 'Grafik Çizimi', 'Problem Çözme'],
      'Oran ve Orantı': ['Yüzdeler', 'Ölçek', 'Benzerlik'],
      'Geometrik Şekiller': ['Alan Hesaplama', 'Çevre Hesaplama', 'Dönüşümler']
    };

    return relatedMap[topic] || ['İlgili Konu 1', 'İlgili Konu 2'];
  }

  private generateTextAnalysis(text: string, sentiment: any): string {
    const length = text.length;
    const wordCount = text.split(' ').length;
    const sentimentLabel = sentiment?.label || 'NEUTRAL';
    
    return `Metin ${wordCount} kelimeden oluşuyor. Genel ton: ${sentimentLabel}. ${
      length > 200 ? 'Detaylı bir açıklama yapılmış.' : 'Kısa ve öz bir metin.'
    }`;
  }

  // Fallback metodları
  private getFallbackContent(topic: string, contentType: string): string {
    const fallbacks = {
      explanation: `${topic} konusu hakkında detaylı açıklama AI tarafından oluşturulacak.`,
      question: `${topic} ile ilgili soru AI tarafından hazırlanacak.`,
      summary: `${topic} konusunun ana noktaları: Temel kavramlar, örnekler ve uygulamalar.`
    };

    return fallbacks[contentType as keyof typeof fallbacks] || `${topic} hakkında içerik.`;
  }

  private generateFallbackQuestion(topic: string, difficulty: string, index: number): any {
    return {
      id: `fallback_hf_${Date.now()}_${index}`,
      question: `${topic} konusu ile ilgili ${difficulty} seviyesinde soru ${index + 1}`,
      options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
      correctAnswer: 0,
      explanation: 'Bu sorunun açıklaması AI tarafından oluşturulacak.',
      difficulty,
      topic,
      achievement: topic,
      createdAt: new Date().toISOString()
    };
  }

  private getFallbackExplanation(topic: string): string {
    return `${topic} konusu 8. sınıf matematik müfredatının önemli bir parçasıdır. Bu konu temel kavramları içerir ve günlük hayatta sıkça kullanılır.`;
  }

  private getFallbackConceptExplanation(topic: string): any {
    return {
      id: `fallback_concept_${Date.now()}`,
      topic,
      title: topic,
      content: this.getFallbackExplanation(topic),
      examples: this.generateExamples(topic),
      keyPoints: ['Temel kavram 1', 'Temel kavram 2'],
      relatedTopics: ['İlgili konu 1'],
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    };
  }

  private generateFallbackStudyPlan(studentData: any): any {
    const { weakAreas, subject, studentId } = studentData;
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
      generatedAt: new Date().toISOString(),
      aiProvider: 'HuggingFace-Fallback'
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

export const huggingFaceAIService = new HuggingFaceAIService();