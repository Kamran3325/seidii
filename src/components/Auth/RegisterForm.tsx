import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle, Camera } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string, avatar?: string, displayName?: string) => Promise<boolean>;
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const avatarOptions = ['👤', '😀', '😎', '🤖', '👑', '🔥', '⚡', '🎮', '🚀', '💎', '🦄', '🐉', '🎯', '⭐', '💀', '🎭'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onRegister(username, email, password, avatar, displayName || username);
      if (!success) {
        setError('Bu kullanıcı adı veya email zaten kullanılıyor!');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Kayıt Ol</h1>
        <p className="text-gray-400">ConsoleCraft Yetkili Paneline katıl</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profil Resmi
          </label>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-2xl">
              {avatar}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-8 gap-2">
                {avatarOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAvatar(option)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                      avatar === option
                        ? 'bg-blue-500 scale-110'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kullanıcı Adı
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="kullanici_adi"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Görünen İsim (Opsiyonel)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Görünen isminiz"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Şifre Tekrar
          </label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Zaten hesabın var mı?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
};