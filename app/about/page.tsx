import Link from 'next/link'
import AudioPlayer from '@/components/AudioPlayer'

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AudioPlayer />
      
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4 text-nes-green text-shadow-pixel">
            ABOUT
          </h1>
          <p className="text-xs text-nes-yellow">Cosmic Quest</p>
        </div>

        <div className="text-box space-y-6">
          <div>
            <h2 className="text-lg mb-3 text-nes-yellow">What is Cosmic Quest?</h2>
            <p className="text-xs leading-relaxed">
              Cosmic Quest is an AI-powered text adventure game that creates infinite,
              unique storylines based on your choices. Every adventure is different,
              crafted in real-time by advanced AI that adapts to your decisions.
            </p>
          </div>

          <div>
            <h2 className="text-lg mb-3 text-nes-yellow">How to Play</h2>
            <ul className="text-xs space-y-2 list-disc list-inside">
              <li>Create your character with a name, class, and background</li>
              <li>Read the story as it unfolds</li>
              <li>Choose from multiple options to guide your adventure</li>
              <li>Save your progress at any time</li>
              <li>Experience unique outcomes based on your decisions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg mb-3 text-nes-yellow">Features</h2>
            <ul className="text-xs space-y-2 list-disc list-inside">
              <li>Infinite AI-generated storylines</li>
              <li>6 unique character classes</li>
              <li>Real-time story streaming</li>
              <li>Save and load game system</li>
              <li>Retro 8-bit aesthetic</li>
              <li>Authentic chiptune soundtrack</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg mb-3 text-nes-yellow">Powered By</h2>
            <p className="text-xs leading-relaxed">
              This game uses Cosmic AI for dynamic story generation and Cosmic CMS
              for game state management. The AI understands context and creates
              coherent narratives that respond to your choices.
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/">
              <button className="pixel-button">
                ◀ BACK TO MENU
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-nes-gray">
          <p>Version 1.0.0</p>
          <p className="mt-2">© 2024 Cosmic Quest</p>
        </div>
      </div>
    </main>
  )
}