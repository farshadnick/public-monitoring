'use client';

export default function ThresholdExplanation() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Understanding Monitor Status & Response Times
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Monitor status is determined by response time (latency). You define what "down" means for each monitor:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* UP Status */}
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-900">UP / Healthy</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">Response time &lt; Slow Threshold</p>
                <p className="text-xs text-gray-600">Default: &lt; 5 seconds</p>
                <p className="text-xs text-green-700 mt-2">✓ Service is responding normally</p>
              </div>
            </div>

            {/* SLOW Status */}
            <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-900">SLOW / Warning</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">Between Slow & Down thresholds</p>
                <p className="text-xs text-gray-600">Default: 5s - 30s</p>
                <p className="text-xs text-yellow-700 mt-2">⚠️ Service responding slowly</p>
              </div>
            </div>

            {/* DOWN Status */}
            <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-900">DOWN / Critical</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">Response time &gt; Down Threshold</p>
                <p className="text-xs text-gray-600">Default: &gt; 30 seconds</p>
                <p className="text-xs text-red-700 mt-2">❌ Service unreachable or too slow</p>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-2">Example with default thresholds (5s / 30s):</p>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Response in 2s = <strong className="text-green-700">UP</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Response in 4.5s = <strong className="text-green-700">UP</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Response in 8s = <strong className="text-yellow-700">SLOW</strong> (triggers alert)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Response in 15s = <strong className="text-yellow-700">SLOW</strong></span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Response in 35s = <strong className="text-red-700">DOWN</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Response in 60s = <strong className="text-red-700">DOWN</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Timeout / No response = <strong className="text-red-700">DOWN</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Connection refused = <strong className="text-red-700">DOWN</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Note */}
          <div className="mt-4 flex items-start gap-2 p-3 bg-blue-100 border border-blue-300 rounded-lg">
            <svg className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">💡 Customize for each monitor</p>
              <p>
                Different services have different performance expectations. A database backup might take 10 minutes (600s), while an API should respond in &lt;1s. 
                Configure thresholds based on your service's normal behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

