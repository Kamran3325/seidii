import React, { useState } from 'react';
import { BookOpen, Shield, AlertTriangle, Users, MessageSquare, Gavel, CheckCircle, Swords } from 'lucide-react';

export const RulesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const rules = {
    general: {
      title: 'Genel Kurallar',
      icon: BookOpen,
      color: 'blue',
      rules: [
        'Sunucuda saygılı ve nazik davranın',
        'Küfür, hakaret ve argo kelimeler kullanmayın',
        'Spam yapmayın ve flood atmayın',
        'Reklam yapmak kesinlikle yasaktır',
        'Oyun içi ekonomiyi bozmaya çalışmayın',
        'Hile, bug abuse ve exploit kullanmayın',
        'Diğer oyuncuları rahatsız etmeyin',
        'Sunucu kurallarına uyun ve yetkililerle işbirliği yapın'
      ]
    },
    staff: {
      title: 'Yetkili Kuralları',
      icon: Shield,
      color: 'green',
      rules: [
        'Yetkilerinizi kötüye kullanmayın',
        'Adil ve objektif davranın',
        'Kişisel çıkarlarınız için yetki kullanmayın',
        'Diğer yetkililerle saygılı iletişim kurun',
        'Ceza verirken sebep belirtin',
        'Büyük kararları üst yetkililerle görüşün',
        'Aktif olmaya çalışın ve sorumluluklarınızı yerine getirin',
        'Sunucu sırlarını paylaşmayın',
        'Oyuncularla profesyonel mesafenizi koruyun',
        'Yetki kademesine saygı gösterin'
      ]
    },
    punishments: {
      title: 'Ceza Sistemi',
      icon: Gavel,
      color: 'red',
      rules: [
        'Warn: Uyarı - Kural ihlali durumunda',
        'Mute: Susturma - Chat kurallarını ihlal edenlere',
        'Kick: Atma - Orta seviye kural ihlalleri için',
        'Temp Ban: Geçici yasaklama - Ciddi ihlaller için',
        'Perm Ban: Kalıcı yasaklama - Çok ciddi ihlaller için',
        'IP Ban: IP yasaklama - Sürekli kural ihlali yapanlara',
        'Cezalar kademeli olarak artırılır',
        'İtiraz hakkı her oyuncuda mevcuttur'
      ]
    },
    chat: {
      title: 'Chat Kuralları',
      icon: MessageSquare,
      color: 'purple',
      rules: [
        'Büyük harfle yazmayın (CAPS LOCK)',
        'Aynı mesajı tekrar tekrar atmayın',
        'Kişisel bilgilerinizi paylaşmayın',
        'Link paylaşımı yapmayın',
        'Politik ve dini konularda tartışma yapmayın',
        'Diğer oyuncuları taciz etmeyin',
        'Uygunsuz içerik paylaşmayın',
        'Türkçe dışında dil kullanmayın'
      ]
    },
    pvp: {
      title: 'PvP Kuralları',
      icon: Swords,
      color: 'red',
      rules: [
        'PvP alanlarında fair play kurallarına uyun',
        'Hack, cheat ve illegal modlar kullanmayın',
        'Kill aura, fly hack gibi hileleri kullanmayın',
        'X-Ray texture pack veya mod kullanmayın',
        'Auto-clicker ve makro kullanımı yasaktır',
        'Spawn killing yapmayın',
        'Team killing (takım arkadaşını öldürme) yasaktır',
        'PvP sırasında toxic davranış sergilemeyin',
        'Kaybettiğinizde saygılı davranın',
        'Kazandığınızda kibirli olmayın'
      ]
    },
    building: {
      title: 'Yapı Kuralları',
      icon: Users,
      color: 'yellow',
      rules: [
        'Başkalarının arazisine izinsiz yapı yapmayın',
        'Griefing (yapı bozma) yapmayın',
        'Uygunsuz yapılar inşa etmeyin',
        'Çok büyük ve gereksiz yapılar yapmayın',
        'Redstone makineleri lag yaratmamalı',
        'Ortak alanlara saygı gösterin',
        'Doğal manzarayı bozmayın',
        'Yapılarınızı tamamlamaya çalışın'
      ]
    }
  };

  const getSectionColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
      green: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-400',
      red: 'from-red-500/10 to-red-600/10 border-red-500/30 text-red-400',
      purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-400',
      yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      red: 'text-red-400',
      purple: 'text-purple-400',
      yellow: 'text-yellow-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-orange-400" />
          <h2 className="text-3xl font-bold text-white">Sunucu Kuralları</h2>
        </div>
        <p className="text-gray-400 text-lg">
          ConsoleCraft sunucusunda uyulması gereken tüm kurallar ve yönetmelikler
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rule Categories */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sticky top-4">
            <h3 className="text-lg font-semibold text-white mb-4">Kategoriler</h3>
            <div className="space-y-2">
              {Object.entries(rules).map(([key, section]) => {
                const Icon = section.icon;
                const isActive = activeSection === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${getSectionColor(section.color)} border`
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? getIconColor(section.color) : ''}`} />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rule Content */}
        <div className="lg:col-span-3">
          {Object.entries(rules).map(([key, section]) => {
            if (activeSection !== key) return null;
            
            const Icon = section.icon;
            
            return (
              <div key={key} className="space-y-6">
                <div className={`bg-gradient-to-r ${getSectionColor(section.color)} border rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`h-8 w-8 ${getIconColor(section.color)}`} />
                    <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                  </div>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <div className="space-y-4">
                    {section.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-r ${getSectionColor(section.color)} border flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 group-hover:text-white transition-colors duration-200">
                            {rule}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-yellow-400">Önemli Bilgi</h4>
                  </div>
                  <p className="text-gray-300">
                    {key === 'general' && 'Bu kurallar tüm oyuncular için geçerlidir. Kural ihlali durumunda ceza alabilirsiniz.'}
                    {key === 'staff' && 'Yetkili olarak bu kurallara uymanız zorunludur. İhlal durumunda yetkiniz alınabilir.'}
                    {key === 'punishments' && 'Ceza sistemi adil ve şeffaf şekilde işletilir. İtirazlarınızı yetkililere iletebilirsiniz.'}
                    {key === 'chat' && 'Chat kuralları tüm sohbet kanalları için geçerlidir. Uygun olmayan davranışlar cezalandırılır.'}
                    {key === 'pvp' && 'PvP kuralları adil oyun ortamını sağlamak için konulmuştur. Hile kullanımı kesinlikle yasaktır.'}
                    {key === 'building' && 'Yapı kuralları sunucunun düzenini korumak için konulmuştur. Yaratıcılığınızı bu sınırlar içinde gösterin.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};