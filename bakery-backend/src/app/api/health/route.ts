import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Execute a read-only database query
    await payload.db.drizzle.execute('SELECT 1')

    return NextResponse.json(
      {
        status: 'healthy',
        application: 'sweetcrumb-bakery-backend',
        database: 'connected',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Database health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
      },
      { status: 503 },
    )
  }
}