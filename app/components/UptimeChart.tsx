'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface HistoricalData {
  checked_at: string;
  response_time: number;
  status: string;
  status_code: number;
  uptime: number;
}

interface UptimeChartProps {
  url: string;
  name: string;
  zone?: string;
}

const ZONES = [
  { id: 'us-east', name: 'US East', location: 'Virginia', flag: '🇺🇸' },
  { id: 'eu-west', name: 'EU West', location: 'Ireland', flag: '🇮🇪' },
  { id: 'asia-se', name: 'Asia SE', location: 'Singapore', flag: '🇸🇬' },
  { id: 'us-west', name: 'US West', location: 'California', flag: '🇺🇸' },
  { id: 'eu-central', name: 'EU Central', location: 'Germany', flag: '🇩🇪' },
];

export default function UptimeChart({ url, name, zone: initialZone }: UptimeChartProps) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(24);
  const [selectedZone, setSelectedZone] = useState(initialZone || 'us-east');

  useEffect(() => {
    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 60000);
    return () => clearInterval(interval);
  }, [url, timeRange, selectedZone]);

  const fetchHistoricalData = async () => {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/history/${encodedUrl}?type=historical&hours=${timeRange}&zone=${selectedZone}`);
      const historicalData = await response.json();
      setData(historicalData);
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-3 shadow-2xl">
          <p className="text-yellow-400 text-sm mb-2 font-bold">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold text-white">
              {entry.name}: <span style={{ color: entry.color }}>{entry.value}{entry.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border-2 border-yellow-400 rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 border-2 border-yellow-400 rounded-xl p-6">
        <p className="text-yellow-400 text-center font-semibold">No historical data available yet. Check back soon!</p>
      </div>
    );
  }

  // Calculate uptime percentage
  const uptimeData = data.map(item => ({
    time: item.checked_at,
    uptime: item.status === 'up' ? 100 : 0,
    responseTime: Math.round(item.response_time * 1000),
  }));

  const totalChecks = data.length;
  const successfulChecks = data.filter(d => d.status === 'up').length;
  const uptimePercentage = ((successfulChecks / totalChecks) * 100).toFixed(2);
  const avgResponseTime = Math.round(data.reduce((acc, d) => acc + (d.response_time * 1000), 0) / totalChecks);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-yellow-400">📊 Uptime Analytics</h3>
          <p className="text-gray-400 text-sm">Monitoring from: {ZONES.find(z => z.id === selectedZone)?.flag} {ZONES.find(z => z.id === selectedZone)?.name}</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* Zone Selector */}
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Monitoring Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-bold border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.flag} {zone.name} ({zone.location})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Time Range</label>
            <div className="flex gap-2">
              {[6, 12, 24, 48, 168].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setTimeRange(hours)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all font-bold ${
                    timeRange === hours
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {hours < 24 ? `${hours}h` : `${hours / 24}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Uptime Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-500 rounded-lg p-4">
          <p className="text-black text-xs mb-1 font-semibold">Uptime</p>
          <p className="text-black font-bold text-3xl">{uptimePercentage}%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-500 rounded-lg p-4">
          <p className="text-black text-xs mb-1 font-semibold">Avg Response</p>
          <p className="text-black font-bold text-3xl">{avgResponseTime}ms</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-500 rounded-lg p-4">
          <p className="text-black text-xs mb-1 font-semibold">Total Checks</p>
          <p className="text-black font-bold text-3xl">{totalChecks}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-500 rounded-lg p-4">
          <p className="text-black text-xs mb-1 font-semibold">Downtime</p>
          <p className="text-black font-bold text-3xl">{totalChecks - successfulChecks}</p>
        </div>
      </div>

      {/* Main Uptime Chart */}
      <div className="bg-gray-800 border-2 border-yellow-400 rounded-xl p-6">
        <h4 className="text-lg font-bold text-yellow-400 mb-4">⚡ Uptime History</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={uptimeData}>
            <defs>
              <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="#eab308"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#eab308"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="stepAfter"
              dataKey="uptime"
              stroke="#eab308"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUptime)"
              name="Uptime"
              unit="%"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Response Time Chart */}
      <div className="bg-gray-800 border-2 border-yellow-400 rounded-xl p-6">
        <h4 className="text-lg font-bold text-yellow-400 mb-4">⚡ Response Time</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={uptimeData}>
            <defs>
              <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="#eab308"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#eab308"
              style={{ fontSize: '12px' }}
              label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#eab308' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="#eab308"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResponseTime)"
              name="Response Time"
              unit="ms"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

