/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalize packages that use dynamic require() to avoid build warnings
  serverExternalPackages: [
    'require-in-the-middle',
    '@opentelemetry/instrumentation',
    '@opentelemetry/exporter-jaeger',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Enable image optimization with quality settings
    formats: ['image/avif', 'image/webp'],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images longer
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yryoxzexvuhimvezdwle.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ihpfajyotvzcdqagdslw.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add headers for caching static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
