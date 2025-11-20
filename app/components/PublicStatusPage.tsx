'use client';

import { useState, useEffect } from 'react';

interface StatusPageMonitor {
  name: string;
  url: string;
  status: 'up' | 'down' | 'unknown';
  uptime: number;
  responseTime: number;
}

export default function PublicStatusPage() {
  const [monitors, setMonitors] = useState<StatusPageMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    pageName: 'Service Status',
    description: 'Real-time status of all our services',
    customDomain: '',
    isPublic: true,
  });

  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMonitors(data);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const allOperational = monitors.every(m => m.status === 'up');
  const avgUptime = monitors.length > 0
    ? monitors.reduce((acc, m) => acc + m.uptime, 0) / monitors.length
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Public Status Page</h2>
        <p className="text-gray-600 mt-1">Share your service status with customers</p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Page Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
            <input
              type="text"
              value={config.pageName}
              onChange={(e) => setConfig({ ...config, pageName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain (Optional)</label>
            <input
              type="text"
              value={config.customDomain}
              onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
              placeholder="status.yourdomain.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={config.isPublic}
              onChange={(e) => setConfig({ ...config, isPublic: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this status page publicly accessible
            </label>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 rounded-xl p-8">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
          {/* Preview Header */}
          <div className={`rounded-t-xl p-8 text-white ${
            allOperational 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">{config.pageName}</h1>
            </div>
            <p className="text-white/90 mb-4">{config.description}</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${allOperational ? 'bg-white' : 'bg-white animate-pulse'}`}></div>
              <span className="font-semibold text-lg">
                {allOperational ? 'All Systems Operational' : 'Service Disruption Detected'}
              </span>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{monitors.length}</div>
              <div className="text-sm text-gray-600 mt-1">Services</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {monitors.filter(m => m.status === 'up').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Operational</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{avgUptime.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </div>
          </div>

          {/* Preview Services */}
          <div className="p-6 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : monitors.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No services to display. Add monitors to see them here.
              </div>
            ) : (
              monitors.map((monitor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      monitor.status === 'up' ? 'bg-green-500' : 
                      monitor.status === 'down' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{monitor.name}</h3>
                      <p className="text-sm text-gray-600">{monitor.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-gray-600">Response Time</div>
                      <div className="font-semibold text-gray-900">
                        {(monitor.responseTime * 1000).toFixed(0)}ms
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600">Uptime</div>
                      <div className="font-semibold text-gray-900">
                        {monitor.uptime.toFixed(1)}%
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      monitor.status === 'up' ? 'bg-green-100 text-green-700' : 
                      monitor.status === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {monitor.status === 'up' ? 'Operational' : 
                       monitor.status === 'down' ? 'Down' : 'Unknown'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Preview Footer */}
          <div className="border-t border-gray-200 p-6 text-center text-sm text-gray-600">
            <p>Powered by Watcher • Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Share Links */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 rounded-lg p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Status Page</h3>
            <p className="text-gray-600 mb-4">
              Your public status page URL:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={config.customDomain || `${window.location.origin}/status/public`}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(config.customDomain || `${window.location.origin}/status/public`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Public Transparency</h4>
              <p className="text-sm text-gray-600">
                Keep your customers informed with a branded status page that shows real-time service status.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Real-time Updates</h4>
              <p className="text-sm text-gray-600">
                Your status page automatically updates every 30 seconds with the latest service metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

