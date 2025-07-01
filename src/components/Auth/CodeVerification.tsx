import React, { useState } from 'react';
import { Shield, AlertCircle, Lock } from 'lucide-react';

interface CodeVerificationProps {
  onVerifyCode: (code: string) => boolean;
}

export const CodeVerification: React.FC<CodeVerificationProps> = ({ onVerifyCode }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCodeType, setSelectedCodeType] = useState<'primary' | 'secondary'>('primary');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = onVerifyCode(code);
      if (!success) {
        setError('Geçersiz kod! Lütfen doğru kodu girin.');
        setCode('');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-6 animate-pulse">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">🔐 Güvenlik Kontrolü</h1>
          <p className="text-gray-400 text-lg">
            Devam etmek için güvenlik kodunu girin
          </p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Code Type Selection */}
          <div className="mb-6">
            <div className="flex bg-gray-700/30 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSelectedCodeType('primary')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-200 ${
                  selectedCodeType === 'primary'
                    ? 'bg-yellow-500 text-black font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Ana Kod</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCodeType('secondary')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-200 ${
                  selectedCodeType === 'secondary'
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Yedek Kod</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {selectedCodeType === 'primary' ? 'Ana Erişim Kodu' : 'Yedek Erişim Kodu'}
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white text-center text-lg font-mono tracking-wide transition-all duration-200"
                placeholder={selectedCodeType === 'primary' ? "Ana kodu girin..." : "Yedek kodu girin..."}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-shake">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Doğrulanıyor...
                </div>
              ) : (
                '🔓 Doğrula ve Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className={`p-4 rounded-xl border ${
              selectedCodeType === 'primary' 
                ? 'bg-yellow-500/10 border-yellow-500/30' 
                : 'bg-gray-700/30 border-gray-600/30'
            }`}>
              <p className="text-yellow-400 text-sm text-center font-medium">
                🔑 Ana Kod: Birincil güvenlik kodu
              </p>
            </div>
            
            <div className={`p-4 rounded-xl border ${
              selectedCodeType === 'secondary' 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-gray-700/30 border-gray-600/30'
            }`}>
              <p className="text-blue-400 text-sm text-center font-medium">
                🔐 Yedek Kod: İkincil güvenlik kodu
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm text-center">
              ⚠️ Bu kodlar sadece yetkili personele verilmiştir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};