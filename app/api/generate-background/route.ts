import { NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: Request) {
  try {
    const { name, class: characterClass } = await request.json()

    const response = await cosmic.ai.generateText({
      prompt: `Create a brief, engaging background story (2-3 sentences) for a ${characterClass} named ${name}. Include their motivation for adventure and a hint of their past. Keep it dramatic and exciting for a fantasy RPG setting.`,
      max_tokens: 200
    })

    return NextResponse.json({ background: response.text })
  } catch (error) {
    console.error('Error generating background:', error)
    return NextResponse.json(
      { error: 'Failed to generate background' },
      { status: 500 }
    )
  }
}