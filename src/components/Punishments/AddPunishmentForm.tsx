import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/ranks';

interface AddPunishmentFormProps {
  onAddPunishment: (punishment: {
    type: 'mute' | 'ban' | 'kick' | 'website_ban';
    targetUsername: string;
    reason: string;
    duration?: number;
  }) => void;
}

export const AddPunishmentForm: React.FC<AddPunishmentFormProps> = ({ onAddPunishment }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'mute' | 'ban' | 'kick' | 'website_ban'>('mute');
  const [targetUsername, setTargetUsername] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [durationType, setDurationType] = useState<'minutes' | 'hours' | 'days'>('minutes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check permissions
    if (!user) return;
    
    const requiredPermission = type === 'kick' ? 'kick_players' : 
                              type === 'mute' ? 'mute_players' : 
                              type === 'ban' ? 'ban_players' :
                              type === 'website_ban' ? 'website_ban' : '';
    
    if (!hasPermission(user.rank, requiredPermission)) {
      alert(`${type.toUpperCase()} atma yetkiniz yok!`);
      return;
    }
    
    let durationInMinutes: number | undefined;
    if (duration && type !== 'kick') {
      const num = parseInt(duration);
      switch (durationType) {
        case 'minutes':
          durationInMinutes = num;
          break;
        case 'hours':
          durationInMinutes = num * 60;
          break;
        case 'days':
          durationInMinutes = num * 60 * 24;
          break;
      }
    }

    onAddPunishment({
      type,
      targetUsername,
      reason,
      duration: durationInMinutes
    });

    // Reset form
    setTargetUsername('');
    setReason('');
    setDuration('');
    setIsOpen(false);
  };

  if (!user) return null;

  // Check if user has any punishment permissions
  const canPunish = hasPermission(user.rank, 'kick_players') || 
                   hasPermission(user.rank, 'mute_players') || 
                   hasPermission(user.rank, 'ban_players') ||
                   hasPermission(user.rank, 'website_ban');

  if (!canPunish) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="h-4 w-4" />
        🔨 Ceza Ekle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">⚖️ Yeni Ceza Ekle</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ceza Türü
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {hasPermission(user.rank, 'mute_players') && <option value="mute">🔇 Mute</option>}
                  {hasPermission(user.rank, 'ban_players') && <option value="ban">🔨 Ban</option>}
                  {hasPermission(user.rank, 'kick_players') && <option value="kick">👢 Kick</option>}
                  {hasPermission(user.rank, 'website_ban') && <option value="website_ban">🚫 Website Ban</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hedef Kullanıcı
                </label>
                <input
                  type="text"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı adını girin..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sebep
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ceza sebebini yazın..."
                  required
                />
              </div>

              {type !== 'kick' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Süre (Opsiyonel)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Süre..."
                      min="1"
                    />
                    <select
                      value={durationType}
                      onChange={(e) => setDurationType(e.target.value as any)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="minutes">Dakika</option>
                      <option value="hours">Saat</option>
                      <option value="days">Gün</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200"
                >
                  ⚖️ Ceza Ver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};