import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${process.env.API_URL}/:path*` },
    ]
  },
}

export default nextConfig
