import { User, PunishmentRecord, Message, Announcement, Report, Note, Rule, Poll } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'minecraft_admin_current_user',
  USERS: 'minecraft_admin_users',
  PUNISHMENTS: 'minecraft_admin_punishments',
  MESSAGES: 'minecraft_admin_messages',
  GROUP_MESSAGES: 'minecraft_admin_group_messages',
  ANNOUNCEMENTS: 'minecraft_admin_announcements',
  REPORTS: 'minecraft_admin_reports',
  NOTES: 'minecraft_admin_notes',
  RULES: 'minecraft_admin_rules',
  POLLS: 'minecraft_admin_polls',
  IS_AUTHENTICATED: 'minecraft_admin_authenticated',
  CODE_VERIFIED: 'minecraft_admin_code_verified'
};

export const storage = {
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getPunishments: (): PunishmentRecord[] => {
    const punishments = localStorage.getItem(STORAGE_KEYS.PUNISHMENTS);
    return punishments ? JSON.parse(punishments) : [];
  },

  setPunishments: (punishments: PunishmentRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.PUNISHMENTS, JSON.stringify(punishments));
  },

  getMessages: (): Message[] => {
    const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return messages ? JSON.parse(messages) : [];
  },

  setMessages: (messages: Message[]) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  getGroupMessages: (): Message[] => {
    const messages = localStorage.getItem(STORAGE_KEYS.GROUP_MESSAGES);
    return messages ? JSON.parse(messages) : [];
  },

  setGroupMessages: (messages: Message[]) => {
    localStorage.setItem(STORAGE_KEYS.GROUP_MESSAGES, JSON.stringify(messages));
  },

  getAnnouncements: (): Announcement[] => {
    const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return announcements ? JSON.parse(announcements) : [];
  },

  setAnnouncements: (announcements: Announcement[]) => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  getReports: (): Report[] => {
    const reports = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return reports ? JSON.parse(reports) : [];
  },

  setReports: (reports: Report[]) => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  getNotes: (): Note[] => {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
  },

  setNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getRules: (): Rule[] => {
    const rules = localStorage.getItem(STORAGE_KEYS.RULES);
    return rules ? JSON.parse(rules) : [];
  },

  setRules: (rules: Rule[]) => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  },

  getPolls: (): Poll[] => {
    const polls = localStorage.getItem(STORAGE_KEYS.POLLS);
    return polls ? JSON.parse(polls) : [];
  },

  setPolls: (polls: Poll[]) => {
    localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify(polls));
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
  },

  setAuthenticated: (status: boolean) => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, status.toString());
  },

  isCodeVerified: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.CODE_VERIFIED) === 'true';
  },

  setCodeVerified: (status: boolean) => {
    localStorage.setItem(STORAGE_KEYS.CODE_VERIFIED, status.toString());
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};