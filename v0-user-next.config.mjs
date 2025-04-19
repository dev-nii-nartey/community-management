/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize compilation and bundling
  swcMinify: true,
  
  // Optimize large pages
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable experimental optimizations
  experimental: {
    // Enable app directory optimizations
    optimizeCss: true,
    // Enable turbopack for fast dev experience if compatible
    turbo: { loaders: { '.js': 'jsx' } },
    // Enable server components optimization
    serverComponentsExternalPackages: [],
    // Optimize images
    optimizeServerReact: true,
  },
  
  // Optimize routing
  reactStrictMode: true,
  
  // Optimize image loading
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
}

export default nextConfig; 