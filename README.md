# 🎮 Cosmic Quest: AI-Powered Adventure

![Game Preview](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=300&fit=crop&auto=format)

An infinite text-based RPG adventure game powered by Cosmic AI that creates unique, dynamic storylines adapting to your choices. Experience classic 8-bit gaming aesthetics with modern AI-powered narrative generation.

## ✨ Features

- **AI-Powered Infinite Storytelling** - Cosmic AI generates unique narratives that adapt to every player choice
- **Dynamic Character Creation** - Interactive character builder with AI-guided customization and backstory generation
- **Adaptive Quest System** - Quests and challenges evolve based on player decisions and character attributes
- **8-Bit Retro Design** - Authentic NES-era aesthetic with pixel-art UI and classic color palettes
- **Soothing Chiptune Soundtrack** - Continuous 8-bit background music for immersive gameplay
- **Persistent Game States** - Save/load system stores progress in Cosmic CMS
- **Context-Aware AI** - AI remembers your story history and maintains narrative consistency
- **Multiple Choice System** - Every decision matters and influences the storyline
- **Real-time Streaming** - Watch the story unfold in real-time as AI generates content

## 🚀 Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=6931d02a2794e7afddb52884&clone_repository=6931d3432794e7afddb528a0)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "What capabilities do the AI Agents have in Cosmic?"

### Code Generation Prompt

> Create a text based role playing choose your own adventure game that has infinite possibilities using the Cosmic AI to introduce you to the experience, help you craft your character, and take you through the story and adapting to the users answers to continue creating new experiences and storyline. Have the design of the site be like you're playing an old Zelda nintendo game. Include soothing 8bit soundtrack background and graphics

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Cosmic
- **AI**: Cosmic AI (Claude Sonnet 4.5)
- **Runtime**: Bun
- **Font**: Press Start 2P (Google Fonts)

## 📋 Getting Started

### Prerequisites

- Bun installed on your system
- A Cosmic account with:
  - Bucket Slug
  - Read Key
  - Write Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cosmic-quest
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Cosmic SDK Examples

### AI Text Generation (Story Creation)

```typescript
import { cosmic } from '@/lib/cosmic'

// Generate story continuation based on player choice
const response = await cosmic.ai.generateText({
  messages: [
    { 
      role: 'user', 
      content: 'You are a wise dungeon master guiding a hero through an adventure...' 
    },
    { 
      role: 'assistant', 
      content: 'Previous story context...' 
    },
    { 
      role: 'user', 
      content: 'The hero chose to explore the dark cave. What happens next?' 
    }
  ],
  max_tokens: 500,
  stream: true
})
```

### Save Game State

```typescript
// Save player progress to Cosmic
const gameState = await cosmic.objects.insertOne({
  type: 'game-states',
  title: `${characterName}'s Adventure`,
  metadata: {
    character_name: characterName,
    character_class: characterClass,
    story_history: JSON.stringify(storyHistory),
    current_chapter: chapterNumber,
    choices_made: JSON.stringify(choices)
  }
})
```

### Load Game State

```typescript
// Retrieve saved game
const response = await cosmic.objects
  .find({
    type: 'game-states',
    'metadata.character_name': characterName
  })
  .props(['id', 'title', 'metadata'])
  .depth(0)

const savedGame = response.objects[0]
```

## 🎨 Cosmic CMS Integration

The application uses Cosmic to:
- **Store Game States**: Character data, story progression, and player choices
- **Manage Assets**: 8-bit graphics, sound effects, and UI elements
- **AI Integration**: Leverage Cosmic AI for dynamic story generation
- **Save System**: Persistent storage for multiple save slots per player

### Content Model Structure

**game-states** Object Type:
- `character_name` (text) - Player's character name
- `character_class` (text) - Character class/role
- `story_history` (json) - Complete story progression
- `current_chapter` (number) - Current story chapter
- `choices_made` (json) - All player decisions
- `created_at` (date) - Save timestamp

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Connect your repository
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy!

## 🎵 Audio Attribution

The 8-bit soundtrack uses royalty-free chiptune music to create an authentic retro gaming atmosphere.

## 🎯 Game Features

- **Character Creation**: Choose your name, class, and background
- **Infinite Possibilities**: AI generates unique stories for every playthrough
- **Meaningful Choices**: Every decision influences your adventure
- **Save System**: Multiple save slots to preserve your progress
- **Retro Experience**: Authentic 8-bit design and music
- **Responsive Design**: Play on desktop or mobile devices

## 📝 License

MIT License - Feel free to use this project for your own adventures!

---

Built with ❤️ using [Cosmic](https://www.cosmicjs.com) AI capabilities
<!-- README_END -->