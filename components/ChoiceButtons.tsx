'use client'

interface ChoiceButtonsProps {
  choices: string[]
  onChoice: (choice: string) => void
  disabled: boolean
}

export default function ChoiceButtons({ 
  choices, 
  onChoice, 
  disabled 
}: ChoiceButtonsProps) {
  if (choices.length === 0) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="text-center text-xs text-nes-yellow mb-4">
        What will you do?
      </div>
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onChoice(choice)}
          disabled={disabled}
          className="pixel-button w-full text-left text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {index + 1}. {choice}
        </button>
      ))}
    </div>
  )
}