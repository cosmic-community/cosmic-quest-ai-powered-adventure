import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  CharacterClass, 
  Item, 
  Achievement, 
  Quest, 
  StoryScenario,
  LeaderboardEntry,
  GameSettings,
  CosmicObject 
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Game State Management
export async function saveGameState(gameData: {
  characterName: string
  characterClass: string
  characterBackground: string
  storyHistory: any[]
  currentChapter: number
  choices: any[]
  health: number
  inventory: string[]
  level?: number
  experience?: number
  achievements?: string[]
  questsCompleted?: string[]
  totalPlaytime?: number
}): Promise<any> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'game-states',
      title: `${gameData.characterName}'s Adventure`,
      metadata: {
        character_name: gameData.characterName,
        character_class: gameData.characterClass,
        character_background: gameData.characterBackground,
        story_history: JSON.stringify(gameData.storyHistory),
        current_chapter: gameData.currentChapter,
        choices_made: JSON.stringify(gameData.choices),
        health: gameData.health,
        inventory: JSON.stringify(gameData.inventory),
        level: gameData.level || 1,
        experience: gameData.experience || 0,
        achievements: JSON.stringify(gameData.achievements || []),
        quests_completed: JSON.stringify(gameData.questsCompleted || []),
        total_playtime: gameData.totalPlaytime || 0
      }
    })
    return response.object
  } catch (error) {
    console.error('Error saving game state:', error)
    throw new Error('Failed to save game')
  }
}

export async function loadGameState(characterName: string): Promise<any | null> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'game-states',
        'metadata.character_name': characterName
      })
      .props(['id', 'title', 'metadata'])
      .depth(0)
    
    if (response.objects && response.objects.length > 0) {
      return response.objects[0]
    }
    return null
  } catch (error) {
    if ((error as any).status === 404) {
      return null
    }
    console.error('Error loading game state:', error)
    throw new Error('Failed to load game')
  }
}

export async function updateGameState(
  gameId: string, 
  updates: {
    storyHistory?: any[]
    currentChapter?: number
    choices?: any[]
    health?: number
    inventory?: string[]
    level?: number
    experience?: number
    achievements?: string[]
    questsCompleted?: string[]
  }
): Promise<any> {
  try {
    const metadata: Record<string, any> = {}
    
    if (updates.storyHistory) {
      metadata.story_history = JSON.stringify(updates.storyHistory)
    }
    if (updates.currentChapter !== undefined) {
      metadata.current_chapter = updates.currentChapter
    }
    if (updates.choices) {
      metadata.choices_made = JSON.stringify(updates.choices)
    }
    if (updates.health !== undefined) {
      metadata.health = updates.health
    }
    if (updates.inventory) {
      metadata.inventory = JSON.stringify(updates.inventory)
    }
    if (updates.level !== undefined) {
      metadata.level = updates.level
    }
    if (updates.experience !== undefined) {
      metadata.experience = updates.experience
    }
    if (updates.achievements) {
      metadata.achievements = JSON.stringify(updates.achievements)
    }
    if (updates.questsCompleted) {
      metadata.quests_completed = JSON.stringify(updates.questsCompleted)
    }
    
    const response = await cosmic.objects.updateOne(gameId, { metadata })
    return response.object
  } catch (error) {
    console.error('Error updating game state:', error)
    throw new Error('Failed to update game')
  }
}

// Character Classes
export async function getCharacterClasses(): Promise<CharacterClass[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'character-classes' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.objects as CharacterClass[]
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching character classes:', error)
    throw new Error('Failed to fetch character classes')
  }
}

export async function getCharacterClass(slug: string): Promise<CharacterClass | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'character-classes', slug })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.object as CharacterClass
  } catch (error) {
    if ((error as any).status === 404) {
      return null
    }
    console.error('Error fetching character class:', error)
    throw new Error('Failed to fetch character class')
  }
}

// Items & Inventory
export async function getItems(): Promise<Item[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'items' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.objects as Item[]
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching items:', error)
    throw new Error('Failed to fetch items')
  }
}

