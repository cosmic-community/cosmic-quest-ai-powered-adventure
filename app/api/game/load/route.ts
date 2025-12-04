import { NextResponse } from 'next/server'
import { loadGameState } from '@/lib/cosmic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const characterName = searchParams.get('name')
    
    if (!characterName) {
      return NextResponse.json(
        { error: 'Character name required' },
        { status: 400 }
      )
    }
    
    const gameState = await loadGameState(characterName)
    
    if (!gameState) {
      return NextResponse.json(
        { error: 'No saved game found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(gameState)
  } catch (error) {
    console.error('Error loading game:', error)
    return NextResponse.json(
      { error: 'Failed to load game' },
      { status: 500 }
    )
  }
}