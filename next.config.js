/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Add any custom Webpack configuration here if necessary
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {

    // domains: [
    //   'via.placeholder.com',
    //   'lh3.googleusercontent.com',
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "issuetrack.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

    ],
  },
};

module.exports = nextConfig;
