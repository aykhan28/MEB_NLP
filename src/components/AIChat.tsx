import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, FileText, Bot, User, Upload, X, Play, Pause } from 'lucide-react';
import { aiManager } from '../services/aiManager';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! Ben senin AI öğretmen asistanınım. Matematik, Türkçe, Fen Bilimleri ve diğer derslerle ilgili sorularını cevaplayabilirim. Ayrıca görsel, ses ve metin dosyaları da yükleyebilirsin. Nasıl yardımcı olabilirim?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState('google');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputText.trim() && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
      attachments: attachments.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('audio/') ? 'audio' : 'document',
        url: URL.createObjectURL(file),
        name: file.name
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAttachments([]);
    setIsLoading(true);

    try {
      // Prepare context for AI
      let prompt = inputText;
      
      if (attachments.length > 0) {
        prompt += '\n\nEklenen dosyalar:\n';
        attachments.forEach(file => {
          prompt += `- ${file.name} (${file.type})\n`;
        });
        prompt += '\nLütfen bu dosyaları analiz ederek soruyu yanıtla.';
      }

      // Get AI response
      let aiResponse = '';
      
      try {
        // Try to generate concept explanation or answer
        const explanation = await aiManager.generateConceptExplanation(prompt);
        aiResponse = explanation.content;
      } catch (error) {
        // Fallback to simple response
        aiResponse = generateFallbackResponse(inputText);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Add activity
      if ((window as any).addActivity) {
        (window as any).addActivity({
          type: 'study',
          title: 'AI Chat Kullanımı',
          description: 'AI asistan ile soru-cevap yapıldı',
          duration: 2
        });
      }

    } catch (error) {
      console.error('AI response failed:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen sorunuzu tekrar deneyin veya daha sonra tekrar gelin.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('matematik') || lowerQuestion.includes('sayı') || lowerQuestion.includes('hesap')) {
      return 'Matematik konularında size yardımcı olmaya hazırım! Hangi matematik konusunda yardıma ihtiyacınız var? Cebir, geometri, sayılar veya başka bir konu hakkında soru sorabilirsiniz.';
    }
    
    if (lowerQuestion.includes('türkçe') || lowerQuestion.includes('dil') || lowerQuestion.includes('yazım')) {
      return 'Türkçe dersi konularında size yardımcı olabilirim. Dil bilgisi, yazım kuralları, okuma anlama veya kompozisyon konularında sorularınızı yanıtlayabilirim.';
    }
    
    if (lowerQuestion.includes('fen') || lowerQuestion.includes('bilim') || lowerQuestion.includes('deney')) {
      return 'Fen Bilimleri konularında size destek olabilirim. Fizik, kimya, biyoloji veya yer bilimleri hakkında sorularınızı cevaplayabilirim.';
    }
    
    return 'Sorunuzu anlıyorum. Size en iyi şekilde yardımcı olmak için sorunuzu biraz daha detaylandırabilir misiniz? Hangi ders veya konu hakkında bilgi almak istiyorsunuz?';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setAttachments(prev => [...prev, audioFile]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'audio': return Play;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Öğretmen Asistanı</h3>
            <p className="text-sm text-gray-600">ChatGPT benzeri akıllı asistan</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="google">Google Gemini</option>
            <option value="huggingface">Hugging Face</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`p-2 rounded-full ${
                message.type === 'user' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment, index) => {
                      const Icon = getAttachmentIcon(attachment.type);
                      return (
                        <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg ${
                          message.type === 'user' ? 'bg-primary-500' : 'bg-gray-200'
                        }`}>
                          <Icon className="h-4 w-4" />
                          <span className="text-xs truncate">{attachment.name}</span>
                          {attachment.type === 'image' && (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 text-gray-600 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => {
              const Icon = getAttachmentIcon(
                file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('audio/') ? 'audio' : 'document'
              );
              
              return (
                <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 truncate max-w-[100px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          {/* File Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Upload className="h-5 w-5" />
          </button>
          
          {/* Voice Recording */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          
          {/* Text Input */}
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Sorunuzu yazın... (Shift+Enter ile yeni satır)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={(!inputText.trim() && attachments.length === 0) || isLoading}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI asistanı görsel, ses ve metin dosyalarını analiz edebilir. Dosya yüklemek için 📎 butonunu kullanın.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default AIChat;