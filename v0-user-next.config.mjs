/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize compilation and bundling
  // swcMinify is no longer needed as it's the default in newer Next.js versions
  
  // Optimize large pages
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable experimental optimizations
  experimental: {
    // Enable app directory optimizations
    optimizeCss: true,
    // Fix turbo configuration
    turbo: { 
      loaders: { 
        '.js': ['jsx'] 
      } 
    },
    // Optimize images
    optimizeServerReact: true,
  },
  
  // serverExternalPackages instead of serverComponentsExternalPackages
  serverExternalPackages: [],
  
  // Optimize routing
  reactStrictMode: true,
  
  // Optimize image loading
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
}

export default nextConfig; 