import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <AudioPlayer />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Game Title */}
        <div className="text-center mb-12 animate-float">
          <h1 className="text-4xl md:text-6xl mb-4 text-nes-green text-shadow-pixel">
            COSMIC QUEST
          </h1>
          <p className="text-sm md:text-base text-nes-yellow">
            AI-Powered Adventure
          </p>
        </div>

        {/* Menu Container */}
        <div className="text-box max-w-2xl mx-auto">
          <div className="space-y-6">
            <p className="text-xs md:text-sm leading-relaxed text-center mb-8">
              Welcome, brave adventurer! Prepare to embark on an infinite journey
              where every choice shapes your destiny. The AI guides your path
              through endless possibilities...
            </p>

            <div className="space-y-4">
              <Link href="/character-creation">
                <button className="pixel-button w-full text-sm md:text-base">
                  ▶ NEW GAME
                </button>
              </Link>

              <Link href="/load-game">
                <button className="pixel-button w-full text-sm md:text-base">
                  ↺ LOAD GAME
                </button>
              </Link>

              <Link href="/about">
                <button className="pixel-button w-full text-sm md:text-base">
                  ℹ ABOUT
                </button>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-nes-gray">
                Press START to begin your adventure
              </p>
              <div className="mt-2 text-nes-green animate-blink">▼</div>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center mt-8 text-xs text-nes-gray">
          <p>Powered by Cosmic AI</p>
          <p className="mt-2">© 2024 Cosmic Quest</p>
        </div>
      </div>
    </main>
  )
}