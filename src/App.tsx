import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { CodeVerification } from './components/Auth/CodeVerification';
import { BannedScreen } from './components/BannedScreen/BannedScreen';
import { PendingScreen } from './components/PendingScreen/PendingScreen';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardStats } from './components/Dashboard/DashboardStats';
import { AnnouncementBoard } from './components/Dashboard/AnnouncementBoard';
import { StaffList } from './components/Dashboard/StaffList';
import { SystemStatus } from './components/Dashboard/SystemStatus';
import { QuickActions } from './components/Dashboard/QuickActions';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { WeatherWidget } from './components/Dashboard/WeatherWidget';
import { ServerMap } from './components/Dashboard/ServerMap';
import { NotificationCenter } from './components/Notifications/NotificationCenter';
import { PunishmentCard } from './components/Punishments/PunishmentCard';
import { AddPunishmentForm } from './components/Punishments/AddPunishmentForm';
import { PunishmentFilters } from './components/Punishments/PunishmentFilters';
import { MessageSystem } from './components/Messages/MessageSystem';
import { AdminPanel } from './components/Admin/AdminPanel';
import { PerformanceBoard } from './components/Performance/PerformanceBoard';
import { EditableRulesPage } from './components/Rules/EditableRulesPage';
import { StaffDirectory } from './components/Staff/StaffDirectory';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { ReportsPage } from './components/Reports/ReportsPage';
import { NotebookPage } from './components/Notebook/NotebookPage';
import { storage } from './utils/storage';
import { PunishmentRecord, Comment } from './types';

