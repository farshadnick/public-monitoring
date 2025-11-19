'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalData {
  checked_at: string;
  response_time: number;
  status: string;
  status_code: number;
  uptime: number;
}

interface MetricsChartProps {
  url: string;
  name: string;
}

export default function MetricsChart({ url, name }: MetricsChartProps) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(24);

  useEffect(() => {
    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [url, timeRange]);

  const fetchHistoricalData = async () => {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/history/${encodedUrl}?type=historical&hours=${timeRange}`);
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
        <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-xl">
          <p className="text-blue-600 text-sm mb-2 font-semibold">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium text-gray-700">
              {entry.name}: <span style={{ color: entry.color }} className="font-bold">{entry.value}{entry.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse border border-gray-200">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600 text-center font-medium">No historical data available yet. Check back soon!</p>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = data.map(item => ({
    time: item.checked_at,
    responseTime: Math.round(item.response_time * 1000), // Convert to ms
    statusCode: item.status_code,
    status: item.status === 'up' ? 100 : 0, // Binary for uptime visualization
  }));

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Historical Metrics</h3>
        <div className="flex gap-2">
          {[6, 12, 24, 48, 168].map((hours) => (
            <button
              key={hours}
              onClick={() => setTimeRange(hours)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all font-medium ${
                timeRange === hours
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {hours < 24 ? `${hours}h` : `${hours / 24}d`}
            </button>
          ))}
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-base font-semibold text-gray-900 mb-4">Response Time</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResponseTime)"
              name="Response Time"
              unit="ms"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Uptime & Status Code Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Status History */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Uptime Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
                ticks={[0, 100]}
                tickFormatter={(value) => value === 100 ? 'Up' : 'Down'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="stepAfter"
                dataKey="status"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStatus)"
                name="Status"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* HTTP Status Codes */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-base font-semibold text-gray-900 mb-4">HTTP Status Codes</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 600]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="stepAfter"
                dataKey="statusCode"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
                activeDot={{ r: 5 }}
                name="Status Code"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-xs mb-1 font-medium uppercase tracking-wide">Avg Response</p>
          <p className="text-blue-900 font-bold text-2xl">
            {Math.round(chartData.reduce((acc, d) => acc + d.responseTime, 0) / chartData.length)}ms
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-xs mb-1 font-medium uppercase tracking-wide">Min Response</p>
          <p className="text-green-900 font-bold text-2xl">
            {Math.min(...chartData.map(d => d.responseTime))}ms
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-xs mb-1 font-medium uppercase tracking-wide">Max Response</p>
          <p className="text-red-900 font-bold text-2xl">
            {Math.max(...chartData.map(d => d.responseTime))}ms
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-xs mb-1 font-medium uppercase tracking-wide">Availability</p>
          <p className="text-purple-900 font-bold text-2xl">
            {((chartData.filter(d => d.status === 100).length / chartData.length) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
