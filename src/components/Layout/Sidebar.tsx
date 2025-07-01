import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Gavel, 
  MessageSquare, 
  Settings, 
  Award,
  LogOut,
  Shield,
  BookOpen,
  UserCheck,
  User,
  FileText,
  NotebookPen,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRankConfig, canAccessAdminPanel, hasPermission } from '../../utils/ranks';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onProfileClick }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home, permission: 'view_announcements' },
    { id: 'staff', label: 'Yetkili Rehberi', icon: UserCheck, permission: 'view_announcements' },
    { id: 'punishments', label: 'Cezalar', icon: Gavel, permission: 'view_announcements' },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare, permission: 'read_messages' },
    { id: 'reports', label: 'Raporlar', icon: FileText, permission: 'view_announcements' },
    { id: 'notebook', label: 'Not Defteri', icon: NotebookPen, permission: 'view_announcements' },
    { id: 'performance', label: 'Performans', icon: Award, permission: 'view_announcements' },
    { id: 'rules', label: 'Kurallar', icon: BookOpen, permission: 'view_announcements' },
    { id: 'settings', label: 'Ayarlar', icon: Settings, permission: 'view_announcements' }
  ];

  // Add admin panel if user has access
  if (user && canAccessAdminPanel(user)) {
    menuItems.splice(-1, 0, { id: 'admin', label: 'Admin Panel', icon: Shield, permission: 'admin_panel' });
  }

  if (!user) return null;

  const rankConfig = getRankConfig(user.rank);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white shadow-lg hover:bg-gray-700/90 transition-all duration-200"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-40 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ConsoleCraft
              </h1>
              <p className="text-gray-400 text-sm">Yetkili Panel v3.0</p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group cursor-pointer"
               onClick={onProfileClick}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.textContent = '👤';
                      }}
                    />
                  ) : (
                    <span className="text-xl">{user.avatar || '👤'}</span>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${
                  user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors duration-200">
                  {user.displayName || user.username}
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${rankConfig.color} bg-opacity-10`}>
                  <span>{rankConfig.badge}</span>
                  <span className="truncate">{rankConfig.name}</span>
                </div>
              </div>
              <User className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            
            {user.status === 'approved' && (
              <div className="mt-3 pt-3 border-t border-gray-600/50">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Performans</span>
                  <span>{user.performance}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${user.performance}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Toplam İşlem</span>
                  <span className="text-blue-400 font-bold">{user.totalActions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const hasAccess = hasPermission(user.rank, item.permission);
              
              if (!hasAccess) return null;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-all duration-200 ${
                    isActive ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-105'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  {item.id === 'messages' && (
                    <div className="ml-auto">
                      <Bell className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group hover:scale-105"
            >
              <LogOut className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
              <span className="font-medium">🚪 Çıkış Yap</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 text-center">
              © 2024 ConsoleCraft
            </p>
            <p className="text-xs text-gray-500 text-center">
              Yetkili Panel v3.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};