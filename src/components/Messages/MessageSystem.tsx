import React, { useState, useEffect } from 'react';
import { Send, Search, Users, MessageCircle, Image, Mic, BarChart3, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { Message, User, Poll, PollOption } from '../../types';
import { getRankConfig, hasPermission } from '../../utils/ranks';
import { GroupChat } from './GroupChat';

export const MessageSystem: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'private' | 'group'>('private');

  useEffect(() => {
    const loadData = () => {
      setUsers(storage.getUsers().filter(u => u.id !== user?.id && u.status === 'approved' && !u.isBanned));
      setMessages(storage.getMessages());
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChatMessages = (userId: string) => {
    if (!user) return [];
    return messages
      .filter(m => 
        (m.fromUserId === user.id && m.toUserId === userId) ||
        (m.fromUserId === userId && m.toUserId === user.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const sendMessage = () => {
    if (!user || !newMessage.trim() || !selectedUser) return;
    
    // Check permissions
    if (!hasPermission(user.rank, 'send_messages')) {
      alert('Mesaj gönderme yetkiniz yok!');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId: selectedUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);
    setNewMessage('');
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setNewMessage(prev => prev + `\n📷 Resim: ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getUnreadCount = (userId: string) => {
    if (!user) return 0;
    return messages.filter(m => 
      m.fromUserId === userId && 
      m.toUserId === user.id && 
      !m.isRead
    ).length;
  };

  const markMessagesAsRead = (userId: string) => {
    if (!user) return;
    
    const updatedMessages = messages.map(m => 
      m.fromUserId === userId && m.toUserId === user.id && !m.isRead
        ? { ...m, isRead: true }
        : m
    );
    
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);
  };

  if (!user) return null;

  // Check if user can access messages
  if (!hasPermission(user.rank, 'read_messages')) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold mb-2">🚫 Erişim Engellendi</p>
          <p className="text-lg">Mesajları görüntülemek için yetkiniz yok</p>
          <p className="text-sm mt-2">Lütfen bir yetkiliden rank almanızı isteyin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-700/50 flex flex-col">
        {/* Tab Switcher */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex bg-gray-700/30 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('private')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all duration-200 ${
                activeTab === 'private'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">💬 Özel Mesaj</span>
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all duration-200 ${
                activeTab === 'group'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="font-medium">🌟 Grup Sohbet</span>
            </button>
          </div>
        </div>

        {activeTab === 'private' && (
          <>
            <div className="p-4 border-b border-gray-700/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Yetkili ara..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredUsers.map(otherUser => {
                const rankConfig = getRankConfig(otherUser.rank);
                const unreadCount = getUnreadCount(otherUser.id);
                const isSelected = selectedUser?.id === otherUser.id;
                
                return (
                  <button
                    key={otherUser.id}
                    onClick={() => {
                      setSelectedUser(otherUser);
                      markMessagesAsRead(otherUser.id);
                    }}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-700/30 transition-all duration-200 group ${
                      isSelected ? 'bg-blue-500/20 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                        {otherUser.avatar && otherUser.avatar.startsWith('http') ? (
                          <img 
                            src={otherUser.avatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling!.textContent = '👤';
                            }}
                          />
                        ) : (
                          <span className="text-lg">{otherUser.avatar || '👤'}</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        otherUser.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                    </div>

                    <div className="flex-1 text-left">
                      <p className="text-white font-medium group-hover:text-blue-400 transition-colors duration-200">
                        {otherUser.displayName || otherUser.username}
                      </p>
                      <p className={`text-xs ${rankConfig.color.split(' ')[0]}`}>
                        {rankConfig.badge} {rankConfig.name}
                      </p>
                      <p className={`text-xs mt-1 ${otherUser.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                        {otherUser.isOnline ? '🟢 Çevrimiçi' : '🔴 Çevrimdışı'}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-xs font-bold">{unreadCount}</span>
                      </div>
                    )}
                  </button>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Yetkili bulunamadı</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'group' && (
          <div className="flex-1 p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">🌟 Grup Sohbeti</h3>
              <p className="text-gray-400 text-sm mb-4">Tüm yetkililerle sohbet et</p>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2 justify-center">
                  <MessageCircle className="h-4 w-4" />
                  <span>Mesaj gönder</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <BarChart3 className="h-4 w-4" />
                  <span>Anket oluştur</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users className="h-4 w-4" />
                  <span>Grup tartışması</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'group' ? (
          <GroupChat />
        ) : selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                {selectedUser.avatar && selectedUser.avatar.startsWith('http') ? (
                  <img 
                    src={selectedUser.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling!.textContent = '👤';
                    }}
                  />
                ) : (
                  <span className="text-lg">{selectedUser.avatar || '👤'}</span>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{selectedUser.displayName || selectedUser.username}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${getRankConfig(selectedUser.rank).color.split(' ')[0]}`}>
                    {getRankConfig(selectedUser.rank).badge} {getRankConfig(selectedUser.rank).name}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedUser.isOnline 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedUser.isOnline ? '🟢 Çevrimiçi' : '🔴 Çevrimdışı'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {getChatMessages(selectedUser.id).map(message => {
                const isFromMe = message.fromUserId === user.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} animate-slide-in-up`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-lg ${
                        isFromMe
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-gray-700/50 text-gray-100 border border-gray-600/50'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        isFromMe ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {getChatMessages(selectedUser.id).length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">💬 Henüz mesaj yok</h3>
                  <p className="text-gray-500">İlk mesajı gönderin ve sohbeti başlatın!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            {hasPermission(user.rank, 'send_messages') && (
              <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
                <div className="flex gap-2">
                  <button
                    onClick={handleImageUpload}
                    className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105"
                    title="Resim Ekle"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesaj yaz..."
                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageCircle className="h-20 w-20 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold mb-3">💬 Mesajlaşmaya başla</h3>
              <p className="text-lg">Sol taraftan bir yetkili seç ve sohbete başla</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};