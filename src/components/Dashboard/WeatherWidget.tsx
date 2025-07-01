import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    location: 'İstanbul, TR'
  });

  useEffect(() => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'snowy': return <CloudSnow className="h-8 w-8 text-white" />;
      default: return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  const getWeatherEmoji = () => {
    switch (weather.condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      default: return '☀️';
    }
  };

  const getConditionText = () => {
    switch (weather.condition) {
      case 'sunny': return 'Güneşli';
      case 'cloudy': return 'Bulutlu';
      case 'rainy': return 'Yağmurlu';
      case 'snowy': return 'Karlı';
      default: return 'Güneşli';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🌤️ Hava Durumu</h3>
        <div className="text-xs text-gray-400">{weather.location}</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getWeatherIcon()}
          <div>
            <div className="text-2xl font-bold text-white">{weather.temperature}°C</div>
            <div className="text-sm text-gray-400">{getConditionText()}</div>
          </div>
        </div>
        <div className="text-4xl">{getWeatherEmoji()}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-xs text-gray-400">Nem</div>
            <div className="text-sm font-medium text-white">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-green-400" />
          <div>
            <div className="text-xs text-gray-400">Rüzgar</div>
            <div className="text-sm font-medium text-white">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
};