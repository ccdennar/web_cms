
import dotenv from 'dotenv'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pastries } from './collections/Pastries'
import { Orders } from './collections/Orders'
import { SiteSettings } from './globals/SiteSettings'

// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================
dotenv.config()

// ============================================
// VALIDATE REQUIRED ENVIRONMENT VARIABLES
// ============================================
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET
const DATABASE_URL = process.env.DATABASE_URL

if (!PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required',
  )
}

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is required',
  )
}

// ============================================
// PAYLOAD CMS CONFIGURATION
// ============================================
export default buildConfig({

  // ==========================================
  // APPLICATION SETTINGS
  // ==========================================
  secret: PAYLOAD_SECRET,

  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3001',

  // ==========================================
  // ADMIN PANEL
  // ==========================================
  admin: {
    user: 'users',
  },
  sharp,

  // ==========================================
  // COLLECTIONS
  // ==========================================
  collections: [
    Users,
    Media,
    Pastries,
    Orders,
  ],

  // ==========================================
  // GLOBALS
  // ==========================================
  globals: [
    SiteSettings,
  ],

  // ==========================================
  // RICH TEXT EDITOR
  // ==========================================
  editor: lexicalEditor(),

  // ==========================================
  // POSTGRESQL DATABASE
  // ==========================================
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URL,
    },
  }),

  // ==========================================
  // CORS AND CSRF
  // ==========================================
  cors: [
    'http://localhost:3000',
  ],

  csrf: [
    'http://localhost:3000',
  ],

  // ==========================================
  // TYPESCRIPT
  // ==========================================
  typescript: {
    outputFile: 'src/payload-types.ts',
  },

})
postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI || '',  // ← or a hardcoded default
  },
})