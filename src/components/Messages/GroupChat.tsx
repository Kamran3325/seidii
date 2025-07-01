import React, { useState, useEffect } from 'react';
import { Send, BarChart3, Plus, X, Vote, Users, MessageCircle, Image } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { Message, User, Poll, PollOption } from '../../types';
import { hasPermission } from '../../utils/ranks';

export const GroupChat: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showPollForm, setShowPollForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  useEffect(() => {
    const loadData = () => {
      setUsers(storage.getUsers().filter(u => u.status === 'approved' && !u.isBanned));
      setGroupMessages(storage.getGroupMessages());
      setPolls(storage.getPolls());
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!user || !newMessage.trim()) return;
    
    if (!hasPermission(user.rank, 'send_messages')) {
      alert('Mesaj gönderme yetkiniz yok!');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId: 'group',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...groupMessages, message];
    setGroupMessages(updatedMessages);
    storage.setGroupMessages(updatedMessages);
    setNewMessage('');
  };

  const createPoll = () => {
    if (!user || !newPoll.question.trim()) return;
    
    if (!hasPermission(user.rank, 'send_messages')) {
      alert('Anket oluşturma yetkiniz yok!');
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('En az 2 seçenek gerekli!');
      return;
    }

    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question.trim(),
      options: validOptions.map((opt, index) => ({
        id: `${Date.now()}_${index}`,
        text: opt.trim(),
        votes: []
      })),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    };

    const updatedPolls = [...polls, poll];
    setPolls(updatedPolls);
    storage.setPolls(updatedPolls);

    // Send poll message to group
    const pollMessage: Message = {
      id: (Date.now() + 1).toString(),
      fromUserId: user.id,
      toUserId: 'group',
      content: `📊 **ANKET OLUŞTURULDU**\n\n**Soru:** ${poll.question}\n\n**Seçenekler:**\n${validOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\n*Oy vermek için aşağıdaki anketi kullanın*`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...groupMessages, pollMessage];
    setGroupMessages(updatedMessages);
    storage.setGroupMessages(updatedMessages);
    
    setNewPoll({ question: '', options: ['', ''] });
    setShowPollForm(false);
  };

  const voteOnPoll = (pollId: string, optionId: string) => {
    if (!user) return;

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map(option => {
          // Remove user's previous vote from all options
          const filteredVotes = option.votes.filter(vote => vote !== user.id);
          
          // Add vote to selected option
          if (option.id === optionId) {
            return { ...option, votes: [...filteredVotes, user.id] };
          }
          
          return { ...option, votes: filteredVotes };
        });
        
        return { ...poll, options: updatedOptions };
      }
      return poll;
    });

    setPolls(updatedPolls);
    storage.setPolls(updatedPolls);
  };

  const getUserVote = (poll: Poll): string | null => {
    if (!user) return null;
    
    for (const option of poll.options) {
      if (option.votes.includes(user.id)) {
        return option.id;
      }
    }
    return null;
  };

  const getTotalVotes = (poll: Poll): number => {
    return poll.options.reduce((total, option) => total + option.votes.length, 0);
  };

  const getVotePercentage = (option: PollOption, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes.length / totalVotes) * 100);
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
          setNewMessage(prev => prev + `\n📷 Resim paylaşıldı: ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!user) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Group Chat Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">🌟 Grup Sohbeti</p>
            <p className="text-sm text-gray-400">{users.length} Aktif Yetkili</p>
          </div>
        </div>

        {hasPermission(user.rank, 'send_messages') && (
          <button
            onClick={() => setShowPollForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200 transform hover:scale-105"
          >
            <BarChart3 className="h-4 w-4" />
            📊 Anket Oluştur
          </button>
        )}
      </div>

      {/* Messages and Polls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Active Polls */}
        {polls.filter(poll => poll.isActive).map(poll => {
          const totalVotes = getTotalVotes(poll);
          const userVote = getUserVote(poll);
          const pollCreator = users.find(u => u.id === poll.createdBy);
          
          return (
            <div key={poll.id} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{poll.question}</h3>
                  <p className="text-sm text-gray-400">
                    👤 {pollCreator?.displayName || pollCreator?.username} • 
                    📅 {new Date(poll.createdAt).toLocaleDateString('tr-TR')} • 
                    🗳️ {totalVotes} oy
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {poll.options.map((option, index) => {
                  const percentage = getVotePercentage(option, totalVotes);
                  const isSelected = userVote === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => voteOnPoll(poll.id, option.id)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-500/50 scale-105 shadow-lg'
                          : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {index + 1}. {option.text}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-bold">{percentage}%</span>
                          <span className="text-gray-400">({option.votes.length})</span>
                          {isSelected && <Vote className="h-4 w-4 text-purple-400" />}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-600 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600/50">
                <p className="text-xs text-gray-400 text-center">
                  ⏰ Anket {new Date(poll.expiresAt).toLocaleDateString('tr-TR')} tarihinde sona erecek
                </p>
              </div>
            </div>
          );
        })}

        {/* Group Messages */}
        {groupMessages.map(message => {
          const messageUser = users.find(u => u.id === message.fromUserId);
          const isFromMe = message.fromUserId === user.id;
          
          return (
            <div key={message.id} className="flex items-start gap-3 animate-slide-in-up">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-sm">{messageUser?.avatar || '👤'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${isFromMe ? 'text-blue-400' : 'text-white'}`}>
                    {messageUser?.displayName || messageUser?.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className={`rounded-lg px-4 py-3 ${
                  isFromMe 
                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30' 
                    : 'bg-gray-700/30 border border-gray-600/30'
                } hover:bg-opacity-80 transition-all duration-200`}>
                  <p className="text-gray-100 whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}

        {groupMessages.length === 0 && (
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
              placeholder="Grup mesajı yaz..."
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

      {/* Poll Form Modal */}
      {showPollForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">📊 Anket Oluştur</h3>
              <button
                onClick={() => setShowPollForm(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Anket Sorusu
                </label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Anket sorunuzu yazın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seçenekler (En az 2 tane)
                </label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll({ ...newPoll, options: newOptions });
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Seçenek ${index + 1}`}
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        onClick={() => {
                          const newOptions = newPoll.options.filter((_, i) => i !== index);
                          setNewPoll({ ...newPoll, options: newOptions });
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {newPoll.options.length < 6 && (
                  <button
                    onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Seçenek Ekle
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPollForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={createPoll}
                  disabled={!newPoll.question.trim() || newPoll.options.filter(opt => opt.trim()).length < 2}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
                >
                  📊 Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};