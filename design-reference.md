# Smart Contract Analyzer - Design Reference

## Overview
The Smart Contract Analyzer uses a modern, simple, sleek, dark-themed design system built with Next.js and Tailwind CSS. The design emphasizes clarity, professional appearance, and user-friendly interactions for blockchain security analysis.

## Color Palette

### Background Colors
- **Primary Background**: `transparent` / `bg-transparent`
- **Card Background**: `bg-neutral-900/20` with backdrop blur (`backdrop-blur-md`)
- **Secondary Card Background**: `bg-neutral-800/30` or `bg-neutral-800/50`
- **Input/Interactive Background**: `bg-neutral-700/30` or `bg-neutral-700/50`

### Text Colors
- **Primary Text**: `text-neutral-200`
- **Secondary Text**: `text-neutral-300`
- **Label Text**: `text-neutral-400`
- **Disabled/Placeholder Text**: `text-neutral-500`

### Status Colors
- **Success/Safe**: `text-green-400`, `bg-green-600/20`, `border-green-500/30`
- **Warning/Medium Risk**: `text-orange-400`, `bg-orange-600/20`, `border-orange-500/50`
- **Error/High Risk**: `text-red-400`, `bg-red-600/20`, `border-red-500/50`
- **Info/Loading**: `text-blue-400`, `bg-blue-600/20`, `border-blue-500/30`
- **Neutral**: `text-neutral-400`, `bg-neutral-600/20`, `border-neutral-500/50`

### Accent Colors
- **Primary Blue**: `bg-blue-600`, `text-blue-400`
- **Purple**: `bg-purple-600/20`, `text-purple-400`
- **Yellow**: `bg-yellow-600/20`, `text-yellow-400`

## Typography

### Font Hierarchy
- **Page Title**: `text-2xl font-bold text-neutral-200`
- **Section Headers**: `text-lg font-semibold text-neutral-200`
- **Card Titles**: `text-base font-semibold text-neutral-200`
- **Subsection Headers**: `text-sm font-medium text-neutral-200`
- **Labels**: `text-xs font-medium text-neutral-400`
- **Body Text**: `text-sm text-neutral-200` or `text-xs text-neutral-200`
- **Monospace**: `font-mono` for addresses, code, and technical data

### Font Families
- **Sans-serif**: Default system fonts (Arial, Helvetica, sans-serif)
- **Monospace**: Used for contract addresses, code snippets, and technical data

## Layout Structure

### Main Container
```jsx
<div className="bg-transparent z-10 flex flex-col px-8 py-12 gap-8 mt-16 max-w-7xl mx-auto">
```

### Grid Systems
- **Two-column grid**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **Responsive grid**: `grid grid-cols-1 lg:grid-cols-2 gap-4`
- **Stats grid**: `grid grid-cols-2 gap-2`

## Component Patterns

### Cards
Main content containers with glass-morphism effect:
```jsx
<div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg p-8 h-full">
```

Secondary cards for nested content:
```jsx
<div className="bg-neutral-800/30 rounded-lg p-3">
```

### Buttons

#### Tab Buttons
```jsx
// Active state
className="px-4 py-2 font-medium text-sm rounded-lg bg-blue-600 text-white"

// Inactive state  
className="px-4 py-2 font-medium text-sm rounded-lg bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
```

#### Action Buttons
```jsx
// Primary button
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"

// Secondary button
className="flex items-center justify-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors text-xs font-medium"
```

#### Icon Buttons
```jsx
className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded-lg transition-colors"
```

### Badges/Status Indicators

#### Risk Level Badges
```jsx
// High Risk
className="bg-red-600/20 text-red-400 border-red-500/50 px-2 py-1 text-xs rounded-full border"

// Medium Risk
className="bg-orange-600/20 text-orange-400 border-orange-500/50 px-2 py-1 text-xs rounded-full border"

// Low Risk/Safe
className="bg-green-600/20 text-green-400 border-green-500/50 px-2 py-1 text-xs rounded-full border"
```

#### Chain/Network Badges
```jsx
className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30"
```

