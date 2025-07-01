import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Sistem Güncellemesi',
        message: 'Panel v3.1 güncellemesi mevcut',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Yüksek CPU Kullanımı',
        message: 'Sunucu CPU kullanımı %85 seviyesinde',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: '3',
        type: 'success',
        title: 'Backup Tamamlandı',
        message: 'Günlük yedekleme başarıyla tamamlandı',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-400" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-l-blue-500 bg-blue-500/5';
      case 'success': return 'border-l-green-500 bg-green-500/5';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'error': return 'border-l-red-500 bg-red-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 animate-scale-in">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">🔔 Bildirimler</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Tümünü Okundu İşaretle
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Henüz bildirim yok</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 mb-2 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'bg-opacity-20' : 'bg-opacity-5'
                      } hover:bg-opacity-30 transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(notification.timestamp).toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-400"
                              title="Okundu işaretle"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Kaldır"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};