/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';
    return [
      { source: '/api/auth/:path*', destination: `${backendUrl}/auth/:path*` },
      { source: '/api/users/:path*', destination: `${backendUrl}/users/:path*` },
      { source: '/api/records/:path*', destination: `${backendUrl}/records/:path*` },
      { source: '/api/dashboard/:path*', destination: `${backendUrl}/dashboard/:path*` },
      { source: '/api/roles', destination: `${backendUrl}/roles` },
      { source: '/api/health', destination: `${backendUrl}/health` },
    ];
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
