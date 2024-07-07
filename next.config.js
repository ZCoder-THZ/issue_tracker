/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'posbucket12.s3.ap-southeast-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
