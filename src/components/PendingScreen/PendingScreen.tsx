import React from 'react';
import { Clock, UserCheck, Shield, Star, CheckCircle, AlertTriangle } from 'lucide-react';

export const PendingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-yellow-400 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-orange-600 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Pending Icon */}
        <div className="mb-8 relative">
          <div className="w-40 h-40 mx-auto bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Clock className="h-20 w-20 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <UserCheck className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Pending Message */}
        <div className="bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-500 rounded-2xl p-8 mb-8 shadow-2xl animate-scale-in">
          <h1 className="text-7xl font-black text-yellow-400 mb-6 animate-pulse">
            ⏳ ONAY BEKLENİYOR
          </h1>
          <h2 className="text-4xl font-bold text-white mb-8">
            Başvurunuz İnceleme Aşamasında
          </h2>
          
          <div className="bg-black/30 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-semibold text-yellow-400">Durum Bilgisi</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3 p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-center">Başvurunuz alındı ve inceleniyor</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-6 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-center">Yöneticilerimiz en kısa sürede değerlendirecek</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-6 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-center">Onaylandığında otomatik olarak bilgilendirileceksiniz</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              ℹ️ Önemli Bilgilendirme
            </h3>
            <p className="text-gray-200 text-xl leading-relaxed">
              Hesabınız şu anda onay bekliyor. Bu süreç genellikle <span className="text-yellow-400 font-bold">24 saat</span> içinde tamamlanır.
              Lütfen sabırlı olun ve daha sonra tekrar giriş yapmayı deneyin.
            </p>
          </div>
        </div>

        {/* Progress Animation */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-8 mb-8">
          <h4 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            📊 İnceleme Süreci
          </h4>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300 text-lg">İlerleme</span>
            <span className="text-yellow-400 font-bold text-xl">%75</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full animate-pulse shadow-lg" style={{width: '75%'}}></div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-sm text-gray-400">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span>Başvuru Alındı</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span>Ön İnceleme</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1 animate-pulse"></div>
              <span>Detay İnceleme</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1"></div>
              <span>Onay</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-8">
          <h4 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-blue-400" />
            📞 Destek & İletişim
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-gray-300 text-lg">
                Discord Sunucumuz: <br />
                <span className="text-blue-400 font-bold text-xl">discord.gg/consolecraft</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-300 text-lg">
                Website: <br />
                <span className="text-green-400 font-bold text-xl">consolecraft.com</span>
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center">
            ConsoleCraft Yönetimi • 2024
          </p>
        </div>
      </div>
    </div>
  );
};