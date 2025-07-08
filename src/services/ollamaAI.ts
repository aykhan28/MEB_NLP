interface OllamaModel {
  name: string;
  size: string;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_predict?: number;
  };
}

class OllamaAIService {
  private readonly baseUrl = 'http://localhost:11434';
  private selectedModel = 'llama2'; // Varsayılan model
  private connectionAvailable = false;

  async checkConnection(): Promise<boolean> {
    try {
      // Add timeout and proper error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      this.connectionAvailable = response.ok;
      return response.ok;
    } catch (error) {
      // Silently handle connection errors - don't log to console to avoid spam
      this.connectionAvailable = false;
      return false;
    }
  }

  isConnectionAvailable(): boolean {
    return this.connectionAvailable;
  }

  async getAvailableModels(): Promise<OllamaModel[]> {
    if (!this.connectionAvailable) {
      return [];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to get Ollama models:', error);
      this.connectionAvailable = false;
      return [];
    }
  }

  setSelectedModel(modelName: string) {
    this.selectedModel = modelName;
  }

  getSelectedModel(): string {
    return this.selectedModel;
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    if (!this.connectionAvailable) {
      throw new Error('Ollama connection not available');
    }

    try {
      const payload: OllamaGenerateRequest = {
        model: this.selectedModel,
        prompt,
        stream: false,
        options: {
          temperature: options?.temperature || 0.7,
          top_p: options?.top_p || 0.9,
          num_predict: options?.max_tokens || 500,
          ...options
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for generation

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Ollama text generation failed:', error);
      this.connectionAvailable = false;
      throw error;
    }
  }

  async generateStudyPlan(studentData: any): Promise<any> {
    if (!this.connectionAvailable) {
      return this.generateFallbackStudyPlan(studentData);
    }

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
      
      Türkçe olarak yanıt ver ve pratik öneriler sun.
      `;

      const response = await this.generateText(prompt, { temperature: 0.8, max_tokens: 800 });
      const parsedPlan = this.parseStudyPlanFromText(response, weakAreas);

      return {
        id: Date.now().toString(),
        studentId,
        subject,
        weakAreas,
        studySchedule: parsedPlan,
        generatedAt: new Date().toISOString(),
        aiProvider: `Ollama-${this.selectedModel}`
      };
    } catch (error) {
      console.error('Ollama study plan generation failed:', error);
      return this.generateFallbackStudyPlan(studentData);
    }
  }

  async generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<any[]> {
    if (!this.connectionAvailable) {
      return Array.from({ length: count }, (_, i) => 
        this.generateFallbackQuestion(topic, difficulty, i)
      );
    }

    const questions = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const difficultyMap = {
          easy: 'kolay',
          medium: 'orta',
          hard: 'zor'
        };

        const prompt = `
        ${topic} konusu hakkında ${difficultyMap[difficulty]} seviyesinde 8. sınıf öğrencileri için çoktan seçmeli bir soru hazırla.
        
        Format:
        SORU: [soru metni]
        A) [seçenek 1]
        B) [seçenek 2]
        C) [seçenek 3]
        D) [seçenek 4]
        DOĞRU CEVAP: [A, B, C veya D]
        AÇIKLAMA: [neden bu cevap doğru]
        
        Türkçe olarak hazırla ve MEB müfredatına uygun olsun.
        `;

        const response = await this.generateText(prompt, { temperature: 0.6, max_tokens: 400 });
        const parsedQuestion = this.parseQuestionFromText(response, topic, difficulty);
        
        if (parsedQuestion) {
          questions.push(parsedQuestion);
        } else {
          questions.push(this.generateFallbackQuestion(topic, difficulty, i));
        }
      } catch (error) {
        console.error(`Ollama question ${i + 1} generation failed:`, error);
        questions.push(this.generateFallbackQuestion(topic, difficulty, i));
      }
    }

    return questions;
  }

  async generateConceptExplanation(topic: string): Promise<any> {
    if (!this.connectionAvailable) {
      return this.getFallbackConceptExplanation(topic);
    }

    try {
      const prompt = `
      ${topic} konusunu 8. sınıf öğrencilerine uygun şekilde detaylı olarak açıkla.
      
      Şunları içersin:
      - Konunun tanımı ve önemi
      - Temel kavramlar
      - Günlük hayattan örnekler
      - Anahtar noktalar
      - İlgili konular
      
      Anlaşılır Türkçe kullan ve öğrencinin seviyesine uygun ol.
      `;

      const response = await this.generateText(prompt, { temperature: 0.7, max_tokens: 600 });
      
      return {
        id: `ollama_concept_${Date.now()}`,
        topic,
        title: topic,
        content: response || this.getFallbackExplanation(topic),
        examples: this.extractExamplesFromText(response, topic),
        keyPoints: this.extractKeyPointsFromText(response),
        relatedTopics: this.getRelatedTopics(topic),
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Ollama concept explanation failed:', error);
      return this.getFallbackConceptExplanation(topic);
    }
  }

  async generatePersonalizedFeedback(studentProgress: any): Promise<string> {
    if (!this.connectionAvailable) {
      return this.getFallbackFeedback(studentProgress);
    }

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

      const response = await this.generateText(prompt, { temperature: 0.8, max_tokens: 400 });
      return response || this.getFallbackFeedback(studentProgress);
    } catch (error) {
      console.error('Ollama feedback generation failed:', error);
      return this.getFallbackFeedback(studentProgress);
    }
  }

  // Yardımcı metodlar
  private parseStudyPlanFromText(text: string, weakAreas: string[]): any[] {
    const schedule = [];
    const today = new Date();
    
    // Basit plan oluşturma - gerçek uygulamada text parsing yapılabilir
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const topic = weakAreas[i % weakAreas.length] || 'Genel Tekrar';
      const types = ['concept', 'practice', 'review', 'test'];
      const type = types[i % types.length];
      
      schedule.push({
        id: `ollama_session_${i}`,
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

  private parseQuestionFromText(text: string, topic: string, difficulty: string): any | null {
    try {
      const lines = text.split('\n').filter(line => line.trim());
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
          id: `ollama_q_${Date.now()}_${Math.random()}`,
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

  private extractExamplesFromText(text: string, topic: string): string[] {
    // Basit örnek çıkarma - gerçek uygulamada daha sofistike olabilir
    const examples = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('örnek') || line.includes('Örnek') || line.includes('mesela')) {
        examples.push(line.trim());
      }
    }
    
    return examples.length > 0 ? examples.slice(0, 3) : this.getDefaultExamples(topic);
  }

  private extractKeyPointsFromText(text: string): string[] {
    const points = text.split('.').filter(point => 
      point.trim().length > 20 && point.trim().length < 100
    );
    return points.slice(0, 5).map(point => point.trim());
  }

  private getDefaultExamples(topic: string): string[] {
    const exampleMap: { [key: string]: string[] } = {
      'Doğrusal Denklemler': [
        '2x + 5 = 13 → x = 4',
        '3x - 7 = 2x + 1 → x = 8'
      ],
      'Oran ve Orantı': [
        '12:18 = 2:3',
        'Harita ölçeği 1:100000'
      ],
      'Geometrik Şekiller': [
        'Üçgenin iç açıları toplamı = 180°',
        'Karenin alanı = kenar²'
      ]
    };

    return exampleMap[topic] || [`${topic} örneği 1`, `${topic} örneği 2`];
  }

  private getRelatedTopics(topic: string): string[] {
    const relatedMap: { [key: string]: string[] } = {
      'Doğrusal Denklemler': ['Eşitsizlikler', 'Grafik Çizimi'],
      'Oran ve Orantı': ['Yüzdeler', 'Ölçek'],
      'Geometrik Şekiller': ['Alan Hesaplama', 'Çevre Hesaplama']
    };

    return relatedMap[topic] || ['İlgili Konu 1'];
  }

  // Fallback metodları
  private generateFallbackStudyPlan(studentData: any): any {
    const { weakAreas, subject, studentId } = studentData;
    const today = new Date();
    const schedule = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      schedule.push({
        id: `ollama_fallback_session_${i}`,
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
      aiProvider: 'Ollama-Fallback'
    };
  }

  private generateFallbackQuestion(topic: string, difficulty: string, index: number): any {
    return {
      id: `ollama_fallback_q_${Date.now()}_${index}`,
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
      id: `ollama_fallback_concept_${Date.now()}`,
      topic,
      title: topic,
      content: this.getFallbackExplanation(topic),
      examples: this.getDefaultExamples(topic),
      keyPoints: ['Temel kavram 1', 'Temel kavram 2'],
      relatedTopics: this.getRelatedTopics(topic),
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

export const ollamaAIService = new OllamaAIService();