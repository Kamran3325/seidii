import { UserRank, RankConfig } from '../types';

export const rankConfigs: Record<UserRank, RankConfig> = {
  beklemede: {
    name: 'Beklemede',
    color: 'text-gray-500 border-gray-500/30',
    level: 0,
    badge: '⏳',
    permissions: []
  },
  rehber: {
    name: 'Rehber',
    color: 'text-emerald-400 border-emerald-500/30',
    level: 1,
    badge: '🌟',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' }
    ]
  },
  asistan: {
    name: 'Asistan',
    color: 'text-cyan-400 border-cyan-500/30',
    level: 2,
    badge: '💎',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' },
      { id: 'kick_players', name: 'Kick Atma', description: 'Oyuncuları kickleyebilir' }
    ]
  },
  moderator: {
    name: 'Moderatör',
    color: 'text-blue-400 border-blue-500/30',
    level: 3,
    badge: '🛡️',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' },
      { id: 'kick_players', name: 'Kick Atma', description: 'Oyuncuları kickleyebilir' },
      { id: 'mute_players', name: 'Mute Atma', description: 'Oyuncuları muteleyebilir' },
      { id: 'ban_players', name: 'Ban Atma', description: 'Oyuncuları banlayabilir' }
    ]
  },
  admin: {
    name: 'Admin',
    color: 'text-red-400 border-red-500/30',
    level: 4,
    badge: '⚡',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' },
      { id: 'kick_players', name: 'Kick Atma', description: 'Oyuncuları kickleyebilir' },
      { id: 'mute_players', name: 'Mute Atma', description: 'Oyuncuları muteleyebilir' },
      { id: 'ban_players', name: 'Ban Atma', description: 'Oyuncuları banlayabilir' },
      { id: 'website_ban', name: 'Website Ban', description: 'Web sitesinden banlayabilir' },
      { id: 'manage_users', name: 'Kullanıcı Yönetimi', description: 'Kullanıcıları yönetebilir' },
      { id: 'create_announcements', name: 'Duyuru Oluşturma', description: 'Duyuru oluşturabilir' }
    ]
  },
  gelistirici: {
    name: 'Geliştirici',
    color: 'text-purple-400 border-purple-500/30',
    level: 5,
    badge: '💻',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' },
      { id: 'kick_players', name: 'Kick Atma', description: 'Oyuncuları kickleyebilir' },
      { id: 'mute_players', name: 'Mute Atma', description: 'Oyuncuları muteleyebilir' },
      { id: 'ban_players', name: 'Ban Atma', description: 'Oyuncuları banlayabilir' },
      { id: 'website_ban', name: 'Website Ban', description: 'Web sitesinden banlayabilir' },
      { id: 'manage_users', name: 'Kullanıcı Yönetimi', description: 'Kullanıcıları yönetebilir' },
      { id: 'create_announcements', name: 'Duyuru Oluşturma', description: 'Duyuru oluşturabilir' },
      { id: 'admin_panel', name: 'Admin Panel', description: 'Admin paneline erişebilir' },
      { id: 'edit_rules', name: 'Kural Düzenleme', description: 'Kuralları düzenleyebilir' }
    ]
  },
  kurucu: {
    name: 'Kurucu',
    color: 'text-yellow-400 border-yellow-500/30',
    level: 6,
    badge: '👑',
    permissions: [
      { id: 'read_messages', name: 'Mesaj Okuma', description: 'Mesajları okuyabilir' },
      { id: 'send_messages', name: 'Mesaj Gönderme', description: 'Mesaj gönderebilir' },
      { id: 'view_announcements', name: 'Duyuru Görme', description: 'Duyuruları görebilir' },
      { id: 'kick_players', name: 'Kick Atma', description: 'Oyuncuları kickleyebilir' },
      { id: 'mute_players', name: 'Mute Atma', description: 'Oyuncuları muteleyebilir' },
      { id: 'ban_players', name: 'Ban Atma', description: 'Oyuncuları banlayabilir' },
      { id: 'website_ban', name: 'Website Ban', description: 'Web sitesinden banlayabilir' },
      { id: 'manage_users', name: 'Kullanıcı Yönetimi', description: 'Kullanıcıları yönetebilir' },
      { id: 'create_announcements', name: 'Duyuru Oluşturma', description: 'Duyuru oluşturabilir' },
      { id: 'admin_panel', name: 'Admin Panel', description: 'Admin paneline erişebilir' },
      { id: 'approve_users', name: 'Kullanıcı Onaylama', description: 'Beklemedeki kullanıcıları onaylayabilir' },
      { id: 'manage_ranks', name: 'Rank Yönetimi', description: 'Kullanıcı ranklarını değiştirebilir' },
      { id: 'edit_rules', name: 'Kural Düzenleme', description: 'Kuralları düzenleyebilir' }
    ]
  }
};

export const getRankConfig = (rank: UserRank): RankConfig => {
  return rankConfigs[rank];
};

export const canManageUser = (managerRank: UserRank, targetRank: UserRank): boolean => {
  return rankConfigs[managerRank].level > rankConfigs[targetRank].level;
};

export const hasPermission = (userRank: UserRank, permissionId: string): boolean => {
  const rankConfig = getRankConfig(userRank);
  return rankConfig.permissions.some(p => p.id === permissionId);
};

export const canAccessAdminPanel = (user: any): boolean => {
  return user?.isAdmin || hasPermission(user?.rank, 'admin_panel');
};