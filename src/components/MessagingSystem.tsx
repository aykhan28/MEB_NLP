import React, { useState, useEffect } from 'react';
import { Send, Search, Users, MessageSquare, Phone, Video, MoreVertical, Paperclip, Smile, Edit3, Trash2, Reply, Forward, Copy, Archive, Pin, Star, History, Download, Eye, EyeOff, Clock, Check, CheckCheck, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  originalContent?: string; // For edited messages
  timestamp: string;
  editedAt?: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  readBy?: { userId: string; readAt: string }[];
  replyTo?: string; // ID of message being replied to
  forwarded?: boolean;
  pinned?: boolean;
  starred?: boolean;
  deleted?: boolean;
  deletedAt?: string;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: 'student' | 'teacher' | 'parent';
    online: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  type: 'individual' | 'group';
  title?: string;
}

const MessagingSystem: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMessageHistory, setShowMessageHistory] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [allMessages, setAllMessages] = useState<{ [key: string]: Message[] }>({});
  const [messageSearchTerm, setMessageSearchTerm] = useState('');

  const mockConversations: Conversation[] = [
    {
      id: '1',
      type: 'individual',
      participants: [
        {
          id: '1',
          name: 'Ayşe Öğretmen',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
          role: 'teacher',
          online: true
        }
      ],
      lastMessage: {
        id: '1',
        senderId: '1',
        senderName: 'Ayşe Öğretmen',
        senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Matematik ödevini teslim etmeyi unutma',
        timestamp: '2024-01-16T10:30:00Z',
        type: 'text',
        read: false
      },
      unreadCount: 2
    },
    {
      id: '2',
      type: 'group',
      title: '8-A Sınıfı',
      participants: [
        {
          id: '2',
          name: 'Mehmet Veli',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
          role: 'parent',
          online: false
        },
        {
          id: '3',
          name: 'Zeynep Kaya',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
          role: 'student',
          online: true
        }
      ],
      lastMessage: {
        id: '2',
        senderId: '2',
        senderName: 'Mehmet Veli',
        senderAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Veli toplantısı ne zaman?',
        timestamp: '2024-01-16T09:15:00Z',
        type: 'text',
        read: true
      },
      unreadCount: 0
    }
  ];

  // Initialize messages from localStorage or use mock data
  useEffect(() => {
    const savedMessages = localStorage.getItem('messagingSystemMessages');
    if (savedMessages) {
      setAllMessages(JSON.parse(savedMessages));
    } else {
      setAllMessages(mockMessagesData);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(allMessages).length > 0) {
      localStorage.setItem('messagingSystemMessages', JSON.stringify(allMessages));
    }
  }, [allMessages]);

  const mockMessagesData: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'Ayşe Öğretmen',
        senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Merhaba Ahmet, bugünkü matematik dersinde çok başarılıydın!',
        timestamp: '2024-01-16T09:00:00Z',
        type: 'text',
        read: true
      },
      {
        id: '2',
        senderId: 'current',
        senderName: 'Ben',
        senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Teşekkür ederim öğretmenim! Geometri konusunu daha iyi anladım.',
        timestamp: '2024-01-16T09:05:00Z',
        type: 'text',
        read: true
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'Ayşe Öğretmen',
        senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Matematik ödevini teslim etmeyi unutma',
        timestamp: '2024-01-16T10:30:00Z',
        type: 'text',
        read: false
      }
    ],
    '2': [
      {
        id: '4',
        senderId: '2',
        senderName: 'Mehmet Veli',
        senderAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        content: 'Veli toplantısı ne zaman?',
        timestamp: '2024-01-16T09:15:00Z',
        type: 'text',
        read: true
      }
    ]
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      senderName: 'Ben',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: messageText,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: true
    };

    // Add message to conversation
    setAllMessages(prev => {
      const updated = { ...prev };
      if (!updated[selectedConversation]) {
        updated[selectedConversation] = [];
      }
      updated[selectedConversation].push(newMessage);
      return updated;
    });

    setMessageText('');

    // Add activity
    if ((window as any).addActivity) {
      (window as any).addActivity({
        type: 'study',
        title: 'Mesaj Gönderildi',
        description: `${getConversationTitle(selectedConversation)} ile mesajlaşma`,
        duration: 1
      });
    }
  };

  const getConversationTitle = (conversationId: string) => {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation) return '';
    
    if (conversation.type === 'group') {
      return conversation.title || 'Grup';
    } else {
      return conversation.participants[0]?.name || 'Kullanıcı';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = mockConversations.filter(conversation =>
    getConversationTitle(conversation.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversationData = mockConversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? allMessages[selectedConversation] || [] : [];

  // Message management functions
  const editMessage = (messageId: string, newContent: string) => {
    setAllMessages(prev => {
      const updated = { ...prev };
      if (selectedConversation && updated[selectedConversation]) {
        updated[selectedConversation] = updated[selectedConversation].map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, originalContent: msg.originalContent || msg.content, editedAt: new Date().toISOString() }
            : msg
        );
      }
      return updated;
    });
    setEditingMessage(null);
    setEditText('');
  };

  const deleteMessage = (messageId: string) => {
    setAllMessages(prev => {
      const updated = { ...prev };
      if (selectedConversation && updated[selectedConversation]) {
        updated[selectedConversation] = updated[selectedConversation].map(msg => 
          msg.id === messageId 
            ? { ...msg, deleted: true, deletedAt: new Date().toISOString(), content: 'Bu mesaj silindi' }
            : msg
        );
      }
      return updated;
    });
  };

  const toggleMessageStar = (messageId: string) => {
    setAllMessages(prev => {
      const updated = { ...prev };
      if (selectedConversation && updated[selectedConversation]) {
        updated[selectedConversation] = updated[selectedConversation].map(msg => 
          msg.id === messageId 
            ? { ...msg, starred: !msg.starred }
            : msg
        );
      }
      return updated;
    });
  };

  const markAsRead = (messageId: string) => {
    setAllMessages(prev => {
      const updated = { ...prev };
      if (selectedConversation && updated[selectedConversation]) {
        updated[selectedConversation] = updated[selectedConversation].map(msg => 
          msg.id === messageId 
            ? { ...msg, read: true, readBy: [...(msg.readBy || []), { userId: 'current', readAt: new Date().toISOString() }] }
            : msg
        );
      }
      return updated;
    });
  };

  const searchMessages = (term: string) => {
    if (!selectedConversation || !term) return messages;
    return messages.filter(message => 
      message.content.toLowerCase().includes(term.toLowerCase()) ||
      message.senderName.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredMessages = messageSearchTerm ? searchMessages(messageSearchTerm) : messages;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Mesajlar</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Konuşma ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {conversation.type === 'group' ? (
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={conversation.participants[0]?.avatar}
                      alt={conversation.participants[0]?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.participants[0]?.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {getConversationTitle(conversation.id)}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>
                  {conversation.type === 'group' && (
                    <div className="flex items-center space-x-1 mt-1">
                      {conversation.participants.slice(0, 3).map((participant, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          {participant.name}
                          {index < Math.min(conversation.participants.length - 1, 2) && ','}
                        </span>
                      ))}
                      {conversation.participants.length > 3 && (
                        <span className="text-xs text-gray-500">+{conversation.participants.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedConversationData?.type === 'group' ? (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                ) : (
                  <img
                    src={selectedConversationData?.participants[0]?.avatar}
                    alt={selectedConversationData?.participants[0]?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {getConversationTitle(selectedConversation)}
                  </h4>
                  {selectedConversationData?.type === 'individual' && (
                    <p className="text-sm text-gray-600">
                      {selectedConversationData.participants[0]?.online ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mesajlarda ara..."
                    value={messageSearchTerm}
                    onChange={(e) => setMessageSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48"
                  />
                </div>
                <button 
                  onClick={() => setShowMessageHistory(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  title="Mesaj Geçmişi"
                >
                  <History className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {replyingTo && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Yanıtlanıyor: {replyingTo.senderName}</p>
                      <p className="text-sm text-blue-600 truncate">{replyingTo.content}</p>
                    </div>
                    <button 
                      onClick={() => setReplyingTo(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.senderId === 'current' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {message.senderId !== 'current' && (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="relative">
                      {/* Message Actions */}
                      <div className={`absolute -top-8 ${message.senderId === 'current' ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 bg-white shadow-lg rounded-lg p-1 border`}>
                        <button
                          onClick={() => setReplyingTo(message)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Yanıtla"
                        >
                          <Reply className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => toggleMessageStar(message.id)}
                          className={`p-1 hover:bg-yellow-50 rounded ${message.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-600'}`}
                          title="Yıldızla"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                        {message.senderId === 'current' && !message.deleted && (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessage(message.id);
                                setEditText(message.content);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Düzenle"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Sil"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                          title="Kopyala"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className={`text-xs text-gray-500 mb-1 ${message.senderId === 'current' ? 'text-right' : 'text-left'}`}>
                          <Reply className="h-3 w-3 inline mr-1" />
                          Yanıt
                        </div>
                      )}

                      <div
                        className={`px-4 py-2 rounded-2xl relative ${
                          message.senderId === 'current'
                            ? message.deleted ? 'bg-red-100 text-red-800' : 'bg-primary-600 text-white'
                            : message.deleted ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-900'
                        } ${message.starred ? 'ring-2 ring-yellow-300' : ''}`}
                      >
                        {message.starred && (
                          <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        
                        {editingMessage === message.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  editMessage(message.id, editText);
                                }
                              }}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editMessage(message.id, editText)}
                                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessage(null);
                                  setEditText('');
                                }}
                                className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                İptal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.content}</p>
                            {message.editedAt && (
                              <p className={`text-xs mt-1 italic ${
                                message.senderId === 'current' ? 'text-primary-200' : 'text-gray-400'
                              }`}>
                                düzenlendi
                              </p>
                            )}
                          </>
                        )}
                        
                        <div className={`flex items-center justify-between mt-1 ${
                          message.senderId === 'current' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          <p className="text-xs">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.senderId === 'current' && (
                            <div className="flex items-center space-x-1">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={replyingTo ? `${replyingTo.senderName} kişisine yanıt yazın...` : "Mesajınızı yazın..."}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlaşmaya Başlayın</h3>
              <p className="text-gray-600">Bir konuşma seçin veya yeni bir mesaj başlatın</p>
            </div>
          </div>
        )}
      </div>

      {/* Message History Modal */}
      {showMessageHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Mesaj Geçmişi</h3>
              <button
                onClick={() => setShowMessageHistory(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Mesajlarda ara..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="all">Tüm Mesajlar</option>
                    <option value="starred">Yıldızlı</option>
                    <option value="edited">Düzenlenmiş</option>
                    <option value="deleted">Silinmiş</option>
                  </select>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Toplam Mesaj</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{messages.length}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Yıldızlı</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {messages.filter(m => m.starred).length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Düzenlenmiş</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {messages.filter(m => m.editedAt).length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">Silinmiş</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {messages.filter(m => m.deleted).length}
                    </p>
                  </div>
                </div>

                {/* Message Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Mesaj Zaman Çizelgesi</h4>
                  {messages.map((message) => (
                    <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={message.senderAvatar}
                          alt={message.senderName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-900">{message.senderName}</h5>
                            <span className="text-sm text-gray-500">
                              {new Date(message.timestamp).toLocaleString('tr-TR')}
                            </span>
                            {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {message.editedAt && <Edit3 className="h-4 w-4 text-green-500" />}
                            {message.deleted && <Trash2 className="h-4 w-4 text-red-500" />}
                          </div>
                          <p className={`text-sm ${message.deleted ? 'text-red-600 italic' : 'text-gray-700'}`}>
                            {message.content}
                          </p>
                          {message.editedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Düzenlendi: {new Date(message.editedAt).toLocaleString('tr-TR')}
                            </p>
                          )}
                          {message.originalContent && message.editedAt && (
                            <details className="mt-2">
                              <summary className="text-xs text-blue-600 cursor-pointer">Orijinal mesajı göster</summary>
                              <p className="text-xs text-gray-600 mt-1 p-2 bg-blue-50 rounded">
                                {message.originalContent}
                              </p>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export Options */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Dışa Aktar</h4>
                  <div className="flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>PDF Olarak İndir</span>
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Excel Olarak İndir</span>
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
                      <Copy className="h-4 w-4" />
                      <span>Metin Olarak Kopyala</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;