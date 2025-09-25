import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* Disable static optimization to prevent build manifest issues */
  output: 'standalone',
  
  /* Enable experimental features with caution */
  experimental: {
    // Improve build stability
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  
  /* Configure webpack to handle potential race conditions */
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Add fallback for potential missing modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  
  /* Security headers */
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.openai.com https://oauth2.googleapis.com https://www.googleapis.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];

    // Add development-specific headers to prevent caching issues
    if (process.env.NODE_ENV === 'development') {
      headers.push({
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      });
    }

    return headers;
  },
  
  /* Environment variables validation */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  /* External packages for server components */
  serverExternalPackages: ['@supabase/supabase-js'],
  
  /* Image optimization */
  images: {
    domains: ['localhost', 'supabase.co', 'supabase.in'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  /* Redirects for security */
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/protected/admin',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
