# Portfolio Development Instructions

## Core Principles

- **Always use SSG/SSR unless `use client` is required**
- **Only use client components when absolutely necessary** (e.g., sidebar toggles, theme switchers, interactive elements)
- **Never use fixed/static pixel sizes for layout**, except for small elements like avatars or icons
- **Use responsive Tailwind classes, rem, %, minmax, or flex/grid utilities**

## Layout Structure

### Three-Area Layout Implementation:

1. **Left Area**: Main info/profile
   - Sticky/fixed on large screens
   - Drawer or top bar on mobile
   - Contains profile information, skills, languages, contact details

2. **Center Area**: Main content
   - Always scrollable
   - Stretches for all devices
   - Contains the main page content

3. **Right Area**: Sidebar navigation
   - Sticky/fixed on large screens
   - Bottom bar or hidden on mobile
   - Contains navigation icons and social links

## Technical Requirements

### CSS and Styling
- **Structure layout using grid or flex utilities in Tailwind**
- **Don't use `position: absolute`** unless needed for overlays
- **Use CSS variables from globals.css** for background, foreground, and fonts
- **All areas and content must be fully responsive and accessible** on laptops, tablets, mobiles

### Assets and Organization
- **All static assets (images, icons) must go in `/public`**
- **Place reusable components in `/src/components`** for organization
- **No code outside `/src/app`** except shared libs, types, config, or `/components`

### HTML and Accessibility
- **Use semantic HTML** (`aside`, `nav`, `main`) 
- **Add alt/aria attributes** for accessibility
- **Test on all screen sizes** and ensure zero overflow or unwanted scroll

## Current Implementation

### Layout Structure
```
├── ProfileSidebar (Left)
│   ├── Profile Image
│   ├── Name and Title
│   ├── Contact Information
│   ├── Core Skills
│   └── Languages
├── Main Content (Center)
│   └── Page-specific content
└── NavSidebar (Right)
    ├── Navigation buttons
    └── Social links
```

### Grid Configuration
- **Mobile**: `grid-cols-1` (single column)
- **Desktop**: `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]`
  - Left: min 240px, max 18vw
  - Center: 1fr (takes remaining space)
  - Right: min 60px, max 6vw

### Responsive Behavior
- **Mobile/Tablet**: Only center content visible
- **Desktop (lg+)**: All three areas visible
- **Sidebars**: Hidden on mobile with `hidden lg:flex`

## File Structure
```
src/
├── app/
│   ├── layout.tsx (Main layout with grid)
│   ├── page.tsx (Home page content)
│   └── globals.css (CSS variables and theme)
├── components/
│   ├── ProfileSidebar.tsx (Left sidebar)
│   └── NavSidebar.tsx (Right sidebar)
└── public/
    └── profile.jpg (Profile image)
```

## CSS Variables Used
- `--background`: Main background color
- `--foreground`: Main text color
- `--font-geist-sans`: Primary font
- `--font-geist-mono`: Monospace font

## Component Guidelines
- **ProfileSidebar**: Server component (no interactivity)
- **NavSidebar**: Client component (has interactive state)
- **Main content**: Server component by default
- **All components**: Use Tailwind utilities, semantic HTML, and responsive design
