export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, any>
  type: string
  created_at: string
  modified_at: string
}

export interface GameState extends CosmicObject {
  type: 'game-states'
  metadata: {
    character_name: string
    character_class: string
    character_background?: string
    story_history: string
    current_chapter: number
    choices_made: string
    health?: number
    inventory?: string
  }
}

export interface StoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StoryChoice {
  id: number
  text: string
  consequence?: string
}

export interface CharacterData {
  name: string
  class: string
  background: string
}

export interface GameStateData {
  characterName: string
  characterClass: string
  characterBackground: string
  storyHistory: StoryMessage[]
  currentChapter: number
  choices: StoryChoice[]
  health: number
  inventory: string[]
}

export type CharacterClass = 
  | 'warrior' 
  | 'mage' 
  | 'rogue' 
  | 'cleric' 
  | 'ranger' 
  | 'bard'