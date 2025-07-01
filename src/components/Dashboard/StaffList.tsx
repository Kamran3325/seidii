import React from 'react';
import { Clock, Activity, MessageCircle } from 'lucide-react';
import { User } from '../../types';
import { getRankConfig } from '../../utils/ranks';

interface StaffListProps {
  users: User[];
  compact?: boolean;
}

export const StaffList: React.FC<StaffListProps> = ({ users, compact = false }) => {
  const onlineStaff = users.filter(user => user.isOnline);
  const offlineStaff = users.filter(user => !user.isOnline);

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Şu an';
    if (diffMins < 60) return `${diffMins}dk önce`;
    if (diffHours < 24) return `${diffHours}sa önce`;
    return `${diffDays}g önce`;
  };

  const StaffCard: React.FC<{ user: User }> = ({ user }) => {
    const rankConfig = getRankConfig(user.rank);
    
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-200 group hover:scale-105">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-lg">{user.avatar || '👤'}</span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
            </div>
            <div>
              <h3 className="text-white font-medium group-hover:text-green-400 transition-colors duration-200">
                {user.username}
              </h3>
              <p className={`text-sm ${rankConfig.color} flex items-center gap-1`}>
                <span>{rankConfig.badge}</span>
                <span>{rankConfig.name}</span>
              </p>
            </div>
          </div>
          
          {!compact && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                <Activity className="h-4 w-4" />
                <span>{user.totalActions}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatLastActive(user.lastActive)}</span>
              </div>
            </div>
          )}

          {compact && (
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-blue-500/20 rounded-lg">
              <MessageCircle className="h-4 w-4 text-blue-400" />
            </button>
          )}
        </div>

        {compact && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Performans</span>
              <span>{user.performance}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${user.performance}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {onlineStaff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            Çevrimiçi ({onlineStaff.length})
          </h3>
          <div className="grid gap-3">
            {onlineStaff.map(user => (
              <StaffCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {!compact && offlineStaff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            Çevrimdışı ({offlineStaff.length})
          </h3>
          <div className="grid gap-3">
            {offlineStaff.map(user => (
              <StaffCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};