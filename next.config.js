/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow custom domains and disable strict host checking
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  // Disable host header validation to allow custom domains
  experimental: {
    allowedOrigins: ['*'],
  },
}

module.exports = nextConfig

