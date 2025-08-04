import { NextResponse } from 'next/server'
import { usageTracker } from '../../../lib/usageTracker'

export async function GET() {
  const stats = usageTracker.getStats()
  return NextResponse.json(stats)
} 