#### Token Symbol Badges
```jsx
className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/30 font-mono"
```

### Status Indicators

#### Loading States
```jsx
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
```

#### Status Cards with Icons
```jsx
<div className="flex items-center space-x-2 p-3 rounded-lg border bg-blue-400/10 border-blue-400/20 text-blue-400">
  <svg className="w-4 h-4">...</svg>
  <span>Status message</span>
</div>
```

### Input Fields

#### Address Input with Copy Button
```jsx
<div className="flex items-center bg-neutral-700/30 rounded p-2">
  <span className="font-mono text-xs text-neutral-200 break-all flex-1">
    {contractAddress}
  </span>
  <button className="ml-2 p-1 text-neutral-400 hover:text-neutral-200 transition-colors">
    {/* Copy icon */}
  </button>
</div>
```

### Data Display

#### Label-Value Pairs
```jsx
<div>
  <label className="block text-xs font-medium text-neutral-400 mb-1">
    Label Name
  </label>
  <p className="text-xs text-neutral-200">Value</p>
</div>
```

#### Stats Summary
```jsx
<div className="mt-4 p-3 bg-neutral-700/30 rounded-lg">
  <h4 className="text-sm font-medium text-neutral-200 mb-2">Summary Title</h4>
  <div className="grid grid-cols-2 gap-2 text-xs">
    {/* Stats items */}
  </div>
</div>
```

## Interactive Elements

### Tab Navigation
Uses conditional rendering with show/hide instead of mounting/unmounting to prevent re-rendering:
```jsx
<div className={activeTab === "tabName" ? "block" : "hidden"}>
  {/* Tab content */}
</div>
```

### Expandable Cards
```jsx
const [isExpanded, setIsExpanded] = useState(false);

<button 
  onClick={() => setIsExpanded(!isExpanded)}
  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
>
  {isExpanded ? "Hide Details" : "Show Details"}
</button>
```

### Copy to Clipboard
Custom copy button component with feedback states and SVG icons for copy/success states.

## Animation & Transitions

### Hover Effects
- `transition-colors` for color changes
- `hover:bg-` states for background changes
- `hover:text-` states for text color changes

### Loading Animations
- `animate-spin` for spinners
- Rounded full borders with `border-b-2` for loading indicators

## Responsive Design

### Breakpoints
- `md:` - Medium screens and up
- `lg:` - Large screens and up
- `sm:` - Small screens (used sparingly)

### Responsive Patterns
- Grid columns: `grid-cols-1 md:grid-cols-2`
- Flex direction: `flex-col sm:flex-row`
- Text sizes adapt but generally stay consistent

## Accessibility Features

### Interactive Elements
- Proper hover states for all clickable elements
- `title` attributes for icon buttons
- `target="_blank" rel="noopener noreferrer"` for external links

### Color Contrast
- High contrast between background and text
- Clear visual hierarchy with opacity variations
- Status colors are distinct and meaningful

## Error States

### Error Display Pattern
```jsx
<div className="text-center py-8">
  <div className="text-red-400 mb-4">
    <svg className="w-12 h-12 mx-auto mb-2">...</svg>
    <p className="text-neutral-400 mb-4">Error message</p>
  </div>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
    Retry
  </button>
</div>
```

## Loading States

### Consistent Loading Patterns
- Centered spinners with descriptive text
- Skeleton states for content areas
- Loading indicators that match the color scheme

## Content Formatting

### Markdown Content
Uses ReactMarkdown with custom styling:
```jsx
<div className="text-neutral-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
</div>
```

### Code Blocks
```jsx
<code className="bg-neutral-700/50 px-1 py-0.5 rounded text-xs font-mono text-neutral-200">
  {code}
</code>
```

This design system emphasizes:
1. **Consistency** - Reusable patterns and color schemes
2. **Clarity** - High contrast and clear hierarchy
3. **Professional appearance** - Modern glassmorphism and dark theme
4. **User feedback** - Clear loading, error, and success states
5. **Accessibility** - Proper hover states and semantic markup