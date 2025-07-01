import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Users, Award, Megaphone, Plus, X, Ban, UserCheck, Clock, AlertTriangle, Crown, Star, Zap, Settings, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { User, UserRank, Announcement } from '../../types';
import { getRankConfig, rankConfigs, canAccessAdminPanel, hasPermission } from '../../utils/ranks';

export const AdminPanel: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRank, setNewRank] = useState<UserRank>('rehber');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'announcements' | 'pending' | 'banned' | 'analytics'>('dashboard');
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);

  useEffect(() => {
    setUsers(storage.getUsers());
    setAnnouncements(storage.getAnnouncements());
  }, []);

  const handleRankChange = () => {
    if (!selectedUser || !user) return;

    const updatedUser = { 
      ...selectedUser, 
      rank: newRank,
      status: newRank === 'beklemede' ? 'pending' : 'approved',
      approvedBy: newRank !== 'beklemede' ? user.displayName || user.username : undefined,
      approvedAt: newRank !== 'beklemede' ? new Date().toISOString() : undefined
    };
    
    const updatedUsers = users.map(u => u.id === selectedUser.id ? updatedUser : u);
    
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    setSelectedUser(null);

    // Update current user if they changed their own rank
    if (user && selectedUser.id === user.id) {
      updateUser(updatedUser);
    }
  };

  const makeAdmin = (userId: string) => {
    if (!user) return;
    
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
    );
    
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);

    // Update current user if they changed their own admin status
    if (user && userId === user.id) {
      const updatedCurrentUser = updatedUsers.find(u => u.id === user.id);
      if (updatedCurrentUser) {
        updateUser(updatedCurrentUser);
      }
    }
  };

  const banUser = (targetUser: User, reason: string) => {
    if (!user) return;
    
    const updatedUsers = users.map(u => 
      u.id === targetUser.id ? { 
        ...u, 
        isBanned: !u.isBanned,
        banReason: !u.isBanned ? reason : undefined,
        bannedBy: !u.isBanned ? user.displayName || user.username : undefined,
        bannedAt: !u.isBanned ? new Date().toISOString() : undefined,
        isOnline: false
      } : u
    );
    
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    setShowBanModal(false);
    setUserToBan(null);
    setBanReason('');
  };

  const approveUser = (userId: string) => {
    if (!user) return;
    
    const updatedUsers = users.map(u => 
      u.id === userId ? { 
        ...u, 
        status: 'approved',
        rank: 'rehber',
        approvedBy: user.displayName || user.username,
        approvedAt: new Date().toISOString()
      } : u
    );
    
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
  };

  const addAnnouncement = () => {
    if (!user || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title.trim(),
      content: newAnnouncement.content.trim(),
      authorId: user.id,
      authorName: user.displayName || user.username,
      timestamp: new Date().toISOString(),
      isImportant: false
    };

    const updatedAnnouncements = [announcement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    storage.setAnnouncements(updatedAnnouncements);
    
    setNewAnnouncement({ title: '', content: '' });
    setShowAnnouncementForm(false);
  };

  const deleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    setAnnouncements(updatedAnnouncements);
    storage.setAnnouncements(updatedAnnouncements);
  };

  if (!user || !canAccessAdminPanel(user)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-400 animate-fade-in">
          <Shield className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold mb-2">🚫 Erişim Engellendi</p>
          <p className="text-lg">Bu alana sadece adminler ve üst düzey yetkililer erişebilir</p>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const bannedUsers = users.filter(u => u.isBanned);
  const activeUsers = users.filter(u => !u.isBanned && u.status === 'approved');
  const onlineUsers = users.filter(u => u.isOnline && !u.isBanned);

  const stats = [
    { label: 'Toplam Kullanıcı', value: users.length, icon: Users, color: 'blue' },
    { label: 'Çevrimiçi', value: onlineUsers.length, icon: Activity, color: 'green' },
    { label: 'Beklemede', value: pendingUsers.length, icon: Clock, color: 'yellow' },
    { label: 'Banlı', value: bannedUsers.length, icon: Ban, color: 'red' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Shield className="h-10 w-10 text-red-400" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              🛡️ Admin Kontrol Merkezi
            </h2>
            <p className="text-red-400 text-lg">Gelişmiş Yönetim Paneli</p>
          </div>
        </div>
        <p className="text-gray-400">
          Bu panel sadece admin yetkisine sahip kullanıcılar tarafından görülebilir.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
            green: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-400',
            yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
            red: 'from-red-500/10 to-red-600/10 border-red-500/30 text-red-400'
          };
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${colors[stat.color as keyof typeof colors]} border rounded-xl p-6 hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-300 font-medium">{stat.label}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color === 'blue' ? 'text-blue-400' : stat.color === 'green' ? 'text-green-400' : stat.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'users', label: 'Kullanıcılar', icon: Users, count: activeUsers.length },
            { id: 'pending', label: 'Beklemede', icon: Clock, count: pendingUsers.length },
            { id: 'banned', label: 'Banlı', icon: Ban, count: bannedUsers.length },
            { id: 'announcements', label: 'Duyurular', icon: Megaphone, count: announcements.length },
            { id: 'analytics', label: 'Analitik', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              En Aktif Yetkililer
            </h3>
            <div className="space-y-3">
              {activeUsers
                .sort((a, b) => b.totalActions - a.totalActions)
                .slice(0, 5)
                .map((user, index) => {
                  const rankConfig = getRankConfig(user.rank);
                  return (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">#{index + 1}</div>
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.displayName || user.username}</p>
                        <p className={`text-xs ${rankConfig.color.split(' ')[0]}`}>
                          {rankConfig.badge} {rankConfig.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{user.totalActions}</p>
                        <p className="text-xs text-gray-400">işlem</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Son Aktiviteler
            </h3>
            <div className="space-y-3">
              {users
                .filter(u => u.lastActive)
                .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
                .slice(0, 5)
                .map(user => {
                  const rankConfig = getRankConfig(user.rank);
                  return (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm">{user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.displayName || user.username}</p>
                        <p className={`text-xs ${rankConfig.color.split(' ')[0]}`}>
                          {rankConfig.badge} {rankConfig.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {new Date(user.lastActive).toLocaleString('tr-TR')}
                        </p>
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">⏳ Onay Bekleyen Kullanıcılar</h3>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Onay bekleyen kullanıcı yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map(pendingUser => (
                <div
                  key={pendingUser.id}
                  className="bg-gray-700/30 rounded-lg border border-gray-600/30 p-4 hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">{pendingUser.avatar || '👤'}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{pendingUser.displayName || pendingUser.username}</p>
                      <p className="text-gray-400 text-sm">
                        📅 {new Date(pendingUser.joinDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveUser(pendingUser.id)}
                      className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 font-medium"
                    >
                      ✅ Onayla
                    </button>
                    <button
                      onClick={() => {
                        setUserToBan(pendingUser);
                        setBanReason('Onaylanmadı');
                        setShowBanModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 font-medium"
                    >
                      ❌ Reddet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'banned' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Ban className="h-6 w-6 text-red-400" />
            <h3 className="text-xl font-semibold text-white">🚫 Banlı Kullanıcılar</h3>
          </div>

          {bannedUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Ban className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Banlı kullanıcı yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannedUsers.map(bannedUser => (
                <div
                  key={bannedUser.id}
                  className="bg-gray-700/30 rounded-lg border border-gray-600/30 p-4 hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">{bannedUser.avatar || '👤'}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{bannedUser.displayName || bannedUser.username}</p>
                      <p className="text-red-400 text-sm">🚫 {bannedUser.banReason}</p>
                      <p className="text-gray-400 text-xs">
                        👤 {bannedUser.bannedBy} • 📅 {bannedUser.bannedAt ? new Date(bannedUser.bannedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => banUser(bannedUser, '')}
                    className="w-full px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all duration-200 font-medium"
                  >
                    🔓 Ban Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">📢 Duyuru Yönetimi</h3>
            </div>
            {hasPermission(user.rank, 'create_announcements') && (
              <button
                onClick={() => setShowAnnouncementForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                📝 Duyuru Ekle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
            {announcements.map(announcement => (
              <div
                key={announcement.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">{announcement.title}</h4>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-300 mb-3 line-clamp-3">{announcement.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>👤 {announcement.authorName}</span>
                  <span>📅 {new Date(announcement.timestamp).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">👥 Kullanıcı Yönetimi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
            {activeUsers.map(otherUser => {
              const rankConfig = getRankConfig(otherUser.rank);
              
              return (
                <div
                  key={otherUser.id}
                  className="bg-gray-700/30 rounded-lg border border-gray-600/30 p-4 hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg">{otherUser.avatar || '👤'}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        otherUser.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-white font-medium">{otherUser.displayName || otherUser.username}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${rankConfig.color} bg-opacity-10`}>
                        <span>{rankConfig.badge}</span>
                        <span>{rankConfig.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedUser(otherUser)}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      🎭 Rank
                    </button>
                    <button
                      onClick={() => makeAdmin(otherUser.id)}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                        otherUser.isAdmin
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {otherUser.isAdmin ? '⚡ Admin-' : '⚡ Admin+'}
                    </button>
                    <button
                      onClick={() => {
                        setUserToBan(otherUser);
                        setBanReason('Admin tarafından banlandı');
                        setShowBanModal(true);
                      }}
                      className="col-span-2 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      🔨 Ban
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              Rank Dağılımı
            </h3>
            <div className="space-y-3">
              {Object.entries(rankConfigs).map(([rank, config]) => {
                const count = users.filter(u => u.rank === rank && !u.isBanned).length;
                const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                
                return (
                  <div key={rank} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.badge}</span>
                      <span className="text-white font-medium">{config.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${config.color.includes('yellow') ? 'from-yellow-500 to-yellow-600' : 
                            config.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                            config.color.includes('red') ? 'from-red-500 to-red-600' :
                            config.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                            config.color.includes('cyan') ? 'from-cyan-500 to-cyan-600' :
                            config.color.includes('emerald') ? 'from-emerald-500 to-emerald-600' :
                            'from-gray-500 to-gray-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Sistem Durumu
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">🟢 Sistem Durumu</span>
                  <span className="text-green-400 font-bold">Aktif</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-medium">📊 Toplam Kayıt</span>
                  <span className="text-blue-400 font-bold">{users.length}</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-medium">📢 Duyuru Sayısı</span>
                  <span className="text-purple-400 font-bold">{announcements.length}</span>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-medium">⚡ Admin Sayısı</span>
                  <span className="text-yellow-400 font-bold">{users.filter(u => u.isAdmin).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rank Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm">{selectedUser.avatar}</span>
              </div>
              {selectedUser.displayName || selectedUser.username} - Rank Değiştir
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Yeni Rank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(rankConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setNewRank(key as UserRank)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        newRank === key
                          ? `${config.color} bg-opacity-20 border-opacity-50 scale-105`
                          : 'text-gray-400 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{config.badge}</div>
                        <div className="text-sm font-medium">{config.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleRankChange}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                >
                  Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && userToBan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Ban className="h-6 w-6 text-red-400" />
              Kullanıcıyı Banla
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-medium">
                  {userToBan.displayName || userToBan.username} kullanıcısını banlamak istediğinizden emin misiniz?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ban Sebebi
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ban sebebini yazın..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setUserToBan(null);
                    setBanReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={() => banUser(userToBan, banReason)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                >
                  🔨 Banla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">📢 Yeni Duyuru</h3>
              <button
                onClick={() => setShowAnnouncementForm(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Duyuru başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Duyuru içeriği..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAnnouncementForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={addAnnouncement}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                >
                  📢 Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};