/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    disableStaticImages: true
  }
};

module.exports = nextConfig;
