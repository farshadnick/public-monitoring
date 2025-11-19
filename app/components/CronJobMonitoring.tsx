'use client';

import { useState, useEffect } from 'react';
import { CronCheck, CronPingEvent } from '@/types';

export default function CronJobMonitoring() {
  const [checks, setChecks] = useState<CronCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<CronCheck | null>(null);
  const [pingEvents, setPingEvents] = useState<CronPingEvent[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    scheduleType: 'simple' as 'simple' | 'cron',
    period: 3600,
    grace: 300,
    cronExpression: '0 0 * * *',
  });

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      // Mock data for now - in production, this would call an API
      const mockChecks: CronCheck[] = [
        {
          id: '1',
          name: 'Daily Backup',
          description: 'Nightly database backup job',
          tags: ['backup', 'database'],
          period: 86400,
          grace: 3600,
          status: 'up',
          lastPing: new Date(Date.now() - 3600000).toISOString(),
          nextExpectedPing: new Date(Date.now() + 82800000).toISOString(),
          pingUrl: `${window.location.origin}/api/ping/abc123def456`,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          totalPings: 42,
          failureCount: 0,
        },
      ];
      setChecks(mockChecks);
    } catch (error) {
      console.error('Failed to fetch checks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique ID and ping URL
    const newCheck: CronCheck = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      schedule: formData.scheduleType === 'cron' ? formData.cronExpression : undefined,
      period: formData.scheduleType === 'simple' ? formData.period : undefined,
      grace: formData.grace,
      status: 'new',
      pingUrl: `${window.location.origin}/api/ping/${Math.random().toString(36).substr(2, 16)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalPings: 0,
      failureCount: 0,
    };

    setChecks([...checks, newCheck]);
    setShowCreateForm(false);
    setFormData({
      name: '',
      description: '',
      tags: '',
      scheduleType: 'simple',
      period: 3600,
      grace: 300,
      cronExpression: '0 0 * * *',
    });
  };

  const handleDeleteCheck = (id: string) => {
    if (confirm('Are you sure you want to delete this check?')) {
      setChecks(checks.filter(c => c.id !== id));
    }
  };

  const viewCheckDetails = (check: CronCheck) => {
    setSelectedCheck(check);
    // Mock ping events
    const mockEvents: CronPingEvent[] = [
      {
        id: '1',
        checkId: check.id,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        duration: 1250,
        userAgent: 'curl/7.64.1',
        remoteAddr: '192.168.1.100',
        method: 'GET',
        success: true,
      },
      {
        id: '2',
        checkId: check.id,
        timestamp: new Date(Date.now() - 90000000).toISOString(),
        duration: 980,
        userAgent: 'Python-urllib/3.9',
        remoteAddr: '192.168.1.100',
        method: 'POST',
        success: true,
      },
    ];
    setPingEvents(mockEvents);
  };

  const getStatusColor = (status: CronCheck['status']) => {
    switch (status) {
      case 'up': return 'text-green-600 bg-green-100 border-green-500';
      case 'late': return 'text-yellow-600 bg-yellow-100 border-yellow-500';
      case 'down': return 'text-red-600 bg-red-100 border-red-500';
      case 'paused': return 'text-gray-600 bg-gray-100 border-gray-500';
      default: return 'text-blue-600 bg-blue-100 border-blue-500';
    }
  };

  const getStatusIcon = (status: CronCheck['status']) => {
    switch (status) {
      case 'up':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'late':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cron checks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cron Job Monitoring</h2>
        <p className="text-gray-600 mt-1">Monitor scheduled tasks, backups, and recurring jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Checks</p>
              <p className="text-3xl font-bold text-gray-900">{checks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Up</p>
              <p className="text-3xl font-bold text-green-600">{checks.filter(c => c.status === 'up').length}</p>
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
              <p className="text-gray-600 text-sm mb-1">Late</p>
              <p className="text-3xl font-bold text-yellow-600">{checks.filter(c => c.status === 'late').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Down</p>
              <p className="text-3xl font-bold text-red-600">{checks.filter(c => c.status === 'down').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div></div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Cron Check
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Create New Cron Check</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateCheck} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Daily Backup"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this check monitors..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="backup, database, production"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, scheduleType: 'simple' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.scheduleType === 'simple'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Simple</div>
                    <div className="text-sm text-gray-600">Period & Grace Time</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, scheduleType: 'cron' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.scheduleType === 'cron'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Cron</div>
                    <div className="text-sm text-gray-600">Cron Expression</div>
                  </button>
                </div>
              </div>

              {formData.scheduleType === 'simple' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period (seconds) *</label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="1800">30 minutes</option>
                      <option value="3600">1 hour</option>
                      <option value="21600">6 hours</option>
                      <option value="43200">12 hours</option>
                      <option value="86400">24 hours</option>
                      <option value="604800">1 week</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">Expected time between pings</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grace Time (seconds) *</label>
                    <select
                      value={formData.grace}
                      onChange={(e) => setFormData({ ...formData, grace: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="1800">30 minutes</option>
                      <option value="3600">1 hour</option>
                      <option value="7200">2 hours</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">Additional time before alerting</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cron Expression *</label>
                  <input
                    type="text"
                    value={formData.cronExpression}
                    onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                    placeholder="0 0 * * *"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Examples: <span className="font-mono">0 0 * * *</span> (daily at midnight), 
                    <span className="font-mono"> */5 * * * *</span> (every 5 minutes)
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Create Check
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checks List */}
      {checks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cron Checks Yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first cron job check</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Check
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className="bg-white border-l-4 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              style={{ borderLeftColor: check.status === 'up' ? '#10b981' : check.status === 'late' ? '#f59e0b' : check.status === 'down' ? '#ef4444' : '#6b7280' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(check.status)}
                    <h3 className="text-xl font-semibold text-gray-900">{check.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(check.status)}`}>
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {check.description && (
                    <p className="text-gray-600 mb-3">{check.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {check.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Period:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {check.period ? formatDuration(check.period) : check.schedule}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Grace:</span>
                      <span className="ml-2 font-semibold text-gray-900">{formatDuration(check.grace || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Pings:</span>
                      <span className="ml-2 font-semibold text-gray-900">{check.totalPings}</span>
                    </div>
                  </div>

                  {check.lastPing && (
                    <div className="mt-3 text-sm text-gray-600">
                      Last ping: {new Date(check.lastPing).toLocaleString()}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Ping URL:</span>
                      <button
                        onClick={() => copyToClipboard(check.pingUrl)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                      </button>
                    </div>
                    <code className="text-xs text-gray-800 break-all">{check.pingUrl}</code>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => viewCheckDetails(check)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteCheck(check.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Check Details Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCheck.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedCheck.description || 'No description'}</p>
                </div>
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Ping Events</h4>
              <div className="space-y-3">
                {pingEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No ping events recorded yet
                  </div>
                ) : (
                  pingEvents.map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-semibold text-gray-900">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {event.duration ? `${event.duration}ms` : ''}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Method: <span className="font-medium">{event.method}</span></div>
                        <div>User Agent: <span className="font-medium">{event.userAgent}</span></div>
                        <div>IP: <span className="font-medium">{event.remoteAddr}</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 rounded-lg p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use Cron Job Monitoring</h3>
            <ol className="text-gray-700 space-y-2 list-decimal list-inside">
              <li>Create a new check and copy the unique ping URL</li>
              <li>Add a curl command to your cron job or script: <code className="bg-white px-2 py-1 rounded text-sm">curl https://your-ping-url</code></li>
              <li>The check will monitor if pings arrive on schedule</li>
              <li>If a ping doesn't arrive within Period + Grace time, you'll be alerted</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

