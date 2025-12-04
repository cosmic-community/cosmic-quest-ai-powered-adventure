'use client'

interface StoryMessage {
  role: 'user' | 'assistant'
  content: string
}

interface StoryDisplayProps {
  story: string
  isStreaming: boolean
  storyHistory: StoryMessage[]
}

export default function StoryDisplay({ 
  story, 
  isStreaming, 
  storyHistory 
}: StoryDisplayProps) {
  // Remove CHOICES section from display
  const cleanStory = (text: string) => {
    return text.split(/CHOICES:/i)[0].trim()
  }

  return (
    <div className="text-box min-h-[400px]">
      <div className="space-y-4">
        {/* Previous story segments */}
        {storyHistory.slice(0, -1).map((message, index) => (
          message.role === 'assistant' && (
            <div key={index} className="text-xs leading-relaxed text-nes-white opacity-70">
              {cleanStory(message.content)}
            </div>
          )
        ))}

        {/* Current story being told */}
        {story && (
          <div className="text-xs leading-relaxed text-nes-white">
            {cleanStory(story)}
            {isStreaming && <span className="animate-blink ml-1">▮</span>}
          </div>
        )}

        {!story && !isStreaming && storyHistory.length === 0 && (
          <div className="text-center text-nes-yellow text-xs">
            <p>Preparing your adventure...</p>
          </div>
        )}
      </div>
    </div>
  )
}