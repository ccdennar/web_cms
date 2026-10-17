

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Verify PostgreSQL connectivity through Payload CMS.
    // This executes a read-only database query.
    await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        status: 'healthy',
        application: 'sweetcrumb-bakery-backend',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch (error) {
    console.error('Database health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        application: 'sweetcrumb-bakery-backend',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}

