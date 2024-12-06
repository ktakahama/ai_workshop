/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    disableStaticImages: true
  },
  compiler: {
    styledComponents: true
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