export async function getItemsByClass(characterClass: string): Promise<Item[]> {
  try {
    const allItems = await getItems()
    return allItems.filter(item => {
      const usableBy = JSON.parse(item.metadata.usable_by || '[]')
      return usableBy.includes(characterClass) || usableBy.includes('all')
    })
  } catch (error) {
    console.error('Error fetching items by class:', error)
    return []
  }
}

// Achievements
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'achievements' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.objects as Achievement[]
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching achievements:', error)
    throw new Error('Failed to fetch achievements')
  }
}

export async function checkAchievementUnlock(
  eventType: string, 
  eventData: Record<string, any>
): Promise<Achievement[]> {
  try {
    const achievements = await getAchievements()
    const unlockedAchievements: Achievement[] = []
    
    for (const achievement of achievements) {
      const criteria = JSON.parse(achievement.metadata.unlock_criteria || '{}')
      
      if (criteria.event_type === eventType) {
        let unlocked = true
        
        for (const [key, value] of Object.entries(criteria)) {
          if (key !== 'event_type' && eventData[key] !== value) {
            unlocked = false
            break
          }
        }
        
        if (unlocked) {
          unlockedAchievements.push(achievement)
        }
      }
    }
    
    return unlockedAchievements
  } catch (error) {
    console.error('Error checking achievement unlock:', error)
    return []
  }
}

// Quests
export async function getQuests(): Promise<Quest[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'quests' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.objects as Quest[]
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching quests:', error)
    throw new Error('Failed to fetch quests')
  }
}

export async function getAvailableQuests(level: number): Promise<Quest[]> {
  try {
    const allQuests = await getQuests()
    return allQuests.filter(quest => {
      const prerequisites = JSON.parse(quest.metadata.prerequisites || '{}')
      const minLevel = prerequisites.min_level || 1
      return level >= minLevel
    })
  } catch (error) {
    console.error('Error fetching available quests:', error)
    return []
  }
}

// Story Scenarios
export async function getStoryScenarios(characterClass?: string): Promise<StoryScenario[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'story-scenarios' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    let scenarios = response.objects as StoryScenario[]
    
    if (characterClass) {
      scenarios = scenarios.filter(scenario => {
        const applicableClasses = JSON.parse(scenario.metadata.applicable_classes || '[]')
        return applicableClasses.includes(characterClass) || applicableClasses.includes('all')
      })
    }
    
    return scenarios
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching story scenarios:', error)
    throw new Error('Failed to fetch story scenarios')
  }
}

// Leaderboards
export async function getLeaderboard(timePeriod?: string): Promise<LeaderboardEntry[]> {
  try {
    const query: any = { type: 'leaderboard-entries' }
    
    if (timePeriod) {
      query['metadata.time_period'] = timePeriod
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    const entries = response.objects as LeaderboardEntry[]
    
    // Sort by score descending
    return entries.sort((a, b) => b.metadata.score - a.metadata.score)
  } catch (error) {
    if ((error as any).status === 404) {
      return []
    }
    console.error('Error fetching leaderboard:', error)
    throw new Error('Failed to fetch leaderboard')
  }
}

export async function addLeaderboardEntry(entry: {
  playerName: string
  score: number
  achievementsUnlocked: number
  questsCompleted: number
  timePeriod: string
}): Promise<void> {
  try {
    const leaderboard = await getLeaderboard(entry.timePeriod)
    const rank = leaderboard.filter(e => e.metadata.score > entry.score).length + 1
    
    await cosmic.objects.insertOne({
      type: 'leaderboard-entries',
      title: `${entry.playerName} - ${entry.timePeriod}`,
      metadata: {
        player_name: entry.playerName,
        score: entry.score,
        achievements_unlocked: entry.achievementsUnlocked,
        quests_completed: entry.questsCompleted,
        time_period: entry.timePeriod,
        rank
      }
    })
  } catch (error) {
    console.error('Error adding leaderboard entry:', error)
    throw new Error('Failed to add leaderboard entry')
  }
}

// Game Settings
export async function getGameSettings(): Promise<GameSettings | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'game-settings', slug: 'global-settings' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(0)
    
    return response.object as GameSettings
  } catch (error) {
    if ((error as any).status === 404) {
      return null
    }
    console.error('Error fetching game settings:', error)
    throw new Error('Failed to fetch game settings')
  }
}