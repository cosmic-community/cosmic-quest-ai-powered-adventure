'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'

export default function LoadGamePage() {
  const router = useRouter()
  const [characterName, setCharacterName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoadGame = async () => {
    if (!characterName.trim()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/game/load?name=${encodeURIComponent(characterName)}`)
      
      if (!response.ok) {
        setError('No saved game found for this character')
        setIsLoading(false)
        return
      }
      
      const gameData = await response.json()
      
      // Store loaded game data
      localStorage.setItem('characterData', JSON.stringify({
        name: gameData.metadata.character_name,
        class: gameData.metadata.character_class,
        background: gameData.metadata.character_background
      }))
      localStorage.setItem('loadedGame', JSON.stringify(gameData))
      
      router.push('/game')
    } catch (error) {
      console.error('Error loading game:', error)
      setError('Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AudioPlayer />
      
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 text-nes-green text-shadow-pixel">
            LOAD GAME
          </h1>
          <p className="text-xs text-nes-yellow">Enter your character name</p>
        </div>

        <div className="text-box">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-nes-yellow">
                Character Name:
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLoadGame()}
                className="pixel-input w-full"
                placeholder="Enter character name..."
                maxLength={20}
              />
            </div>

            {error && (
              <div className="text-center">
                <p className="text-xs text-nes-red">{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <Link href="/">
                <button className="pixel-button">
                  ◀ BACK
                </button>
              </Link>
              <button
                onClick={handleLoadGame}
                disabled={!characterName || isLoading}
                className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'LOADING...' : 'LOAD GAME ▶'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-nes-gray">
          <p>Tip: Character names are case-sensitive</p>
        </div>
      </div>
    </main>
  )
}