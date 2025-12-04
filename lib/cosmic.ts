import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

export async function saveGameState(gameData: {
  characterName: string
  characterClass: string
  characterBackground: string
  storyHistory: any[]
  currentChapter: number
  choices: any[]
  health: number
  inventory: string[]
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
        inventory: JSON.stringify(gameData.inventory)
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
    
    const response = await cosmic.objects.updateOne(gameId, { metadata })
    return response.object
  } catch (error) {
    console.error('Error updating game state:', error)
    throw new Error('Failed to update game')
  }
}