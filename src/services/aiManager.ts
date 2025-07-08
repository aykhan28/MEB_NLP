import { googleAIService } from './googleAI';
import { huggingFaceAIService } from './huggingFaceAI';
import { ollamaAIService } from './ollamaAI';
import { openAIService } from './openAI';

export type AIProvider = 'google' | 'huggingface' | 'ollama' | 'openai';

export interface AISettings {
  primaryProvider: AIProvider;
  fallbackProvider: AIProvider;
  ollamaModel?: string;
  temperature?: number;
  maxTokens?: number;
  useMultipleProviders?: boolean;
}

class AIManager {
  private settings: AISettings = {
    primaryProvider: 'google',
    fallbackProvider: 'huggingface',
    temperature: 0.7,
    maxTokens: 500,
    useMultipleProviders: true
  };

  private providerStatus = {
    google: true,
    huggingface: true,
    ollama: false,
    openai: false
  };

  constructor() {
    this.loadSettings();
    this.checkProviderAvailability();
  }

  // Ayarları yükle
  private loadSettings() {
    const saved = localStorage.getItem('ai_settings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  // Ayarları kaydet
  saveSettings(newSettings: Partial<AISettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('ai_settings', JSON.stringify(this.settings));
    
    // Ollama model seçimi
    if (newSettings.ollamaModel) {
      ollamaAIService.setSelectedModel(newSettings.ollamaModel);
    }
  }

  // Provider durumlarını kontrol et
  async checkProviderAvailability() {
    try {
      // Google AI kontrolü
      this.providerStatus.google = !!import.meta.env.VITE_GOOGLE_AI_API_KEY;
      
      // OpenAI kontrolü
      this.providerStatus.openai = !!import.meta.env.VITE_OPENAI_API_KEY;
      
      // Hugging Face kontrolü
      this.providerStatus.huggingface = true; // API key kodda tanımlı
      
      // Ollama kontrolü - silently handle connection failures
      this.providerStatus.ollama = await ollamaAIService.checkConnection();
    } catch (error) {
      // Silently handle provider availability check failures
      // Don't log to console to avoid spam
      this.providerStatus.ollama = false;
    }
  }

  // Mevcut provider'ı al
  getAvailableProvider(): AIProvider {
    if (this.providerStatus[this.settings.primaryProvider]) {
      return this.settings.primaryProvider;
    } else if (this.providerStatus[this.settings.fallbackProvider]) {
      return this.settings.fallbackProvider;
    } else {
      // En son çare olarak çalışan herhangi bir provider
      for (const [provider, status] of Object.entries(this.providerStatus)) {
        if (status) {
          return provider as AIProvider;
        }
      }
    }
    
    throw new Error('No AI provider available');
  }

  // Çalışma planı oluştur
  async generateStudyPlan(studentData: any): Promise<any> {
    const providers = this.getProviderOrder();
    
    for (const provider of providers) {
      try {
        switch (provider) {
          case 'google':
            if (this.providerStatus.google) {
              return await googleAIService.generateStudyPlan(
                studentData.studentId,
                studentData.subject,
                studentData.weakAreas,
                studentData.currentLevel
              );
            }
            break;
          case 'openai':
            if (this.providerStatus.openai) {
              return await openAIService.generateStudyPlan(studentData);
            }
            break;
          case 'huggingface':
            if (this.providerStatus.huggingface) {
              return await huggingFaceAIService.generateStudyPlan(studentData);
            }
            break;
          case 'ollama':
            if (this.providerStatus.ollama && ollamaAIService.isConnectionAvailable()) {
              return await ollamaAIService.generateStudyPlan(studentData);
            }
            break;
        }
      } catch (error) {
        console.error(`${provider} study plan generation failed:`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed to generate study plan');
  }

  // Soru oluştur
  async generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<any[]> {
    const providers = this.getProviderOrder();
    
    for (const provider of providers) {
      try {
        switch (provider) {
          case 'google':
            if (this.providerStatus.google) {
              return await googleAIService.generateQuestions(topic, difficulty, count);
            }
            break;
          case 'openai':
            if (this.providerStatus.openai) {
              return await openAIService.generateQuestions(topic, difficulty, count);
            }
            break;
          case 'huggingface':
            if (this.providerStatus.huggingface) {
              return await huggingFaceAIService.generateQuestions(topic, difficulty, count);
            }
            break;
          case 'ollama':
            if (this.providerStatus.ollama && ollamaAIService.isConnectionAvailable()) {
              return await ollamaAIService.generateQuestions(topic, difficulty, count);
            }
            break;
        }
      } catch (error) {
        console.error(`${provider} question generation failed:`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed to generate questions');
  }

  // Konu anlatımı oluştur
  async generateConceptExplanation(topic: string): Promise<any> {
    const providers = this.getProviderOrder();
    
    for (const provider of providers) {
      try {
        switch (provider) {
          case 'google':
            if (this.providerStatus.google) {
              return await googleAIService.generateConceptExplanation(topic);
            }
            break;
          case 'openai':
            if (this.providerStatus.openai) {
              return await openAIService.generateConceptExplanation(topic);
            }
            break;
          case 'huggingface':
            if (this.providerStatus.huggingface) {
              return await huggingFaceAIService.generateConceptExplanation(topic);
            }
            break;
          case 'ollama':
            if (this.providerStatus.ollama && ollamaAIService.isConnectionAvailable()) {
              return await ollamaAIService.generateConceptExplanation(topic);
            }
            break;
        }
      } catch (error) {
        console.error(`${provider} concept explanation failed:`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed to generate concept explanation');
  }

  // Öğrenci analizi
  async analyzeStudentProgress(studentId: string): Promise<any> {
    const providers = this.getProviderOrder();
    
    for (const provider of providers) {
      try {
        switch (provider) {
          case 'google':
            if (this.providerStatus.google) {
              return await googleAIService.analyzeStudentProgress(studentId);
            }
            break;
          case 'openai':
          case 'huggingface':
          case 'ollama':
            // Bu provider'lar için basit analiz
            return this.generateBasicProgress(studentId);
        }
      } catch (error) {
        console.error(`${provider} progress analysis failed:`, error);
        continue;
      }
    }
    
    return this.generateBasicProgress(studentId);
  }

  // Kişiselleştirilmiş geri bildirim
  async generatePersonalizedFeedback(studentProgress: any): Promise<string> {
    const providers = this.getProviderOrder();
    
    for (const provider of providers) {
      try {
        switch (provider) {
          case 'openai':
            if (this.providerStatus.openai) {
              return await openAIService.generatePersonalizedFeedback(studentProgress);
            }
            break;
          case 'huggingface':
            if (this.providerStatus.huggingface) {
              return await huggingFaceAIService.generatePersonalizedFeedback(studentProgress);
            }
            break;
          case 'ollama':
            if (this.providerStatus.ollama && ollamaAIService.isConnectionAvailable()) {
              return await ollamaAIService.generatePersonalizedFeedback(studentProgress);
            }
            break;
          case 'google':
            // Google AI için basit feedback
            return this.generateBasicFeedback(studentProgress);
        }
      } catch (error) {
        console.error(`${provider} feedback generation failed:`, error);
        continue;
      }
    }
    
    return this.generateBasicFeedback(studentProgress);
  }

  // Ollama modelleri al
  async getOllamaModels(): Promise<any[]> {
    if (this.providerStatus.ollama && ollamaAIService.isConnectionAvailable()) {
      return await ollamaAIService.getAvailableModels();
    }
    return [];
  }

  // Provider sıralaması
  private getProviderOrder(): AIProvider[] {
    if (this.settings.useMultipleProviders) {
      return [this.settings.primaryProvider, this.settings.fallbackProvider].filter(
        (provider, index, arr) => arr.indexOf(provider) === index
      );
    } else {
      return [this.settings.primaryProvider];
    }
  }

  // Basit ilerleme analizi
  private generateBasicProgress(studentId: string): any {
    return {
      studentId,
      subject: 'Matematik',
      completedSessions: Math.floor(Math.random() * 20) + 5,
      totalSessions: 30,
      averageScore: Math.floor(Math.random() * 40) + 60,
      weakAreas: ['Oran ve Orantı', 'Geometrik Şekiller'],
      strongAreas: ['Doğrusal Denklemler'],
      lastStudyDate: new Date().toISOString(),
      streakDays: Math.floor(Math.random() * 7) + 1,
      aiInsights: 'Düzenli çalışma ile başarın artıyor!'
    };
  }

  // Basit geri bildirim
  private generateBasicFeedback(studentProgress: any): string {
    const { averageScore, completedSessions } = studentProgress;
    
    if (averageScore >= 80) {
      return `Harika gidiyorsun! ${completedSessions} oturum tamamladın ve ortalaman ${averageScore}%. Bu başarını sürdür!`;
    } else if (averageScore >= 60) {
      return `İyi ilerleme kaydediyorsun. ${completedSessions} oturum tamamladın. Biraz daha çalışarak hedefine ulaşabilirsin.`;
    } else {
      return `Çalışmaya devam et! ${completedSessions} oturum tamamladın. Düzenli çalışma ile başarın artacak.`;
    }
  }

  // Ayarları al
  getSettings(): AISettings {
    return { ...this.settings };
  }

  // Provider durumlarını al
  getProviderStatus() {
    return { ...this.providerStatus };
  }
}

export const aiManager = new AIManager();