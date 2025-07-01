import React, { useState } from 'react';
import { Map, Users, MapPin, Eye, Zap } from 'lucide-react';

export const ServerMap: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState('survival');

  const worlds = {
    survival: {
      name: 'Survival',
      players: 45,
      coordinates: { x: 128, y: 64, z: -256 },
      biome: 'Plains',
      weather: 'Clear',
      time: 'Day'
    },
    creative: {
      name: 'Creative',
      players: 23,
      coordinates: { x: 0, y: 100, z: 0 },
      biome: 'Void',
      weather: 'Clear',
      time: 'Day'
    },
    minigames: {
      name: 'Mini Games',
      players: 67,
      coordinates: { x: 500, y: 80, z: 300 },
      biome: 'Custom',
      weather: 'Clear',
      time: 'Day'
    }
  };

  const currentWorld = worlds[selectedWorld as keyof typeof worlds];

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Map className="h-6 w-6 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">🗺️ Sunucu Haritası</h3>
      </div>

      {/* World Selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(worlds).map(([key, world]) => (
          <button
            key={key}
            onClick={() => setSelectedWorld(key)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedWorld === key
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {world.name}
          </button>
        ))}
      </div>

      {/* Map Display */}
      <div className="relative bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg p-6 mb-4 border border-gray-600/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-lg"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50">
            <MapPin className="h-8 w-8 text-green-400" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">{currentWorld.name} Dünyası</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">X</div>
              <div className="text-white font-bold">{currentWorld.coordinates.x}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Y</div>
              <div className="text-white font-bold">{currentWorld.coordinates.y}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Z</div>
              <div className="text-white font-bold">{currentWorld.coordinates.z}</div>
            </div>
          </div>
        </div>
      </div>

      {/* World Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Oyuncular</span>
          </div>
          <div className="text-white font-bold">{currentWorld.players}</div>
        </div>

        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm">Biom</span>
          </div>
          <div className="text-white font-bold">{currentWorld.biome}</div>
        </div>

        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">Hava</span>
          </div>
          <div className="text-white font-bold">{currentWorld.weather}</div>
        </div>

        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm">Zaman</span>
          </div>
          <div className="text-white font-bold">{currentWorld.time}</div>
        </div>
      </div>
    </div>
  );
};