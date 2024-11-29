/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      // serverActions: true,
      serverComponentsExternalPackages: ['mongoose']
    },
    // to get images we have to give domain url.
    images: {
      domains: ['m.media-amazon.com', "i.ebayimg.com"]
    }
  }
  
  module.exports = nextConfig