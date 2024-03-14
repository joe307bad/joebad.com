/** @type {import('next').NextConfig} */
//next.config.js
const { withContentlayer } = require("next-contentlayer");

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com", "media-exp1.licdn.com"],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/experience',
        destination: '/cv',
        permanent: true,
      },
    ]
  },
};

module.exports = withContentlayer(nextConfig);
