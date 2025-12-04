import { cosmic } from '@/lib/cosmic'

export async function POST(request: Request) {
  try {
    const { character, storyHistory, choice } = await request.json()

    const messages = [
      {
        role: 'user' as const,
        content: `You are a dungeon master for ${character.name}, a ${character.class}. Continue the adventure based on their choice. Maintain consistency with previous events and the character's background: ${character.background}`
      },
      ...storyHistory.slice(-6), // Keep last 6 messages for context
      {
        role: 'user' as const,
        content: `The player chose: "${choice}". Continue the story with dramatic consequences of this choice. End with exactly 3 new choices. Format:

[Story continuation]

CHOICES:
1. [First option]
2. [Second option]
3. [Third option]`
      }
    ]

    const stream = await cosmic.ai.generateText({
      messages,
      max_tokens: 600,
      stream: true
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let fullText = ''
          
          for await (const chunk of stream as any) {
            if (chunk.text) {
              fullText += chunk.text
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`)
              )
            }
          }

          // Extract choices
          const choicesMatch = fullText.match(/CHOICES:\s*\n1\.\s*(.+)\n2\.\s*(.+)\n3\.\s*(.+)/i)
          if (choicesMatch && choicesMatch[1] && choicesMatch[2] && choicesMatch[3]) {
            const choices = [
              choicesMatch[1].trim(),
              choicesMatch[2].trim(),
              choicesMatch[3].trim()
            ]
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ choices })}\n\n`)
            )
          }

          // Calculate chapter (roughly every 3 choices)
          const chapter = Math.floor(storyHistory.length / 6) + 1
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ chapter })}\n\n`)
          )

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error continuing story:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to continue story' }),
      { status: 500 }
    )
  }
}