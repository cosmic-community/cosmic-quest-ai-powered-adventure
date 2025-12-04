import { NextResponse } from 'next/server'
import { getAchievements } from '@/lib/cosmic'

export async function GET() {
  try {
    const achievements = await getAchievements()
    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}