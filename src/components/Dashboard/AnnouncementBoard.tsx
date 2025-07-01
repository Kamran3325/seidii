import React, { useState, useEffect } from 'react';
import { Megaphone, Clock, User } from 'lucide-react';
import { storage } from '../../utils/storage';
import { Announcement } from '../../types';

export const AnnouncementBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadAnnouncements = () => {
      setAnnouncements(storage.getAnnouncements());
    };

    loadAnnouncements();
    const interval = setInterval(loadAnnouncements, 5000);
    return () => clearInterval(interval);
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg animate-pulse">
            <Megaphone className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">📢 Duyurular</h2>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
          {announcements.slice(0, 3).map((announcement, index) => (
            <div
              key={announcement.id}
              className="p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:bg-gray-800/60 transition-all duration-300 animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-semibold text-lg">{announcement.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(announcement.timestamp).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-3 leading-relaxed">{announcement.content}</p>
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <User className="h-4 w-4" />
                <span>{announcement.authorName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};