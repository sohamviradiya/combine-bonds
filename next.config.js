/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true,
        serverActions: true,
    },
    staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig
