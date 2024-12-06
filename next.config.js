/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    disableStaticImages: true
  },
  compiler: {
    styledComponents: true
  }
};

module.exports = nextConfig;
