'use client'

import Link from 'next/link'

interface GameHeaderProps {
  characterName: string
  characterClass: string
  chapter: number
  health: number
  onSave: () => void
}

export default function GameHeader({ 
  characterName, 
  characterClass, 
  chapter, 
  health, 
  onSave 
}: GameHeaderProps) {
  return (
    <div className="text-box">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl text-nes-green mb-2">
            {characterName}
          </h1>
          <p className="text-xs text-nes-yellow">
            {characterClass} • Chapter {chapter}
          </p>
        </div>

        <div className="flex-1 w-full md:w-auto">
          <div className="text-xs text-nes-yellow mb-1">Health</div>
          <div className="health-bar">
            <div 
              className="health-fill" 
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="pixel-button text-xs px-3 py-2"
          >
            💾 SAVE
          </button>
          <Link href="/">
            <button className="pixel-button text-xs px-3 py-2">
              🏠 MENU
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}