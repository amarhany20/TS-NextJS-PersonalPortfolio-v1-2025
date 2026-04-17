# Theme Registry Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-12-17  
**Status:** Active

## Overview

The theme system allows switching between curated visual presets without code changes. Themes update CSS variables, component tokens, and color palettes across both public and admin surfaces instantly.

## Architecture

### Theme Registry

Themes are defined in `src/themes/index.ts` and registered in the `THEME_REGISTRY` array. Each theme includes:

- **Metadata**: ID, name, description, author, version, tags
- **Visual Preview**: Gradient preview for theme gallery
- **Design Tokens**: Color tokens for backgrounds, text, accents, etc.

### Available Themes

1. **Professional Dark** (`professional-dark`)
   - Default theme
   - High-contrast dark surfaces
   - Optimized for dashboards and hero copy
   - Tags: `dark`, `professional`, `default`

2. **Modern Gradient** (`modern-gradient`)
   - Vibrant purples, blues, and pinks
   - Glass panel effects
   - Bold campaign aesthetic
   - Tags: `gradient`, `vibrant`

3. **Minimal Light** (`minimal-light`)
   - Clean light surfaces
   - Gentle blue accents
   - Optimized for case studies and resumes
   - Tags: `light`, `minimal`

## Usage

### Applying Themes

**Via Admin Settings:**
1. Navigate to `/admin/settings/theme`
2. Browse available themes in the gallery
3. Click "Apply" on desired theme
4. Theme applies instantly across the site

**Via Setup Wizard:**
1. During initial setup, select a theme in Step 4
2. Theme is saved to `Settings.theme`
3. Applied automatically after setup completion

**Programmatically:**
```typescript
import { ThemeService } from '@/server/services/ThemeService';

// Apply a theme
await ThemeService.applyTheme('minimal-light');

// List all themes
const { themes, activeThemeId } = await ThemeService.listThemes();
```

### Theme Tokens

Each theme provides CSS variables that are injected into the root HTML element:

```css
:root {
  --background: #111216;
  --foreground: #f5f5f7;
  --sidebar: #181a1b;
  --accent-primary: #ffd600;
  --accent-secondary: #058ddb;
  --accent-muted: #22242b;
  --text-secondary: #bdbdbd;
  --card-bg: #22242b;
  --border: #242424;
  --success: #38d996;
  --danger: #fa5252;
  --warning: #fcc419;
}
```

Components use these variables via Tailwind's CSS variable syntax:
```tsx
<div className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)]">
  Content
</div>
```

## API

### ThemeService

**`listThemes()`**
- Returns all available themes with `isActive` flag
- Used by admin theme gallery

**`applyTheme(themeId: string)`**
- Applies a theme by updating `Settings.theme`
- Validates theme exists
- Returns theme summary

### Theme Registry Functions

**`listThemes()`**
- Returns all theme definitions

**`getThemeById(themeId?: string | null)`**
- Retrieves a theme by ID
- Returns `undefined` if not found

**`getThemeSummary(themeId?: string | null)`**
- Returns lightweight theme summary (no tokens)
- Falls back to default theme if not found

**`listThemeSummaries()`**
- Returns summaries for all themes

## Adding New Themes

1. **Define Theme:**
```typescript
const myTheme: ThemeDefinition = {
  id: 'my-theme',
  name: 'My Theme',
  description: 'Description of theme',
  author: 'Your Name',
  version: '1.0.0',
  tags: ['tag1', 'tag2'],
  accent: '#ff0000',
  previewGradient: 'linear-gradient(...)',
  tokens: {
    background: '#000000',
    foreground: '#ffffff',
    // ... other tokens
  },
};
```

2. **Add to Registry:**
```typescript
const THEME_REGISTRY: ThemeDefinition[] = [
  professionalDark,
  modernGradient,
  minimalLight,
  myTheme, // Add here
];
```

3. **Test:**
- Apply theme via admin settings
- Verify all pages render correctly
- Check visual regression checklist

## Integration Points

- **Setup Wizard**: Theme selection in Step 4
- **Admin Settings**: Theme gallery at `/admin/settings/theme`
- **Root Layout**: Theme CSS variables injected via `data-theme` attribute
- **Settings Repository**: Theme ID stored in `Settings.theme` field

## Best Practices

1. **Token Consistency**: Ensure all themes define the same token keys
2. **Contrast Ratios**: Maintain WCAG AA contrast ratios for accessibility
3. **Preview Gradients**: Use representative gradients that showcase theme colors
4. **Versioning**: Increment version when updating theme tokens
5. **Testing**: Run visual regression tests after theme changes

