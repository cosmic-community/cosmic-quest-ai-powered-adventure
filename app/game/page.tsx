'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AudioPlayer from '@/components/AudioPlayer'
import StoryDisplay from '@/components/StoryDisplay'
import ChoiceButtons from '@/components/ChoiceButtons'
import GameHeader from '@/components/GameHeader'

interface StoryMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CharacterData {
  name: string
  class: string
  background: string
}

export default function GamePage() {
  const router = useRouter()
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)
  const [storyHistory, setStoryHistory] = useState<StoryMessage[]>([])
  const [currentStory, setCurrentStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [choices, setChoices] = useState<string[]>([])
  const [chapter, setChapter] = useState(1)
  const [health, setHealth] = useState(100)
  const storyEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedCharacter = localStorage.getItem('characterData')
    if (!savedCharacter) {
      router.push('/character-creation')
      return
    }
    
    const character = JSON.parse(savedCharacter)
    setCharacterData(character)
    
    // Start the adventure
    startAdventure(character)
  }, [])

  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentStory])

  const startAdventure = async (character: CharacterData) => {
    setIsStreaming(true)
    setCurrentStory('')
    
    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character })
      })

      if (!response.ok) throw new Error('Failed to start adventure')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedStory = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  accumulatedStory += parsed.text
                  setCurrentStory(accumulatedStory)
                }
                if (parsed.choices) {
                  setChoices(parsed.choices)
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      const newHistory: StoryMessage[] = [
        { role: 'assistant', content: accumulatedStory }
      ]
      setStoryHistory(newHistory)
    } catch (error) {
      console.error('Error starting adventure:', error)
      setCurrentStory('An error occurred. Please try again.')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleChoice = async (choiceText: string) => {
    if (isLoading || isStreaming) return

    setIsLoading(true)
    setIsStreaming(true)
    setCurrentStory('')
    
    const userMessage: StoryMessage = { role: 'user', content: choiceText }
    const newHistory = [...storyHistory, userMessage]
    setStoryHistory(newHistory)

    try {
      const response = await fetch('/api/game/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          character: characterData,
          storyHistory: newHistory,
          choice: choiceText
        })
      })

      if (!response.ok) throw new Error('Failed to continue story')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedStory = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  accumulatedStory += parsed.text
                  setCurrentStory(accumulatedStory)
                }
                if (parsed.choices) {
                  setChoices(parsed.choices)
                }
                if (parsed.chapter) {
                  setChapter(parsed.chapter)
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      const assistantMessage: StoryMessage = { 
        role: 'assistant', 
        content: accumulatedStory 
      }
      setStoryHistory([...newHistory, assistantMessage])
    } catch (error) {
      console.error('Error continuing story:', error)
      setCurrentStory('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleSaveGame = async () => {
    if (!characterData) return
    
    try {
      await fetch('/api/game/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: characterData.name,
          characterClass: characterData.class,
          characterBackground: characterData.background,
          storyHistory,
          currentChapter: chapter,
          choices: [],
          health,
          inventory: []
        })
      })
      alert('Game saved successfully!')
    } catch (error) {
      console.error('Error saving game:', error)
      alert('Failed to save game')
    }
  }

  if (!characterData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-nes-yellow">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4">
      <AudioPlayer />
      
      <div className="max-w-5xl mx-auto">
        <GameHeader 
          characterName={characterData.name}
          characterClass={characterData.class}
          chapter={chapter}
          health={health}
          onSave={handleSaveGame}
        />

        <div className="mt-6">
          <StoryDisplay 
            story={currentStory}
            isStreaming={isStreaming}
            storyHistory={storyHistory}
          />
          <div ref={storyEndRef} />
        </div>

        {choices.length > 0 && !isStreaming && (
          <ChoiceButtons 
            choices={choices}
            onChoice={handleChoice}
            disabled={isLoading}
          />
        )}

        {isLoading && (
          <div className="text-center mt-6">
            <p className="text-nes-yellow text-sm animate-pulse">
              The fates are deciding...
            </p>
          </div>
        )}
      </div>
    </main>
  )
}