/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'issue-local.s3.ap-south-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
