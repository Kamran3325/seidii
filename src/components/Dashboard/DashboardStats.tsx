import React from 'react';
import { Users, Gavel, MessageSquare, TrendingUp } from 'lucide-react';
import { User, PunishmentRecord } from '../../types';

interface DashboardStatsProps {
  users: User[];
  punishments: PunishmentRecord[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ users, punishments }) => {
  const onlineCount = users.filter(u => u.isOnline).length;
  const activePunishments = punishments.filter(p => p.isActive).length;
  const todayPunishments = punishments.filter(p => {
    const today = new Date();
    const punishmentDate = new Date(p.timestamp);
    return punishmentDate.toDateString() === today.toDateString();
  }).length;

  const stats = [
    {
      label: 'Çevrimiçi Yetkililer',
      value: onlineCount,
      total: users.length,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/30'
    },
    {
      label: 'Aktif Cezalar',
      value: activePunishments,
      total: punishments.length,
      icon: Gavel,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/30'
    },
    {
      label: 'Bugünkü İşlemler',
      value: todayPunishments,
      total: null,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      label: 'Toplam Mesaj',
      value: 0, // Will be implemented with messaging system
      total: null,
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className={`p-6 rounded-xl border backdrop-blur-sm ${stat.bgColor} hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`h-8 w-8 ${stat.color}`} />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {stat.total && (
                  <p className="text-sm text-gray-400">/ {stat.total}</p>
                )}
              </div>
            </div>
            <p className="text-gray-300 font-medium">{stat.label}</p>
            {stat.total && (
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      stat.color.includes('green') ? 'from-green-500 to-emerald-500' :
                      stat.color.includes('red') ? 'from-red-500 to-rose-500' :
                      stat.color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                      'from-purple-500 to-pink-500'
                    }`}
                    style={{
                      width: `${(stat.value / stat.total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};