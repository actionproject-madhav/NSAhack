# 📸 Image Placeholders - What to Add

## Landing Page Floating Images

Add these images to `/Users/madhav/Desktop/FinLit/NSAhack/frontend/public/`:

### 1. **dashboard-preview.png**
- **Size:** 1200x800px (landscape)
- **Content:** Screenshot of your dashboard
- **Position:** Center, main focal point
- **Animation:** Fade in from bottom

### 2. **floating-element-1.png**
- **Size:** 300x300px (square)
- **Content:** Stock chart preview or portfolio card
- **Position:** Top left, floating
- **Animation:** Float up and down gently, slide in from left

### 3. **floating-element-2.png**
- **Size:** 400x250px (landscape)
- **Content:** Trading interface or stock details
- **Position:** Top right, floating
- **Animation:** Float up and down gently, slide in from right

### 4. **floating-element-3.png**
- **Size:** 250x250px (square)
- **Content:** AI chat widget or recommendations
- **Position:** Bottom left, floating
- **Animation:** Float up and down gently, slide in from left

### 5. **floating-element-4.png**
- **Size:** 350x200px (landscape)
- **Content:** Market data or portfolio performance
- **Position:** Bottom right, floating
- **Animation:** Float up and down gently, slide in from right

## Current Placeholder Code

```tsx
{/* PLACEHOLDER: dashboard-preview.png */}
<div className="bg-gray-100 dark:bg-gray-900 rounded-2xl...">
  <p>📸 Image Placeholder</p>
  <p>dashboard-preview.png</p>
</div>
```

## How to Replace:

Once you have the images, update `LandingPage.tsx`:

```tsx
// Change from:
<div className="bg-gray-100 dark:bg-gray-900...">
  <p>📸 Image Placeholder</p>
</div>

// To:
<img 
  src="/dashboard-preview.png" 
  alt="Dashboard Preview"
  className="w-full h-auto rounded-2xl shadow-2xl"
/>
```

## Animation Classes Used:

- `animate-float` - Gentle up/down motion (6s loop)
- `animate-float-delayed` - Same but delayed 1s
- `initial={{ opacity: 0, y: 40 }}` - Framer Motion fade in
- `animate={{ opacity: 1, y: 0 }}` - Framer Motion animate to position

## Robinhood Color Scheme

### Only Use These Colors:
- Background Light: `#FFFFFF`
- Background Dark: `#000000`
- Text Light: `#000000`
- Text Dark: `#FFFFFF`
- Gray: `#6E6E6E`
- Gains: `#00C805` (Robinhood green)
- Losses: `#FF5000` (Robinhood red)

### NO Other Colors:
- ❌ No blue
- ❌ No purple
- ❌ No teal
- ❌ No yellow (except warnings)
- ❌ No gradients


