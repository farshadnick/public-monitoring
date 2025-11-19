'use client';

import { useState, useEffect } from 'react';

interface PushMetric {
  id: string;
  job: string;
  instance?: string;
  metric_name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: string;
  help?: string;
  type?: 'counter' | 'gauge' | 'histogram' | 'summary';
}

interface MetricGroup {
  job: string;
  instance: string;
  metrics: PushMetric[];
  lastPush: string;
}

export default function PushGateway() {
  const [metricGroups, setMetricGroups] = useState<MetricGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<MetricGroup | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchMetricGroups();
    const interval = setInterval(fetchMetricGroups, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchMetricGroups = async () => {
    try {
      // Mock data - in production, this would call an API
      const mockGroups: MetricGroup[] = [
        {
          job: 'backup_job',
          instance: 'prod-server-01',
          lastPush: new Date(Date.now() - 300000).toISOString(),
          metrics: [
            {
              id: '1',
              job: 'backup_job',
              instance: 'prod-server-01',
              metric_name: 'backup_duration_seconds',
              value: 145.23,
              timestamp: new Date(Date.now() - 300000).toISOString(),
              type: 'gauge',
              help: 'Duration of backup operation in seconds',
            },
            {
              id: '2',
              job: 'backup_job',
              instance: 'prod-server-01',
              metric_name: 'backup_size_bytes',
              value: 5368709120,
              timestamp: new Date(Date.now() - 300000).toISOString(),
              type: 'gauge',
              help: 'Size of backup in bytes',
            },
          ],
        },
      ];
      setMetricGroups(mockGroups);
    } catch (error) {
      console.error('Failed to fetch metric groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = (job: string, instance: string) => {
    if (confirm(`Delete all metrics for ${job}/${instance}?`)) {
      setMetricGroups(metricGroups.filter(g => !(g.job === job && g.instance === instance)));
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatValue = (metric: PushMetric) => {
    if (metric.metric_name.includes('bytes')) {
      return formatBytes(metric.value);
    }
    if (metric.metric_name.includes('seconds')) {
      return `${metric.value.toFixed(2)}s`;
    }
    return metric.value.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getPushUrl = (job: string, instance?: string) => {
    const base = `${window.location.origin}/api/pushgateway/metrics/job/${encodeURIComponent(job)}`;
    return instance ? `${base}/instance/${encodeURIComponent(instance)}` : base;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pushgateway</h2>
          <p className="text-gray-600 mt-1">Push custom metrics from batch jobs and ephemeral services</p>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Use
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-blue-600">{metricGroups.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Metrics</p>
              <p className="text-3xl font-bold text-purple-600">
                {metricGroups.reduce((sum, g) => sum + g.metrics.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Last Push</p>
              <p className="text-lg font-bold text-green-600">
                {metricGroups.length > 0
                  ? new Date(Math.max(...metricGroups.map(g => new Date(g.lastPush).getTime()))).toLocaleTimeString()
                  : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Groups List */}
      {metricGroups.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Metrics Pushed Yet</h3>
          <p className="text-gray-600 mb-6">Start pushing metrics from your batch jobs and services</p>
          <button
            onClick={() => setShowHelp(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Documentation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {metricGroups.map((group, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{group.job}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {group.instance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Last push: {new Date(group.lastPush).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.job, group.instance)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.metrics.map((metric) => (
                  <div key={metric.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{metric.metric_name}</h4>
                        {metric.help && (
                          <p className="text-xs text-gray-600 mt-1">{metric.help}</p>
                        )}
                      </div>
                      {metric.type && (
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          {metric.type}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      {formatValue(metric)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Push URL:</span>
                  <button
                    onClick={() => copyToClipboard(getPushUrl(group.job, group.instance))}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </button>
                </div>
                <code className="text-xs text-gray-800 break-all">{getPushUrl(group.job, group.instance)}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metric Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedGroup.job}</h3>
                  <p className="text-gray-600 mt-1">Instance: {selectedGroup.instance}</p>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Metrics Details</h4>
              <div className="space-y-3">
                {selectedGroup.metrics.map((metric) => (
                  <div key={metric.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{metric.metric_name}</h5>
                      {metric.type && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {metric.type}
                        </span>
                      )}
                    </div>
                    {metric.help && (
                      <p className="text-sm text-gray-600 mb-2">{metric.help}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <span className="ml-2 font-semibold text-gray-900">{formatValue(metric)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {new Date(metric.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {metric.labels && Object.keys(metric.labels).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(metric.labels).map(([key, value]) => (
                          <span key={key} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                            {key}="{value}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Pushgateway Usage Guide</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">What is Pushgateway?</h4>
                <p className="text-gray-700">
                  Similar to <a href="https://healthchecks.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Healthchecks.io</a>, 
                  Pushgateway allows ephemeral and batch jobs to push their metrics to an intermediary service. 
                  Unlike long-running services that Prometheus can scrape, short-lived jobs may finish before Prometheus scrapes them.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Pushing Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Using curl:</h5>
                    <div className="bg-gray-900 rounded-lg p-4 text-sm">
                      <code className="text-green-400">
                        {`# Push a single metric\ncurl -X POST ${window.location.origin}/api/pushgateway/metrics/job/backup_job/instance/server01 \\\n  -d 'backup_duration_seconds{status="success"} 145.23'`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Using Python:</h5>
                    <div className="bg-gray-900 rounded-lg p-4 text-sm">
                      <code className="text-green-400">
                        {`from prometheus_client import CollectorRegistry, Gauge, push_to_gateway\n\nregistry = CollectorRegistry()\ng = Gauge('backup_duration_seconds', 'Backup duration', registry=registry)\ng.set(145.23)\npush_to_gateway('${window.location.origin}/api/pushgateway', job='backup_job', registry=registry)`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Metric Format:</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">Metrics should follow Prometheus text format:</p>
                      <code className="text-sm text-gray-800">
                        # HELP metric_name Description of metric<br/>
                        # TYPE metric_name gauge<br/>
                        metric_name{'{label="value"}'} 42.0
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Batch Jobs:</strong> Push metrics when your nightly backup or data processing job completes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>CI/CD Pipelines:</strong> Report build duration, test results, deployment metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Scheduled Tasks:</strong> Track execution time, success/failure rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Service Meshes:</strong> Push metrics from ephemeral containers and functions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Combine Pushgateway with Cron Job Monitoring for comprehensive observability. 
                  Use Cron Jobs to ensure your tasks run on schedule, and Pushgateway to collect detailed metrics about their execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