const AppContent: React.FC = () => {
  const { user, login, register, verifyCode, isCodeVerified, updateUser } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState(() => storage.getUsers());
  const [punishments, setPunishments] = useState(() => storage.getPunishments());
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [punishmentFilters, setPunishmentFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    staff: 'all',
    dateRange: 'all'
  });

  // Initialize demo data if none exists
  React.useEffect(() => {
    if (users.length === 0) {
      const demoUsers = [
        {
          id: 'demo1',
          username: 'AdminUser',
          email: 'admin@consolecraft.com',
          rank: 'kurucu' as const,
          avatar: '👑',
          displayName: 'Admin User',
          isOnline: true,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          performance: 95,
          totalActions: 150,
          isAdmin: true,
          status: 'approved' as const,
          isBanned: false
        },
        {
          id: 'demo2',
          username: 'ModUser',
          email: 'mod@consolecraft.com',
          rank: 'moderator' as const,
          avatar: '🛡️',
          displayName: 'Mod User',
          isOnline: false,
          joinDate: new Date().toISOString(),
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          performance: 87,
          totalActions: 89,
          isAdmin: false,
          status: 'approved' as const,
          isBanned: false
        },
        {
          id: 'demo3',
          username: 'DevUser',
          email: 'dev@consolecraft.com',
          rank: 'gelistirici' as const,
          avatar: '💻',
          displayName: 'Dev User',
          isOnline: true,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          performance: 92,
          totalActions: 120,
          isAdmin: false,
          status: 'approved' as const,
          isBanned: false
        },
        {
          id: 'demo4',
          username: 'HelperUser',
          email: 'helper@consolecraft.com',
          rank: 'rehber' as const,
          avatar: '🌟',
          displayName: 'Helper User',
          isOnline: true,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          performance: 78,
          totalActions: 45,
          isAdmin: false,
          status: 'approved' as const,
          isBanned: false
        }
      ];
      storage.setUsers(demoUsers);
      setUsers(demoUsers);
    }
  }, [users.length]);

  const handleAddPunishment = (punishmentData: {
    type: 'mute' | 'ban' | 'kick' | 'website_ban';
    targetUsername: string;
    reason: string;
    duration?: number;
  }) => {
    if (!user) return;

    const newPunishment: PunishmentRecord = {
      id: Date.now().toString(),
      ...punishmentData,
      staffUsername: user.displayName || user.username,
      staffId: user.id,
      timestamp: new Date().toISOString(),
      isActive: true,
      likes: [],
      comments: []
    };

    const updatedPunishments = [newPunishment, ...punishments];
    setPunishments(updatedPunishments);
    storage.setPunishments(updatedPunishments);

    // Update user stats
    const updatedUser = {
      ...user,
      totalActions: user.totalActions + 1,
      performance: Math.min(100, user.performance + 1)
    };
    updateUser(updatedUser);

    // Update users list
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
  };

  const handleLikePunishment = (punishmentId: string) => {
    if (!user) return;

    const updatedPunishments = punishments.map(p => {
      if (p.id === punishmentId) {
        const likes = p.likes.includes(user.id)
          ? p.likes.filter(id => id !== user.id)
          : [...p.likes, user.id];
        return { ...p, likes };
      }
      return p;
    });

    setPunishments(updatedPunishments);
    storage.setPunishments(updatedPunishments);
  };

  const handleCommentPunishment = (punishmentId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.displayName || user.username,
      content,
      timestamp: new Date().toISOString()
    };

    const updatedPunishments = punishments.map(p => {
      if (p.id === punishmentId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    setPunishments(updatedPunishments);
    storage.setPunishments(updatedPunishments);
  };

  // Filter punishments based on filters
  const filteredPunishments = punishments.filter(punishment => {
    const matchesSearch = punishment.targetUsername.toLowerCase().includes(punishmentFilters.search.toLowerCase()) ||
                         punishment.reason.toLowerCase().includes(punishmentFilters.search.toLowerCase());
    
    const matchesType = punishmentFilters.type === 'all' || punishment.type === punishmentFilters.type;
    
    const matchesStatus = punishmentFilters.status === 'all' || 
                         (punishmentFilters.status === 'active' && punishment.isActive) ||
                         (punishmentFilters.status === 'inactive' && !punishment.isActive);
    
    const matchesStaff = punishmentFilters.staff === 'all' || punishment.staffId === punishmentFilters.staff;
    
    let matchesDate = true;
    if (punishmentFilters.dateRange !== 'all') {
      const punishmentDate = new Date(punishment.timestamp);
      const now = new Date();
      
      switch (punishmentFilters.dateRange) {
        case 'today':
          matchesDate = punishmentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = punishmentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = punishmentDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesStaff && matchesDate;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        {isLoginMode ? (
          <LoginForm
            onLogin={login}
            onToggleMode={() => setIsLoginMode(false)}
          />
        ) : (
          <RegisterForm
            onRegister={register}
            onToggleMode={() => setIsLoginMode(true)}
          />
        )}
      </div>
    );
  }

  if (!isCodeVerified) {
    return <CodeVerification onVerifyCode={verifyCode} />;
  }

  // Show banned screen if user is banned
  if (user.isBanned) {
    return (
      <BannedScreen 
        banReason={user.banReason}
        bannedBy={user.bannedBy}
        bannedAt={user.bannedAt}
      />
    );
  }

  // Show pending screen if user is pending
  if (user.status === 'pending') {
    return <PendingScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="animate-fade-in space-y-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    🏠 Ana Sayfa
                  </h1>
                  <p className="text-gray-400 text-xl">ConsoleCraft Yetkili Panel'e hoş geldin!</p>
                </div>
                <NotificationCenter />
              </div>
            </div>
            
            <AnnouncementBoard />
            <DashboardStats users={users} punishments={punishments} />
            <SystemStatus />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QuickActions />
              <RecentActivity />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></span>
                  ⚖️ Son Cezalar
                </h2>
                <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                  {punishments.slice(0, 5).map(punishment => (
                    <PunishmentCard
                      key={punishment.id}
                      punishment={punishment}
                      onLike={handleLikePunishment}
                      onComment={handleCommentPunishment}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></span>
                    🟢 Çevrimiçi Yetkililer
                  </h2>
                  <StaffList users={users.filter(u => u.isOnline)} compact={true} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WeatherWidget />
              <ServerMap />
            </div>
          </div>
        );
      
      case 'staff':
        return <StaffDirectory users={users} />;
      
      case 'punishments':
        return (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-2">
                  ⚖️ Cezalar
                </h1>
                <p className="text-gray-400 text-lg">Mute, ban ve kick işlemleri</p>
              </div>
              <AddPunishmentForm onAddPunishment={handleAddPunishment} />
            </div>
            
            <PunishmentFilters 
              filters={punishmentFilters}
              onFiltersChange={setPunishmentFilters}
              users={users}
            />
            
            <div className="space-y-6">
              {filteredPunishments.map(punishment => (
                <PunishmentCard
                  key={punishment.id}
                  punishment={punishment}
                  onLike={handleLikePunishment}
                  onComment={handleCommentPunishment}
                />
              ))}
              
              {filteredPunishments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">🔍 Filtrelere uygun ceza bulunamadı</div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'messages':
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                💬 Mesajlar
              </h1>
              <p className="text-gray-400 text-lg">Yetkililer arası mesajlaşma ve grup sohbeti</p>
            </div>
            <div className="h-[600px]">
              <MessageSystem />
            </div>
          </div>
        );
      
      case 'reports':
        return <ReportsPage />;
      
      case 'notebook':
        return <NotebookPage />;
      
      case 'performance':
        return <PerformanceBoard />;
      
      case 'rules':
        return <EditableRulesPage />;
      
      case 'admin':
        return <AdminPanel />;
      
      case 'settings':
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent mb-2">
                ⚙️ Ayarlar
              </h1>
              <p className="text-gray-400 text-lg">Profil ve sistem ayarları</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    👤
                  </div>
                  Profil Ayarları
                </h3>
                <p className="text-gray-400 mb-4">Profil resminizi ve görünen isminizi değiştirin</p>
                <button
                  onClick={() => setShowProfileSettings(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  🎨 Profili Düzenle
                </button>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    ⚙️
                  </div>
                  Sistem Bilgileri
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sürüm:</span>
                    <span className="text-white">v3.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Son Güncelleme:</span>
                    <span className="text-white">{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Durum:</span>
                    <span className="text-green-400">🟢 Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onProfileClick={() => setShowProfileSettings(true)}
      />
      <main className="lg:ml-72 p-4 lg:p-8">
        {renderContent()}
      </main>
      
      <ProfileSettings 
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;