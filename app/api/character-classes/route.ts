import { NextResponse } from 'next/server'
import { getCharacterClasses } from '@/lib/cosmic'

export async function GET() {
  try {
    const classes = await getCharacterClasses()
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching character classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character classes' },
      { status: 500 }
    )
  }
}