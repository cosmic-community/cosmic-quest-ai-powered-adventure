import { NextResponse } from 'next/server'
import { getItems } from '@/lib/cosmic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const characterClass = searchParams.get('class')
    
    const items = await getItems()
    
    if (characterClass) {
      const filteredItems = items.filter(item => {
        const usableBy = JSON.parse(item.metadata.usable_by || '[]')
        return usableBy.includes(characterClass) || usableBy.includes('all')
      })
      return NextResponse.json(filteredItems)
    }
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}