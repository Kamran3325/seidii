import React, { useState } from 'react';
import { Zap, Users, Megaphone, Shield, AlertTriangle, Power, RefreshCw, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/ranks';

export const QuickActions: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (actionId: string, actionName: string) => {
    setIsLoading(actionId);
    
    // Simulate action
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`${actionName} işlemi tamamlandı!`);
    setIsLoading(null);
  };

  if (!user) return null;

  const actions = [
    {
      id: 'broadcast',
      name: 'Sunucu Duyurusu',
      icon: Megaphone,
      color: 'blue',
      permission: 'create_announcements',
      description: 'Tüm oyunculara duyuru gönder'
    },
    {
      id: 'kick_all',
      name: 'Tüm Oyuncuları At',
      icon: Users,
      color: 'orange',
      permission: 'kick_players',
      description: 'Acil durumlarda kullan'
    },
    {
      id: 'maintenance',
      name: 'Bakım Modu',
      icon: Settings,
      color: 'yellow',
      permission: 'admin_panel',
      description: 'Sunucuyu bakım moduna al'
    },
    {
      id: 'restart',
      name: 'Sunucu Yeniden Başlat',
      icon: RefreshCw,
      color: 'green',
      permission: 'admin_panel',
      description: 'Sunucuyu yeniden başlat'
    },
    {
      id: 'emergency',
      name: 'Acil Durum',
      icon: AlertTriangle,
      color: 'red',
      permission: 'admin_panel',
      description: 'Acil durum protokolü'
    },
    {
      id: 'whitelist',
      name: 'Whitelist Aç/Kapat',
      icon: Shield,
      color: 'purple',
      permission: 'admin_panel',
      description: 'Sunucu erişimini kısıtla'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20',
      orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20',
      green: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20',
      red: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Zap className="h-6 w-6 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">⚡ Hızlı İşlemler</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map(action => {
          const Icon = action.icon;
          const hasAccess = hasPermission(user.rank, action.permission);
          const loading = isLoading === action.id;

          if (!hasAccess) return null;

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id, action.name)}
              disabled={loading}
              className={`p-4 border rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getColorClasses(action.color)}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                <span className="font-medium">{action.name}</span>
              </div>
              <p className="text-gray-400 text-sm text-left">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};