/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizeCss: true,
  },
  // assetPrefixを使用している場合は削除するか、適切なパスに修正
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-prefix' : '',
};

module.exports = nextConfig;
