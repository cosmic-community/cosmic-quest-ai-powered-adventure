'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'

interface LeaderboardEntry {
  id: string
  title: string
  metadata: {
    player_name: string
    score: number
    achievements_unlocked: number
    quests_completed: number
    time_period: string
    rank: number
  }
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState('all-time')

  useEffect(() => {
    loadLeaderboard()
  }, [timePeriod])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/leaderboard?period=${timePeriod}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4">
      <AudioPlayer />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 text-nes-green text-shadow-pixel">
            🏆 LEADERBOARD
          </h1>
          <p className="text-xs text-nes-yellow">Top adventurers of the realm</p>
        </div>

        <div className="text-box mb-6">
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setTimePeriod('all-time')}
              className={`pixel-button text-xs ${timePeriod === 'all-time' ? 'bg-nes-green' : ''}`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimePeriod('weekly')}
              className={`pixel-button text-xs ${timePeriod === 'weekly' ? 'bg-nes-green' : ''}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimePeriod('monthly')}
              className={`pixel-button text-xs ${timePeriod === 'monthly' ? 'bg-nes-green' : ''}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="text-box">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-nes-yellow text-xs">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-nes-gray text-xs">No entries yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-4 border-2 ${
                    index === 0 ? 'border-nes-yellow bg-nes-dark-yellow' :
                    index === 1 ? 'border-nes-gray' :
                    index === 2 ? 'border-nes-brown' :
                    'border-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-nes-green">
                          {entry.metadata.player_name}
                        </div>
                        <div className="text-xs text-nes-gray">
                          {entry.metadata.achievements_unlocked} achievements • {entry.metadata.quests_completed} quests
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-nes-yellow">
                        {entry.metadata.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-nes-gray">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <button className="pixel-button">
              ◀ BACK TO MENU
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}