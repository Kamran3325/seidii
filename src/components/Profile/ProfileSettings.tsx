import React, { useState } from 'react';
import { User, Camera, Save, X, Upload, Image } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👤');
  const [customAvatar, setCustomAvatar] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const avatarOptions = [
    '👤', '😀', '😎', '🤖', '👑', '🔥', '⚡', '🎮', '🚀', '💎', 
    '🦄', '🐉', '🎯', '⭐', '💀', '🎭', '🎨', '🎪', '🎸', '🎲',
    '🌟', '🌈', '🌙', '☀️', '🌊', '🌸', '🍀', '🎃', '❄️', '🔮',
    '🎵', '🎬', '🎨', '🏆', '💰', '🔑', '🎪', '🎭', '🎨', '🎯',
    '🛡️', '⚔️', '🏹', '🔫', '💣', '🧨', '🔪', '🗡️', '🛠️', '⚙️',
    '🎲', '🃏', '🎰', '🎯', '🎪', '🎭', '🎨', '🎬', '🎵', '🎸'
  ];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImageUrl(result);
          setCustomAvatar('');
          setAvatar('👤');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (!user) return;

    let finalAvatar = avatar;
    
    // Custom emoji has priority
    if (customAvatar.trim()) {
      finalAvatar = customAvatar.trim();
    }
    // Then image URL
    else if (imageUrl.trim()) {
      finalAvatar = imageUrl.trim();
    }
    
    const updatedUser = {
      ...user,
      displayName: displayName.trim() || user.username,
      avatar: finalAvatar
    };

    updateUser(updatedUser);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="h-7 w-7" />
              🎨 Profil Ayarları
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar Preview */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-4xl shadow-2xl mb-4 overflow-hidden border-4 border-gray-600">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={() => setImageUrl('')}
                />
              ) : (
                <span>{customAvatar || avatar}</span>
              )}
            </div>
            <p className="text-gray-400 text-sm">Profil Resmi Önizleme</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              📷 Fotoğraf Yükle
            </label>
            <button
              onClick={handleImageUpload}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30 hover:scale-105"
            >
              <Image className="h-5 w-5" />
              📁 Galeriden Seç
            </button>
            {imageUrl && (
              <button
                onClick={() => setImageUrl('')}
                className="w-full mt-2 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200"
              >
                <X className="h-4 w-4 inline mr-2" />
                Fotoğrafı Kaldır
              </button>
            )}
          </div>

          {/* Custom Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔗 Resim URL'si
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setCustomAvatar('');
                  setAvatar('👤');
                }}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/resim.jpg"
              />
              {imageUrl && (
                <button
                  onClick={() => setImageUrl('')}
                  className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Custom Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              😀 Özel Emoji
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAvatar}
                onChange={(e) => {
                  setCustomAvatar(e.target.value);
                  setImageUrl('');
                }}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="🎮 veya herhangi bir emoji..."
                maxLength={4}
              />
              {customAvatar && (
                <button
                  onClick={() => setCustomAvatar('')}
                  className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Preset Avatars */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              🎭 Hazır Emojiler
            </label>
            <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-3 bg-gray-700/20 rounded-lg border border-gray-600/30">
              {avatarOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setAvatar(option);
                    setCustomAvatar('');
                    setImageUrl('');
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 ${
                    avatar === option && !customAvatar && !imageUrl
                      ? 'bg-blue-500 scale-110 shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📝 Görünen İsim
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Görünen isminiz"
              maxLength={30}
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu isim diğer kullanıcılara görünecek
            </p>
          </div>

          {/* User Info */}
          <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
            <h4 className="text-white font-medium mb-3">📊 Hesap Bilgileri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Kullanıcı Adı:</span>
                <p className="text-white font-medium">{user.username}</p>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Katılım Tarihi:</span>
                <p className="text-white font-medium">{new Date(user.joinDate).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <span className="text-gray-400">Durum:</span>
                <p className={`font-medium ${user.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {user.status === 'approved' ? '✅ Onaylandı' : '⏳ Beklemede'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Performans:</span>
                <p className="text-blue-400 font-medium">{user.performance}%</p>
              </div>
              <div>
                <span className="text-gray-400">Toplam İşlem:</span>
                <p className="text-purple-400 font-medium">{user.totalActions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              ❌ İptal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-medium"
            >
              <Save className="h-4 w-4" />
              💾 Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};