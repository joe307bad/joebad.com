/** @type {import('next').NextConfig} */
//next.config.js
const {withContentlayer} = require('next-contentlayer');

const nextConfig = {
    reactStrictMode: false,
    exportTrailingSlash: true,
    images: {
        domains: ['images.unsplash.com', 'media-exp1.licdn.com'],
        dangerouslyAllowSVG: true,
        unoptimized: true
    }
}

module.exports = withContentlayer(nextConfig)