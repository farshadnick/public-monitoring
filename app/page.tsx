'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">Watcher</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                href="/login"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Monitoring for developers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get notified when your websites go down, your cron jobs don't run, or your batch jobs fail.
            </p>
          </div>

          {/* Quick Start Example */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="mb-3 text-sm font-medium text-gray-700">
                Monitor your cron jobs with a simple curl:
              </div>
              <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                <code className="text-sm text-green-400 font-mono">
                  $ curl https://watcher.yourdomain.com/ping/[check-id]
                </code>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Get alerted when your cron job doesn't run on schedule
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Cron Job Monitoring */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cron Job Monitoring</h3>
                  <p className="text-gray-600 mb-4">
                    Get alerted when your scheduled tasks, backups, and batch jobs don't run on time. Set up monitoring in seconds with unique ping URLs.
                  </p>
                  <div className="text-sm text-gray-500">
                    ✓ Cron expression support<br/>
                    ✓ Grace period configuration<br/>
                    ✓ Event history and logs
                  </div>
                </div>
              </div>
            </div>

            {/* Website Monitoring */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Website Monitoring</h3>
                  <p className="text-gray-600 mb-4">
                    Monitor HTTP/HTTPS endpoints with SSL certificate tracking, response time monitoring, and instant alerts when services go down.
                  </p>
                  <div className="text-sm text-gray-500">
                    ✓ SSL certificate monitoring<br/>
                    ✓ Response time tracking<br/>
                    ✓ Keyword checking
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Metrics */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Metrics</h3>
                  <p className="text-gray-600 mb-4">
                    Push custom metrics from your batch jobs and scripts. Track execution time, success rates, and custom performance data.
                  </p>
                  <div className="text-sm text-gray-500">
                    ✓ Simple HTTP POST API<br/>
                    ✓ Standard metric format<br/>
                    ✓ Historical data storage
                  </div>
                </div>
              </div>
            </div>

            {/* Status Pages */}
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Public Status Pages</h3>
                  <p className="text-gray-600 mb-4">
                    Share your service status with customers and stakeholders. Create branded status pages with real-time updates and uptime history.
                  </p>
                  <div className="text-sm text-gray-500">
                    ✓ Custom branding<br/>
                    ✓ Real-time updates<br/>
                    ✓ Uptime history
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create a check</h3>
              <p className="text-gray-600">
                Add a monitor for your website, cron job, or custom service. Get a unique ping URL or configure HTTP monitoring.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ping on schedule</h3>
              <p className="text-gray-600">
                Add a ping to your cron job, or let us monitor your website. We'll track when things run and how long they take.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get notified</h3>
              <p className="text-gray-600">
                Receive instant alerts via Telegram when something goes wrong. Know about problems before your users do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Simple integration
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Bash Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bash / Cron</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`# Add to your crontab:
0 2 * * * /backup.sh && \\
  curl https://watcher.io/ping/abc123

# With failure detection:
0 2 * * * /backup.sh \\
  && curl -fsS --retry 3 \\
  https://watcher.io/ping/abc123`}
                </pre>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Python</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`import requests

# Start signal
requests.post('https://watcher.io/ping/abc123/start')

# Your code here
do_backup()

# Success signal
requests.post('https://watcher.io/ping/abc123')`}
                </pre>
              </div>
            </div>

            {/* Node.js Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Node.js</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`const axios = require('axios');

async function runTask() {
  try {
    await performBackup();
    await axios.post(
      'https://watcher.io/ping/abc123'
    );
  } catch (error) {
    console.error('Failed:', error);
  }
}`}
                </pre>
              </div>
            </div>

            {/* Docker Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Docker / Docker Compose</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`services:
  backup:
    image: my-backup
    command: >
      sh -c "
        /backup.sh &&
        wget -O- 
        https://watcher.io/ping/abc123
      "`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What can you monitor?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">⏰ Scheduled Tasks</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Database backups</li>
                <li>• Data synchronization</li>
                <li>• Report generation</li>
                <li>• Cleanup scripts</li>
                <li>• Nightly builds</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🌐 Web Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Website uptime</li>
                <li>• API endpoints</li>
                <li>• SSL certificates</li>
                <li>• Response times</li>
                <li>• Content verification</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">🔧 Background Jobs</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Queue workers</li>
                <li>• ETL processes</li>
                <li>• Data pipelines</li>
                <li>• Batch processing</li>
                <li>• System maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start monitoring in minutes
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Simple setup. No credit card required.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900">Watcher</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional monitoring for modern infrastructure.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/login" className="hover:text-gray-900">Dashboard</Link></li>
                <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Contact</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Privacy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">API</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Status</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Watcher. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
