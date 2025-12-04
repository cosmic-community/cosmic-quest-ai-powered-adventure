import { NextResponse } from 'next/server'
import { saveGameState } from '@/lib/cosmic'

export async function POST(request: Request) {
  try {
    const gameData = await request.json()
    const savedGame = await saveGameState(gameData)
    
    return NextResponse.json({ success: true, game: savedGame })
  } catch (error) {
    console.error('Error saving game:', error)
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    )
  }
}