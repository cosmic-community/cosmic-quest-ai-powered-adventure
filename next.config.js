/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cosmicjs.com',
      },
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig