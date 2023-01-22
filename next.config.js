/** @type {import('next').NextConfig} */
//next.config.js
const { withContentlayer } = require("next-contentlayer");

const nextConfig = {
  reactStrictMode: false,
  exportTrailingSlash: true,
  images: {
    domains: ["images.unsplash.com", "media-exp1.licdn.com"],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
