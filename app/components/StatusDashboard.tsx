'use client';

import { useState, useEffect } from 'react';
import MetricsChart from './MetricsChart';

interface Metric {
  url: string;
  name: string;
  status: 'up' | 'down' | 'unknown';
  responseTime: number;
  statusCode: number;
  sslDaysRemaining: number | null;
  uptime: number;
  lastCheck: string;
}

export default function StatusDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading live status...</p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No monitors yet</h3>
        <p className="text-gray-600">Add monitors to see live status and metrics</p>
      </div>
    );
  }

  const totalUp = metrics.filter(m => m.status === 'up').length;
  const totalDown = metrics.filter(m => m.status === 'down').length;
  const avgUptime = metrics.reduce((acc, m) => acc + m.uptime, 0) / metrics.length;
  const avgResponseTime = metrics.reduce((acc, m) => acc + m.responseTime, 0) / metrics.length;

  const filteredMetrics = filter === 'all' 
    ? metrics 
    : metrics.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      {/* Overall Health Banner */}
      <div className={`rounded-xl p-6 ${
        totalDown === 0 
          ? 'bg-green-50 border-2 border-green-500' 
          : 'bg-red-50 border-2 border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {totalDown === 0 ? (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-900">All Systems Operational</h3>
                  <p className="text-green-700">All {totalUp} monitors are up and running</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-900">Service Disruption Detected</h3>
                  <p className="text-red-700">{totalDown} monitor{totalDown > 1 ? 's' : ''} {totalDown > 1 ? 'are' : 'is'} currently down</p>
                </div>
              </>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{avgUptime.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">24h Uptime</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Online</p>
              <p className="text-3xl font-bold text-green-600">{totalUp}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Offline</p>
              <p className="text-3xl font-bold text-red-600">{totalDown}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Uptime</p>
              <p className="text-3xl font-bold text-blue-600">{avgUptime.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Response</p>
              <p className="text-3xl font-bold text-purple-600">{(avgResponseTime * 1000).toFixed(0)}ms</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All ({metrics.length})
        </button>
        <button
          onClick={() => setFilter('up')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'up'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Online ({totalUp})
        </button>
        <button
          onClick={() => setFilter('down')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'down'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Offline ({totalDown})
        </button>
      </div>

      {/* Monitor Cards */}
      <div className="space-y-4">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.url}
            className={`bg-white border-l-4 rounded-xl p-6 shadow-sm transition-all hover:shadow-md ${
              metric.status === 'up' ? 'border-green-500' : 
              metric.status === 'down' ? 'border-red-500' : 'border-gray-400'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  metric.status === 'up' ? 'bg-green-500 animate-pulse' : 
                  metric.status === 'down' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{metric.name}</h3>
                  <a
                    href={metric.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {metric.url}
                  </a>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                metric.status === 'up' ? 'bg-green-100 text-green-700' : 
                metric.status === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {metric.status === 'up' ? '✓ Up' : metric.status === 'down' ? '✗ Down' : '? Unknown'}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-wide">Response Time</p>
                <p className={`text-2xl font-bold ${
                  metric.responseTime * 1000 < 500 ? 'text-green-600' :
                  metric.responseTime * 1000 < 1000 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(metric.responseTime * 1000).toFixed(0)}ms
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-wide">Status Code</p>
                <p className={`text-2xl font-bold ${
                  metric.statusCode >= 200 && metric.statusCode < 300 ? 'text-green-600' :
                  metric.statusCode >= 300 && metric.statusCode < 400 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.statusCode || 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-wide">24h Uptime</p>
                <p className={`text-2xl font-bold ${
                  metric.uptime >= 99.9 ? 'text-green-600' :
                  metric.uptime >= 99 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.uptime.toFixed(2)}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-wide">SSL Expiry</p>
                <p className={`text-2xl font-bold ${
                  metric.sslDaysRemaining === null ? 'text-gray-500' :
                  metric.sslDaysRemaining < 7 ? 'text-red-600' : 
                  metric.sslDaysRemaining < 30 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {metric.sslDaysRemaining === null ? 'N/A' : `${metric.sslDaysRemaining}d`}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1 uppercase tracking-wide">Last Check</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(metric.lastCheck).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Uptime Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Uptime Progress</span>
                <span>{metric.uptime.toFixed(2)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    metric.uptime >= 99.9 ? 'bg-green-500' :
                    metric.uptime >= 99 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.uptime}%` }}
                ></div>
              </div>
            </div>

            {/* Toggle Charts Button */}
            <button
              onClick={() => setExpandedUrl(expandedUrl === metric.url ? null : metric.url)}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg py-3 px-4 text-gray-700 font-medium transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {expandedUrl === metric.url ? 'Hide Historical Data' : 'Show Historical Data'}
              <svg 
                className={`w-4 h-4 transition-transform ${expandedUrl === metric.url ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Historical Charts */}
            {expandedUrl === metric.url && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <MetricsChart url={metric.url} name={metric.name} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-refreshes every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
          </span>
        </p>
      </div>
    </div>
  );
}
