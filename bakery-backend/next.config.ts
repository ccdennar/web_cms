
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'

// ==========================================
// NEXT.JS CONFIGURATION
// ==========================================
const nextConfig: NextConfig = {

  // ========================================
  // DOCKER STANDALONE OUTPUT
  // ========================================
  output: 'standalone',

  // ========================================
  // IMAGE CONFIGURATION
  // ========================================
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },

  // ========================================
  // WEBPACK CONFIGURATION
  // ========================================
  webpack: (webpackConfig) => {
    webpackConfig.resolve ??= {}

    webpackConfig.resolve.extensionAlias = {
      ...webpackConfig.resolve.extensionAlias,
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  // ========================================
  // TURBOPACK CONFIGURATION
  // ========================================
  turbopack: {
    root: path.resolve(process.cwd()),
  },
}

// ==========================================
// PAYLOAD CMS INTEGRATION
// ==========================================
export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
