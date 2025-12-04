'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AudioPlayer from '@/components/AudioPlayer'

interface CharacterClassData {
  id: string
  slug: string
  title: string
  metadata: {
    description: string
    starting_health: number
    starting_abilities: string
    stat_bonuses: string
    class_icon: string
    special_traits: string
  }
}

export default function CharacterCreationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [characterName, setCharacterName] = useState('')
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [background, setBackground] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiBackground, setAiBackground] = useState('')
  const [characterClasses, setCharacterClasses] = useState<CharacterClassData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCharacterClasses()
  }, [])

  const loadCharacterClasses = async () => {
    try {
      const response = await fetch('/api/character-classes')
      if (response.ok) {
        const data = await response.json()
        setCharacterClasses(data)
      }
    } catch (error) {
      console.error('Error loading character classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateBackground = async () => {
    if (!characterName || !selectedClass) return
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: characterName, class: selectedClass })
      })
      
      const data = await response.json()
      setAiBackground(data.background)
      setBackground(data.background)
    } catch (error) {
      console.error('Error generating background:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartAdventure = async () => {
    if (!characterName || !selectedClass || !background) return
    
    const selectedClassData = characterClasses.find(c => c.slug === selectedClass)
    
    const characterData = {
      name: characterName,
      class: selectedClass,
      background: background,
      startingHealth: selectedClassData?.metadata.starting_health || 100,
      abilities: selectedClassData?.metadata.starting_abilities ? 
        JSON.parse(selectedClassData.metadata.starting_abilities) : [],
      statBonuses: selectedClassData?.metadata.stat_bonuses ?
        JSON.parse(selectedClassData.metadata.stat_bonuses) : {}
    }
    
    localStorage.setItem('characterData', JSON.stringify(characterData))
    router.push('/game')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <AudioPlayer />
        <div className="text-center">
          <p className="text-nes-yellow">Loading character classes...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AudioPlayer />
      
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 text-nes-green text-shadow-pixel">
            CREATE YOUR HERO
          </h1>
          <p className="text-xs text-nes-yellow">Step {step} of 3</p>
        </div>

        <div className="text-box">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-nes-yellow">
                  What is your name, adventurer?
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="pixel-input w-full"
                  placeholder="Enter your name..."
                  maxLength={20}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!characterName}
                  className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT ▶
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-4 text-nes-yellow">
                  Choose your class:
                </label>
                {characterClasses.length === 0 ? (
                  <div className="text-center text-xs text-nes-gray">
                    <p>No character classes found. Using default classes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characterClasses.map((charClass) => (
                      <button
                        key={charClass.id}
                        onClick={() => setSelectedClass(charClass.slug)}
                        className={`text-left p-4 border-4 transition-all ${
                          selectedClass === charClass.slug
                            ? 'border-nes-green bg-nes-dark-green'
                            : 'border-white hover:border-nes-green'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{charClass.metadata.class_icon}</span>
                          <div className="font-bold text-sm">{charClass.title}</div>
                        </div>
                        <div className="text-xs text-nes-gray mb-2">
                          {charClass.metadata.description}
                        </div>
                        <div className="text-xs text-nes-yellow">
                          HP: {charClass.metadata.starting_health}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="pixel-button">
                  ◀ BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedClass}
                  className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT ▶
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-nes-yellow">
                  Tell us about your background:
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="pixel-input w-full h-32 resize-none"
                  placeholder="Where do you come from? What drives you?..."
                  maxLength={500}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleGenerateBackground}
                  disabled={isGenerating}
                  className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'GENERATING...' : '✨ AI GENERATE'}
                </button>
                {aiBackground && (
                  <p className="text-xs text-nes-green mt-2">Background generated!</p>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="pixel-button">
                  ◀ BACK
                </button>
                <button
                  onClick={handleStartAdventure}
                  disabled={!background}
                  className="pixel-button disabled:opacity-50 disabled:cursor-not-allowed bg-nes-red hover:bg-nes-yellow"
                >
                  START ADVENTURE ▶
                </button>
              </div>
            </div>
          )}
        </div>

        {characterName && selectedClass && (
          <div className="mt-6 text-center text-xs text-nes-gray">
            <p>Character: {characterName} the {selectedClass}</p>
          </div>
        )}
      </div>
    </main>
  )
}