export interface User {
  id: string;
  username: string;
  email: string;
  rank: UserRank;
  avatar?: string;
  displayName?: string;
  isOnline: boolean;
  joinDate: string;
  lastActive: string;
  performance: number;
  totalActions: number;
  isAdmin: boolean;
  status: UserStatus;
  approvedBy?: string;
  approvedAt?: string;
  isBanned: boolean;
  banReason?: string;
  bannedBy?: string;
  bannedAt?: string;
}

export interface PunishmentRecord {
  id: string;
  type: 'mute' | 'ban' | 'kick' | 'website_ban';
  targetUsername: string;
  staffUsername: string;
  staffId: string;
  reason: string;
  duration?: number; // minutes
  timestamp: string;
  isActive: boolean;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string; // 'group' for group messages
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio';
  url: string;
  name: string;
  size: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: string;
  isImportant: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface Report {
  id: string;
  type: 'player_complaint' | 'bug_report' | 'suggestion' | 'staff_complaint';
  title: string;
  description: string;
  reportedBy: string;
  reportedUser?: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  assignedTo?: string;
  response?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface Rule {
  id: string;
  category: string;
  title: string;
  description: string;
  rules: string[];
  color: string;
  icon: string;
  order: number;
}

export type UserRank = 'beklemede' | 'rehber' | 'asistan' | 'moderator' | 'admin' | 'gelistirici' | 'kurucu';

export type UserStatus = 'pending' | 'approved' | 'banned';

export interface RankConfig {
  name: string;
  color: string;
  level: number;
  badge: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}