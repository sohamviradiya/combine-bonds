/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true,
     },
     staticPageGenerationTimeout: 60,
};

module.exports = nextConfig
