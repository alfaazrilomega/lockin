/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide the bottom-left Next.js dev indicator
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  // Allow Turbopack/Webpack to bundle the pure-ESM @chenglou/pretext package
  transpilePackages: ["@chenglou/pretext"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
}

module.exports = nextConfig
