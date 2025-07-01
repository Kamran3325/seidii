import React, { useState } from 'react';
import { Search, Users, Crown, Shield, Code, Wrench, BookOpen, UserCheck } from 'lucide-react';
import { User } from '../../types';
import { getRankConfig } from '../../utils/ranks';

interface StaffDirectoryProps {
  users: User[];
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = selectedRank === 'all' || user.rank === selectedRank;
    return matchesSearch && matchesRank;
  });

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'kurucu': return <Crown className="h-5 w-5" />;
      case 'gelistirici': return <Code className="h-5 w-5" />;
      case 'admin': return <Shield className="h-5 w-5" />;
      case 'moderator': return <Wrench className="h-5 w-5" />;
      case 'asistan': return <UserCheck className="h-5 w-5" />;
      case 'rehber': return <BookOpen className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Şu an aktif';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Yetkili Rehberi</h2>
        </div>
        <p className="text-gray-400 text-lg">
          Tüm yetkili personelin detaylı listesi ve iletişim bilgileri
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Yetkili ara..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tüm Ranklar</option>
            <option value="kurucu">👑 Kurucu</option>
            <option value="gelistirici">💻 Geliştirici</option>
            <option value="admin">⚡ Admin</option>
            <option value="moderator">🛡️ Moderator</option>
            <option value="asistan">🤝 Asistan</option>
            <option value="rehber">📖 Rehber</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => {
          const rankConfig = getRankConfig(user.rank);
          
          return (
            <div
              key={user.id}
              className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center mb-4">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {user.avatar || '👤'}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-gray-800 ${
                    user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  {user.username}
                </h3>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${rankConfig.color} bg-opacity-10`}>
                  {getRankIcon(user.rank)}
                  <span>{rankConfig.badge} {rankConfig.name}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400">Durum:</span>
                  <span className={`font-medium ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                    {user.isOnline ? '🟢 Çevrimiçi' : '🔴 Çevrimdışı'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400">Performans:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${user.performance}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{user.performance}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400">Toplam İşlem:</span>
                  <span className="text-white font-bold">{user.totalActions}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400">Son Aktivite:</span>
                  <span className="text-white text-sm">{formatLastActive(user.lastActive)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400">Katılım:</span>
                  <span className="text-white text-sm">
                    {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {user.isAdmin && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                    <span className="text-red-400 font-medium">🔥 Admin Yetkisi</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 font-medium">
                  💬 Mesaj Gönder
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Yetkili Bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinize uygun yetkili bulunamadı.</p>
        </div>
      )}
    </div>
  );
};