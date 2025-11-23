# Icon Replacement Guide - Download Real Animated Icons

## Current Status
All lucide-react icons have been removed. You need to download and add custom icon assets.

## Icons Needed

### Education Hub (`EducationHub.tsx`)
1. **Heart Icon** (5x) - For lives/hearts system
   - Size: 24x24px each
   - Format: SVG or PNG with transparency
   - Style: Game-style, animated preferred

2. **Coin/Currency Icon** - For coins display
   - Size: 24x24px
   - Format: SVG or PNG
   - Style: Gold coin, animated spinning preferred

3. **Trophy Icon** - For achievements
   - Size: 32x32px
   - Format: SVG or PNG
   - Style: Shiny trophy, animated glow preferred

4. **Users/People Icon** - For leaderboard
   - Size: 32x32px
   - Format: SVG or PNG

5. **Gift Icon** - For daily rewards
   - Size: 32x32px
   - Format: SVG or PNG
   - Style: Gift box, animated unwrapping preferred

6. **Snowflake Icon** - For streak freeze power-up
   - Size: 24x24px
   - Format: SVG or PNG
   - Style: Animated snowflake

7. **Zap/Lightning Icon** - For XP boost power-up
   - Size: 24x24px
   - Format: SVG or PNG
   - Style: Animated lightning bolt

8. **Shopping Bag Icon** - For shop
   - Size: 32x32px
   - Format: SVG or PNG

9. **Lock Icon** - For locked content
   - Size: 16x16px
   - Format: SVG or PNG

10. **Book Icon** - For lessons
    - Size: 20x20px
    - Format: SVG or PNG

11. **Arrow Left Icon** - For back button
    - Size: 20x20px
    - Format: SVG or PNG

### Achievement System (`AchievementSystem.tsx`)
1. **Flame Icon** - For streak achievements
2. **Calendar Icon** - For week streak
3. **Calendar Days Icon** - For month streak
4. **Baby Icon** - For first lesson
5. **Book Open Icon** - For lessons completed
6. **Graduation Cap Icon** - For scholar
7. **Target Icon** - For perfect score
8. **Sparkles Icon** - For flawless
9. **Map Pin Icon** - For island complete
10. **Globe Icon** - For all islands
11. **Moon Icon** - For night owl
12. **Sun Icon** - For early bird
13. **Zap Icon** - For speed demon
14. **Trophy Icon** - Default achievement
15. **Lock Icon** - Locked achievements

### Progress Tracker (`ProgressTracker.tsx`)
1. **Trophy Icon** - Level badge
2. **Flame Icon** - Streak counter
3. **Star Icon** - XP goal
4. **Book Open Icon** - Lessons goal

### Quiz Battle (`QuizBattle.tsx`)
1. **Clock Icon** - Timer
2. **Flame Icon** - Combo indicator
3. **Timer Icon** - Time freeze power-up
4. **Lightbulb Icon** - Hint power-up
5. **Shield Icon** - Shield power-up
6. **Sword Icon** - Battle characters (2x)

### Lesson Game (`LessonGame.tsx`)
1. **Heart Icon** - Hearts/lives (5x)
2. **X Icon** - Exit button

## Where to Download Premium Icons

### 1. **LottieFiles** (RECOMMENDED for animated icons)
   - URL: https://lottiefiles.com
   - Search: "game icons", "UI icons", "achievement icons"
   - Format: JSON (Lottie animations)
   - Cost: Free tier available, premium for commercial
   - Best for: Animated icons, game-style icons

### 2. **IconScout**
   - URL: https://iconscout.com
   - Search: "game icons", "animated icons", "UI icons"
   - Format: SVG, PNG, Lottie
   - Cost: Free tier, premium plans available
   - Best for: High-quality vector icons, animated icons

### 3. **Flaticon**
   - URL: https://www.flaticon.com
   - Search: "game icons", "achievement icons", "UI icons"
   - Format: SVG, PNG, GIF (animated)
   - Cost: Free with attribution, premium for commercial
   - Best for: Large icon library, animated GIFs

### 4. **Icons8**
   - URL: https://icons8.com
   - Search: "game icons", "animated icons"
   - Format: SVG, PNG, Lottie, animated GIF
   - Cost: Free with attribution, premium available
   - Best for: Animated icons, game-style icons

### 5. **The Noun Project**
   - URL: https://thenounproject.com
   - Search: "game", "achievement", "trophy"
   - Format: SVG
   - Cost: Free with attribution, premium for commercial
   - Best for: Simple, clean icons

### 6. **Game Asset Stores**
   - **Itch.io**: https://itch.io/game-assets/free
   - **OpenGameArt**: https://opengameart.org
   - Search: "UI icons", "game icons", "achievement icons"
   - Format: PNG, SVG
   - Cost: Often free or very cheap
   - Best for: Game-style icons

### 7. **Premium Icon Packs**
   - **UI8**: https://ui8.net (premium, high quality)
   - **Creative Market**: https://creativemarket.com (premium)
   - **GraphicRiver**: https://graphicriver.net (premium)
   - Search: "animated icon pack", "game UI icons"

## Recommended Search Terms

For each icon type, search:
- "animated [icon name] icon"
- "game [icon name] icon"
- "[icon name] lottie animation"
- "UI [icon name] icon"
- "pixel [icon name] icon" (if you want retro style)
- "3D [icon name] icon" (if you want 3D style)

## File Structure

Once downloaded, place icons in:
```
frontend/src/assets/icons/
├── hearts/
│   ├── heart-full.svg
│   └── heart-empty.svg
├── powerups/
│   ├── xp-boost.svg
│   ├── streak-freeze.svg
│   └── heart-refill.svg
├── achievements/
│   ├── trophy.svg
│   ├── flame.svg
│   └── ...
├── ui/
│   ├── coin.svg
│   ├── lock.svg
│   └── ...
└── animations/
    ├── coin-spin.json (Lottie)
    ├── trophy-glow.json (Lottie)
    └── ...
```

## Implementation

After downloading, you'll need to:
1. Import icons as React components or images
2. Replace lucide-react imports
3. Use Lottie for animated icons where available
4. Style icons to match your theme

## Priority Icons (Most Visible)

1. **Hearts** (5x) - Top priority, always visible
2. **Coins** - Top priority, always visible
3. **Trophy** - High priority, achievement system
4. **Power-up icons** (Zap, Snowflake, Heart) - High priority
5. **Achievement icons** - Medium priority
6. **UI icons** (Lock, Arrow, Book) - Lower priority

## Animation Recommendations

For best user experience, prioritize animated versions for:
- Coins (spinning animation)
- Hearts (pulsing when full, fading when empty)
- Trophy (glowing/shining effect)
- Power-ups (idle animations)
- XP burst (particle effect - you already have xp-burst.json)

