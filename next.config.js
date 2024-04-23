/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'mutlistore-production.up.railway.app'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      }
    ]
  }
}

module.exports = nextConfig
