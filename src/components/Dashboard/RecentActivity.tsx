import React, { useState, useEffect } from 'react';
import { Activity, User, Gavel, MessageSquare, Shield, Clock } from 'lucide-react';
import { storage } from '../../utils/storage';

interface ActivityItem {
  id: string;
  type: 'login' | 'punishment' | 'message' | 'admin_action';
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate some sample activities
    const sampleActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'login',
        user: 'AdminUser',
        action: 'Sisteme giriş yaptı',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'punishment',
        user: 'ModUser',
        action: 'TestPlayer kullanıcısını banladı',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        details: 'Sebep: Kural ihlali'
      },
      {
        id: '3',
        type: 'message',
        user: 'DevUser',
        action: 'Grup sohbetine mesaj gönderdi',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'admin_action',
        user: 'AdminUser',
        action: 'Sunucu ayarlarını güncelledi',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'login',
        user: 'HelperUser',
        action: 'Sisteme giriş yaptı',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];

    setActivities(sampleActivities);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <User className="h-4 w-4 text-green-400" />;
      case 'punishment': return <Gavel className="h-4 w-4 text-red-400" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'admin_action': return <Shield className="h-4 w-4 text-purple-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'border-l-green-500';
      case 'punishment': return 'border-l-red-500';
      case 'message': return 'border-l-blue-500';
      case 'admin_action': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Şu an';
    if (diffMins < 60) return `${diffMins}dk önce`;
    if (diffHours < 24) return `${diffHours}sa önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Activity className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">📊 Son Aktiviteler</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map(activity => (
          <div
            key={activity.id}
            className={`p-4 bg-gray-700/30 rounded-lg border-l-4 ${getActivityColor(activity.type)} hover:bg-gray-700/50 transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-gray-600/50 rounded">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-white font-medium">
                    <span className="text-blue-400">{activity.user}</span> {activity.action}
                  </p>
                  {activity.details && (
                    <p className="text-gray-400 text-sm mt-1">{activity.details}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="h-3 w-3" />
                <span>{formatTime(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};