/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['via.placeholder.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
