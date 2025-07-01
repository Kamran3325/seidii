import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';
import { storage } from '../../utils/storage';
import { User } from '../../types';
import { getRankConfig } from '../../utils/ranks';

export const PerformanceBoard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const sortedUsers = users.sort((a, b) => b.totalActions - a.totalActions);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1: return <Award className="h-6 w-6 text-gray-400" />;
      case 2: return <Star className="h-6 w-6 text-amber-600" />;
      default: return <TrendingUp className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 0: return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black';
      case 1: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-black';
      case 2: return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Performans Sıralaması</h2>
        </div>
        <p className="text-gray-400">
          Yetkililerin toplam işlem sayısına göre performans sıralaması
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sortedUsers.slice(0, 3).map((user, index) => {
          const rankConfig = getRankConfig(user.rank);
          
          return (
            <div
              key={user.id}
              className={`relative p-6 rounded-xl border backdrop-blur-sm ${
                index === 0 ? 'bg-yellow-500/10 border-yellow-500/30 transform scale-105' :
                index === 1 ? 'bg-gray-400/10 border-gray-400/30' :
                'bg-amber-600/10 border-amber-600/30'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-2xl ${getRankBadge(index)}`}>
                  {index + 1}
                </div>
                
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xl">{user.avatar || '👤'}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{user.username}</h3>
                <p className={`text-sm ${rankConfig.color} mb-3`}>
                  {rankConfig.badge} {rankConfig.name}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {getRankIcon(index)}
                    <span className="text-2xl font-bold text-white">{user.totalActions}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Toplam İşlem</p>
                </div>

                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      🏆 EN İYİ
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Ranking Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">Tam Sıralama</h3>
        </div>

        <div className="divide-y divide-gray-700/50">
          {sortedUsers.map((user, index) => {
            const rankConfig = getRankConfig(user.rank);
            
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-700/30 transition-all duration-200 ${
                  index < 3 ? 'bg-gray-700/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadge(index)}`}>
                    {index + 1}
                  </div>

                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    <span>{user.avatar || '👤'}</span>
                  </div>

                  <div>
                    <h4 className="text-white font-medium">{user.username}</h4>
                    <p className={`text-sm ${rankConfig.color}`}>
                      {rankConfig.badge} {rankConfig.name}
                    </p>
                  </div>

                  {user.isOnline && (
                    <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-full">
                      ÇEVRİMİÇİ
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{user.totalActions}</p>
                    <p className="text-gray-400 text-sm">İşlem</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-400">{user.performance}%</p>
                    <p className="text-gray-400 text-sm">Başarı</p>
                  </div>

                  {index < 3 && getRankIcon(index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};