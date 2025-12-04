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
    level?: number
    experience?: number
    achievements?: string
    quests_completed?: string
    total_playtime?: number
  }
}

export interface CharacterClass extends CosmicObject {
  type: 'character-classes'
  metadata: {
    description: string
    starting_health: number
    starting_abilities: string
    stat_bonuses: string
    class_icon: string
    special_traits: string
  }
}

export interface Item extends CosmicObject {
  type: 'items'
  metadata: {
    item_type: string
    rarity: string
    description: string
    stats: string
    usable_by: string
    image_url?: string
    sell_value: number
  }
}

export interface Achievement extends CosmicObject {
  type: 'achievements'
  metadata: {
    description: string
    icon: string
    points: number
    unlock_criteria: string
    reward: string
  }
}

export interface Quest extends CosmicObject {
  type: 'quests'
  metadata: {
    quest_giver: string
    description: string
    difficulty: string
    chapters: string
    rewards: string
    prerequisites: string
  }
}

export interface StoryScenario extends CosmicObject {
  type: 'story-scenarios'
  metadata: {
    scenario_type: string
    difficulty_level: string
    applicable_classes: string
    story_template: string
    possible_outcomes: string
    rewards: string
  }
}

export interface LeaderboardEntry extends CosmicObject {
  type: 'leaderboard-entries'
  metadata: {
    player_name: string
    score: number
    achievements_unlocked: number
    quests_completed: number
    time_period: string
    rank: number
  }
}

export interface GameSettings extends CosmicObject {
  type: 'game-settings'
  metadata: {
    difficulty_multipliers: string
    ai_generation_params: string
    game_balance: string
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
  level?: number
  experience?: number
  achievements?: string[]
}

// Changed: Renamed from CharacterClass to CharacterClassName to avoid duplicate identifier
export type CharacterClassName = 
  | 'warrior' 
  | 'mage' 
  | 'rogue' 
  | 'cleric' 
  | 'ranger' 
  | 'bard'