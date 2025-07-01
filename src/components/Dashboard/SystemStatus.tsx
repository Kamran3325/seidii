import React, { useState, useEffect } from 'react';
import { Activity, Server, Users, Zap, Wifi, HardDrive, Cpu, MemoryStick, Globe, Shield } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    serverUptime: '7d 12h 34m',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
    networkStatus: 'stable',
    playersOnline: 127,
    maxPlayers: 200,
    tps: 19.8,
    ping: 23
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        tps: Math.max(18, Math.min(20, prev.tps + (Math.random() - 0.5) * 0.5)),
        ping: Math.max(15, Math.min(50, prev.ping + (Math.random() - 0.5) * 10))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'from-green-500 to-green-600';
    if (value <= thresholds.warning) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Server className="h-6 w-6 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">🖥️ Sistem Durumu</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Çevrimiçi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CPU Usage */}
        <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">CPU</span>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(systemStats.cpuUsage, { good: 50, warning: 75 })}`}>
              {systemStats.cpuUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(systemStats.cpuUsage, { good: 50, warning: 75 })} transition-all duration-500`}
              style={{ width: `${systemStats.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">RAM</span>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(systemStats.memoryUsage, { good: 60, warning: 80 })}`}>
              {systemStats.memoryUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(systemStats.memoryUsage, { good: 60, warning: 80 })} transition-all duration-500`}
              style={{ width: `${systemStats.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Disk Usage */}
        <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-orange-400" />
              <span className="text-gray-300 text-sm">Disk</span>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(systemStats.diskUsage, { good: 70, warning: 85 })}`}>
              {systemStats.diskUsage}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(systemStats.diskUsage, { good: 70, warning: 85 })} transition-all duration-500`}
              style={{ width: `${systemStats.diskUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Network Status */}
        <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-400" />
              <span className="text-gray-300 text-sm">Ağ</span>
            </div>
            <span className="text-sm font-bold text-green-400">
              {systemStats.ping}ms
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs">Stabil</span>
          </div>
        </div>
      </div>

      {/* Server Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Oyuncular</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{systemStats.playersOnline}</span>
            <span className="text-gray-400">/ {systemStats.maxPlayers}</span>
          </div>
        </div>

        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">TPS</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(20 - systemStats.tps, { good: 0.5, warning: 1 })}`}>
              {systemStats.tps.toFixed(1)}
            </span>
            <span className="text-gray-400">/ 20.0</span>
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Uptime</span>
          </div>
          <span className="text-2xl font-bold text-white">{systemStats.serverUptime}</span>
        </div>
      </div>
    </div>
  );
};