/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

module.exports = nextConfig;
