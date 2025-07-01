import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Search, Filter, AlertTriangle, CheckCircle, Clock, User, Calendar, Flag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { Report } from '../../types';
import { hasPermission } from '../../utils/ranks';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newReport, setNewReport] = useState({
    type: 'player_complaint' as const,
    title: '',
    description: '',
    reportedUser: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    setReports(storage.getReports());
  }, []);

  const handleCreateReport = () => {
    if (!user || !newReport.title.trim() || !newReport.description.trim()) return;

    const report: Report = {
      id: Date.now().toString(),
      type: newReport.type,
      title: newReport.title.trim(),
      description: newReport.description.trim(),
      reportedBy: user.displayName || user.username,
      reportedUser: newReport.reportedUser.trim() || undefined,
      timestamp: new Date().toISOString(),
      status: 'pending',
      priority: newReport.priority
    };

    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    storage.setReports(updatedReports);
    
    setNewReport({
      type: 'player_complaint',
      title: '',
      description: '',
      reportedUser: '',
      priority: 'medium'
    });
    setShowReportForm(false);
  };

  const updateReportStatus = (reportId: string, status: Report['status'], response?: string) => {
    if (!user || !hasPermission(user.rank, 'manage_users')) return;

    const updatedReports = reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status, 
            assignedTo: user.displayName || user.username,
            response: response || report.response
          }
        : report
    );

    setReports(updatedReports);
    storage.setReports(updatedReports);
    setSelectedReport(null);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player_complaint': return '👤';
      case 'bug_report': return '🐛';
      case 'suggestion': return '💡';
      case 'staff_complaint': return '🛡️';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'player_complaint': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'bug_report': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'suggestion': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'staff_complaint': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'investigating': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'resolved': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'rejected': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">📋 Raporlar</h2>
              <p className="text-gray-400 text-lg">Şikayetler, bug raporları ve öneriler</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            📝 Rapor Oluştur
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rapor ara..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Türler</option>
            <option value="player_complaint">👤 Oyuncu Şikayeti</option>
            <option value="bug_report">🐛 Bug Raporu</option>
            <option value="suggestion">💡 Öneri</option>
            <option value="staff_complaint">🛡️ Yetkili Şikayeti</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">⏳ Beklemede</option>
            <option value="investigating">🔍 İnceleniyor</option>
            <option value="resolved">✅ Çözüldü</option>
            <option value="rejected">❌ Reddedildi</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getTypeColor(report.type)}`}>
                  <span className="text-lg">{getTypeIcon(report.type)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {report.reportedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(report.timestamp).toLocaleDateString('tr-TR')}
                    </span>
                    <span className={`flex items-center gap-1 ${getPriorityColor(report.priority)}`}>
                      <Flag className="h-4 w-4" />
                      {report.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                  {report.status === 'pending' && '⏳ Beklemede'}
                  {report.status === 'investigating' && '🔍 İnceleniyor'}
                  {report.status === 'resolved' && '✅ Çözüldü'}
                  {report.status === 'rejected' && '❌ Reddedildi'}
                </span>
                
                {hasPermission(user.rank, 'manage_users') && (
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                  >
                    🔧 Yönet
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-gray-300 mb-3">{report.description}</p>
            
            {report.reportedUser && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <span className="text-red-400 font-medium">🎯 Şikayet Edilen: {report.reportedUser}</span>
              </div>
            )}
            
            {report.response && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium mb-1">📝 Yetkili Yanıtı:</p>
                <p className="text-gray-300">{report.response}</p>
                {report.assignedTo && (
                  <p className="text-sm text-gray-400 mt-2">👤 Yanıtlayan: {report.assignedTo}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Rapor Bulunamadı</h3>
            <p className="text-gray-500">Filtrelere uygun rapor bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Create Report Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">📝 Yeni Rapor</h3>
              <button
                onClick={() => setShowReportForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rapor Türü</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="player_complaint">👤 Oyuncu Şikayeti</option>
                  <option value="bug_report">🐛 Bug Raporu</option>
                  <option value="suggestion">💡 Öneri</option>
                  <option value="staff_complaint">🛡️ Yetkili Şikayeti</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Rapor başlığı..."
                />
              </div>

              {(newReport.type === 'player_complaint' || newReport.type === 'staff_complaint') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {newReport.type === 'player_complaint' ? 'Şikayet Edilen Oyuncu' : 'Şikayet Edilen Yetkili'}
                  </label>
                  <input
                    type="text"
                    value={newReport.reportedUser}
                    onChange={(e) => setNewReport({ ...newReport, reportedUser: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Kullanıcı adı..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Öncelik</label>
                <select
                  value={newReport.priority}
                  onChange={(e) => setNewReport({ ...newReport, priority: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="low">🟢 Düşük</option>
                  <option value="medium">🟡 Orta</option>
                  <option value="high">🟠 Yüksek</option>
                  <option value="urgent">🔴 Acil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  rows={4}
                  placeholder="Detaylı açıklama..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateReport}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  📝 Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Report Modal */}
      {selectedReport && hasPermission(user.rank, 'manage_users') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">🔧 Rapor Yönetimi</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedReport.title}</h4>
                <p className="text-gray-300 text-sm">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'investigating')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg"
                >
                  🔍 İncele
                </button>
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                  className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg"
                >
                  ✅ Çöz
                </button>
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'rejected')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                >
                  ❌ Reddet
                </button>
                <button
                  onClick={() => updateReportStatus(selectedReport.id, 'pending')}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg"
                >
                  ⏳ Beklet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};