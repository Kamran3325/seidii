import React from 'react';
import { Search, Filter, Calendar, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface PunishmentFiltersProps {
  filters: {
    search: string;
    type: string;
    status: string;
    staff: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
  users: UserType[];
}

export const PunishmentFilters: React.FC<PunishmentFiltersProps> = ({
  filters,
  onFiltersChange,
  users
}) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">🔍 Filtreleme</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Kullanıcı adı veya sebep ara..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Türler</option>
          <option value="mute">🔇 Mute</option>
          <option value="ban">🔨 Ban</option>
          <option value="kick">👢 Kick</option>
          <option value="website_ban">🚫 Website Ban</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="active">✅ Aktif</option>
          <option value="inactive">❌ Pasif</option>
        </select>

        {/* Staff Filter */}
        <select
          value={filters.staff}
          onChange={(e) => updateFilter('staff', e.target.value)}
          className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Yetkililer</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.avatar} {user.displayName || user.username}
            </option>
          ))}
        </select>

        {/* Date Range Filter */}
        <select
          value={filters.dateRange}
          onChange={(e) => updateFilter('dateRange', e.target.value)}
          className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Zamanlar</option>
          <option value="today">📅 Bugün</option>
          <option value="week">📅 Bu Hafta</option>
          <option value="month">📅 Bu Ay</option>
        </select>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.staff !== 'all' || filters.dateRange !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Aktif filtreler:</span>
            
            {filters.search && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
                🔍 "{filters.search}"
              </span>
            )}
            
            {filters.type !== 'all' && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                📝 {filters.type.toUpperCase()}
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                📊 {filters.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
            )}
            
            {filters.staff !== 'all' && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/30">
                👤 {users.find(u => u.id === filters.staff)?.displayName || 'Yetkili'}
              </span>
            )}
            
            {filters.dateRange !== 'all' && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs border border-orange-500/30">
                📅 {filters.dateRange === 'today' ? 'Bugün' : filters.dateRange === 'week' ? 'Bu Hafta' : 'Bu Ay'}
              </span>
            )}
            
            <button
              onClick={() => onFiltersChange({
                search: '',
                type: 'all',
                status: 'all',
                staff: 'all',
                dateRange: 'all'
              })}
              className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full text-xs border border-red-500/30 transition-all duration-200"
            >
              ❌ Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};