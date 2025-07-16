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
- **Page Title**: `text-xl font-bold text-neutral-200`
- **Section Headers**: `text-sm font-semibold text-neutral-200`
- **Card Titles**: `text-sm font-semibold text-neutral-200`
- **Subsection Headers**: `text-xs font-medium text-neutral-200`
- **Labels**: `text-xs font-medium text-neutral-400`
- **Body Text**: `text-xs text-neutral-200`
- **Monospace**: `font-mono` for addresses, code, and technical data

### Font Families
- **Sans-serif**: Default system fonts (Arial, Helvetica, sans-serif)
- **Monospace**: Used for contract addresses, code snippets, and technical data

## Layout Structure

### Main Container
```jsx
<div className="bg-transparent z-10 flex flex-col px-6 py-8 gap-6 mt-12 max-w-7xl mx-auto">
```

### Grid Systems
- **Two-column grid**: `grid grid-cols-1 md:grid-cols-2 gap-3`
- **Responsive grid**: `grid grid-cols-1 lg:grid-cols-2 gap-3`
- **Stats grid**: `grid grid-cols-2 gap-2`

## Component Patterns

### Cards
Main content containers with glass-morphism effect:
```jsx
<div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg p-4 h-full">
```

Secondary cards for nested content:
```jsx
<div className="bg-neutral-800/30 rounded-lg p-3 space-y-3">
```

Compact cards for dense layouts:
```jsx
<div className="bg-neutral-800/30 rounded-lg p-4 space-y-4">
```

### Buttons

#### Tab Buttons
```jsx
// Active state
className="px-3 py-1.5 font-medium text-xs rounded-lg bg-blue-600 text-white"

// Inactive state  
className="px-3 py-1.5 font-medium text-xs rounded-lg bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
```

#### Action Buttons
```jsx
// Primary button
className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"

// Secondary button
className="flex items-center justify-center px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors text-xs font-medium"
```

#### Icon Buttons
```jsx
className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors"
```

### Badges/Status Indicators

#### Risk Level Badges
```jsx
// High Risk
className="bg-red-600/20 text-red-400 border-red-500/50 px-1.5 py-0.5 text-xs rounded-full border"

// Medium Risk
className="bg-orange-600/20 text-orange-400 border-orange-500/50 px-1.5 py-0.5 text-xs rounded-full border"

// Low Risk/Safe
className="bg-green-600/20 text-green-400 border-green-500/50 px-1.5 py-0.5 text-xs rounded-full border"
```

#### Chain/Network Badges
```jsx
className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30"
```

#### Token Symbol Badges
```jsx
className="bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded text-xs border border-purple-500/30 font-mono"
```

### Status Indicators

#### Loading States
```jsx
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
```

#### Progress Bars (Modern Compact)
```jsx
<div className="space-y-2">
  <div className="flex items-center space-x-2 text-blue-400">
    <span className="text-xs">Status text</span>
  </div>
  <div className="w-full bg-neutral-700/50 rounded-full h-1.5 overflow-hidden">
    <div className="h-full transition-all duration-500 ease-out bg-blue-500" style={{width: "75%"}} />
  </div>
</div>
```

#### Status Cards with Icons
```jsx
<div className="flex items-center space-x-2 p-2 rounded border bg-blue-400/10 border-blue-400/20 text-blue-400">
  <svg className="w-3 h-3">...</svg>
  <span className="text-xs">Status message</span>
</div>
```

### Input Fields

#### Address Input with Copy Button
```jsx
<div className="flex items-center bg-neutral-700/40 rounded p-2 border border-neutral-600/30">
  <span className="font-mono text-xs text-neutral-200 break-all flex-1">
    {contractAddress}
  </span>
  <button className="ml-1.5 p-1 text-neutral-400 hover:text-neutral-200 transition-colors">
    <Copy className="w-2.5 h-2.5" />
  </button>
</div>
```

### Data Display

#### Label-Value Pairs (Compact)
```jsx
<div>
  <span className="text-xs text-neutral-400 block mb-1">Label Name</span>
  <p className="text-xs text-neutral-200">Value</p>
</div>
```

#### Compact Grid Layout
```jsx
<div className="grid grid-cols-2 gap-3">
  <div>
    <span className="text-xs text-neutral-400 block mb-1">Label</span>
    <p className="text-xs text-neutral-200 font-medium">Value</p>
  </div>
</div>
```

#### Stats Summary
```jsx
<div className="mt-3 p-3 bg-neutral-700/30 rounded-lg">
  <h4 className="text-xs font-medium text-neutral-200 mb-2">Summary Title</h4>
  <div className="grid grid-cols-2 gap-2 text-xs">
    {/* Stats items */}
  </div>
</div>
```

#### Score Display (Modern)
```jsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <span className="text-lg font-bold text-neutral-200">85/100</span>
    <span className="text-xs font-medium text-green-400">Excellent</span>
  </div>
  <div className="w-full bg-neutral-600/50 rounded-full h-2 overflow-hidden">
    <div className="h-full bg-green-500 transition-all duration-1000" style={{width: "85%"}} />
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
  className="text-blue-400 hover:text-blue-300 text-xs font-medium"
>
  {isExpanded ? "Hide Details" : "Show Details"}
</button>
```

### Copy to Clipboard
Compact copy button component with Lucide icons:
```jsx
<button className="ml-1.5 p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/20 rounded transition-all duration-200">
  {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
</button>
```

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
- Compact spacing: `space-y-3` for main sections, `space-y-2` for sub-sections
- Text sizes: Primarily `text-xs` with selective `text-sm` for important content

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
<div className="text-center py-4">
  <div className="text-red-400 mb-2">
    <svg className="w-8 h-8 mx-auto mb-1">...</svg>
    <p className="text-neutral-400 mb-2 text-xs">Error message</p>
  </div>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
    Retry
  </button>
</div>
```

## Loading States

### Consistent Loading Patterns
- Centered spinners with descriptive text: `h-4 w-4` size
- Skeleton states for content areas with compact spacing
- Loading indicators that match the color scheme
- Progress bars for analysis states with thin `h-1.5` height

## Content Formatting

### Markdown Content
Uses ReactMarkdown with custom styling:
```jsx
<div className="text-neutral-300 text-xs leading-relaxed prose prose-invert prose-xs max-w-none">
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

This compact design system emphasizes:
1. **Density** - Maximum information in minimal space
2. **Consistency** - Reusable compact patterns and color schemes
3. **Clarity** - High contrast despite smaller elements
4. **Modern appearance** - Clean lines and efficient use of space
5. **User feedback** - Clear but compact loading, error, and success states
6. **Multi-column friendly** - Optimized for side-by-side layouts