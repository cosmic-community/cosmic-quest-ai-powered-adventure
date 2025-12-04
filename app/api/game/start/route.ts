import { cosmic } from '@/lib/cosmic'

export async function POST(request: Request) {
  try {
    const { character } = await request.json()

    const systemPrompt = `You are an expert dungeon master creating an epic fantasy adventure. The player is ${character.name}, a ${character.class}. ${character.background}

Create an engaging opening scene that:
1. Sets the atmosphere with vivid descriptions
2. Introduces an immediate challenge or choice
3. Stays true to the character's class and background
4. Keeps the tone dramatic and exciting
5. Ends with exactly 3 clear choices for the player

Format your response as:
[Story text here]

CHOICES:
1. [First option]
2. [Second option]
3. [Third option]`

    const stream = await cosmic.ai.generateText({
      prompt: systemPrompt,
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

          // Extract choices from the full text
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
    console.error('Error starting game:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to start adventure' }),
      { status: 500 }
    )
  }
}