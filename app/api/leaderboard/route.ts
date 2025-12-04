import { NextResponse } from 'next/server'
import { getLeaderboard, addLeaderboardEntry } from '@/lib/cosmic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timePeriod = searchParams.get('period') || undefined
    
    const leaderboard = await getLeaderboard(timePeriod)
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json()
    await addLeaderboardEntry(entry)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding leaderboard entry:', error)
    return NextResponse.json(
      { error: 'Failed to add leaderboard entry' },
      { status: 500 }
    )
  }
}