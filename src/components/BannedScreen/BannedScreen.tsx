import React from 'react';
import { Ban, Shield, AlertTriangle, Clock, User } from 'lucide-react';

interface BannedScreenProps {
  banReason?: string;
  bannedBy?: string;
  bannedAt?: string;
}

export const BannedScreen: React.FC<BannedScreenProps> = ({ 
  banReason = 'Kural ihlali', 
  bannedBy = 'Sistem',
  bannedAt 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-600 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-red-400 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-red-700 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Ban Icon */}
        <div className="mb-8 relative">
          <div className="w-40 h-40 mx-auto bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Ban className="h-20 w-20 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <AlertTriangle className="h-10 w-10 text-black" />
          </div>
        </div>

        {/* Ban Message */}
        <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-500 rounded-2xl p-8 mb-8 shadow-2xl animate-scale-in">
          <h1 className="text-7xl font-black text-red-400 mb-6 animate-pulse">
            🚫 YASAKLANDINIZ!
          </h1>
          <h2 className="text-4xl font-bold text-white mb-8">
            Hesabınız Kalıcı Olarak Yasaklandı
          </h2>
          
          <div className="bg-black/30 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-red-400" />
              <span className="text-2xl font-semibold text-red-400">Yasaklama Detayları</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300 font-medium">Sebep</span>
                </div>
                <p className="text-red-400 font-bold text-lg">{banReason}</p>
              </div>
              
              <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <User className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300 font-medium">Yasaklayan</span>
                </div>
                <p className="text-red-400 font-bold text-lg">{bannedBy}</p>
              </div>
              
              {bannedAt && (
                <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300 font-medium">Tarih</span>
                  </div>
                  <p className="text-red-400 font-bold text-lg">
                    {new Date(bannedAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              ⚠️ Önemli Bilgi
            </h3>
            <p className="text-gray-200 text-xl leading-relaxed">
              Bu yasaklama <span className="text-red-400 font-bold">kalıcıdır</span> ve kaldırılmayacaktır. 
              Sunucumuza tekrar erişim sağlayamazsınız.
              Eğer bu yasaklamanın haksız olduğunu düşünüyorsanız, Discord sunucumuzdan itiraz edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Ban Types Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-8 mb-8">
          <h4 className="text-2xl font-semibold text-white mb-6">🔨 Yasaklama Türleri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h5 className="text-red-400 font-bold mb-2">🎮 Oyun Banı</h5>
              <p className="text-gray-300 text-sm">Minecraft sunucusundan yasaklama</p>
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <h5 className="text-orange-400 font-bold mb-2">🌐 Website Banı</h5>
              <p className="text-gray-300 text-sm">Web sitesi ve panelden yasaklama</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h5 className="text-purple-400 font-bold mb-2">💬 Discord Banı</h5>
              <p className="text-gray-300 text-sm">Discord sunucusundan yasaklama</p>
            </div>
            <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
              <h5 className="text-red-500 font-bold mb-2">🚫 Tam Ban</h5>
              <p className="text-gray-300 text-sm">Tüm platformlardan yasaklama</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-8">
          <h4 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-400" />
            📞 İtiraz & İletişim
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-gray-300 text-lg">
                İtiraz için Discord: <br />
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
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ İtiraz başvurunuz 7-14 iş günü içinde değerlendirilecektir.
            </p>
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center">
            ConsoleCraft Yönetimi • 2024
          </p>
        </div>
      </div>
    </div>
  );
};