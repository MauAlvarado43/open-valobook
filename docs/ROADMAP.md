# OpenValoBook - Development Roadmap

## Project Overview

OpenValoBook is an open-source desktop application for creating and visualizing Valorant strategies. It enables players and teams to plan tactics through an interactive map editor with support for agents, abilities, routes, and utilities. Built with Electron, it runs natively on Windows, macOS, and Linux.

## Core Objectives

- Provide a free and open-source desktop app for strategy planning
- Facilitate strategy planning for competitive and casual teams
- Offer an intuitive and easy-to-use interface
- Enable local strategy management with export/import capabilities
- Optional cloud sync (Google Drive, OneDrive) for cross-device access

## Features

### Phase 1: Core Functionality ✅ IN PROGRESS

**Map Editor**
- ✅ Visualization of all official Valorant maps (12 competitive maps)
- ✅ Zoom and pan navigation
- ✅ Attack/Defense side selector with map rotation
- Layer system (base map, utilities, agents, annotations)

**Drawing Tools**
- ✅ Lines and arrows (movement routes)
- ✅ Basic shapes (circles, rectangles)
- ✅ Freehand pen tool
- ✅ Text annotations
- ✅ Undo/redo system
- ✅ Element selection and editing
- ✅ Properties panel (color, stroke width, text editing)

**Agent System**
- Icons for all agents (28 downloaded)
- Drag & drop placement
- Side indicator (attack/defense)
- Customizable colors

### Phase 2: Abilities and Utilities ✅ MOSTLY COMPLETE

**Ability Library**
- ✅ Ability icons per agent (100+ downloaded)
- ✅ Visual indicators (smoke, wall, molly, flash, etc.)
- ✅ Customizable effect areas with editable handles
- ✅ Curved-wall system with configurable tension and intermediate points
- ✅ Guided-path system for free-form trajectories
- Utility duration and timing

**Advanced Layer System**
- Timeline for strategy sequences
- Show/hide individual layers
- Utility execution order

### Phase 3: File Management and Export

**Strategy Management**
- Save strategies locally (.ovb format)
- Load saved strategies
- Name and categorize (attack/defense, eco/full buy)
- Export as PNG/JPG image
- Export as PDF
- Tag system for organization

**Import/Export**
- Share strategies as files
- Drag & drop to import
- Batch export multiple strategies

### Phase 4: Advanced Features

**Advanced Editor**
- Route animations
- Frame system (step-by-step)
- Round timer
- Crosshair placement indicators

**Cloud Sync (Optional)**
- Google Drive integration
- OneDrive integration
- Automatic backup
- Cross-device synchronization

## Tech Stack

### Desktop Application (Electron)

- **Framework**: Electron + Next.js 14 with App Router
- **Language**: TypeScript
- **Canvas**: Konva.js (react-konva) for canvas manipulation
- **UI/UX**:
  - Tailwind CSS for styling
  - lucide-react for icons
  - Framer Motion for animations (optional)
- **State**: Zustand for global state management
- **File System**: Node.js fs module for local file operations
- **Data Format**: JSON for strategy files (.ovb)
- **Export**: html2canvas or Konva export for image generation

### Optional Cloud Sync

- **Google Drive API**: For cloud backup and sync
- **OneDrive API**: Alternative cloud provider
- **Conflict Resolution**: Last-write-wins or manual merge

### DevOps & Distribution

- **Build**: electron-builder for packaging
- **Platforms**: Windows (.exe), macOS (.dmg), Linux (.AppImage)
- **Updates**: electron-updater for auto-updates
- **CI/CD**: GitHub Actions for automated builds
- **Distribution**: GitHub Releases

## Project Structure

```txt
OpenValoBook/
├── src/
│   ├── app/
│   │   ├── (routes)/          # App Router pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── StrategyCanvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── MapSelector.tsx
│   │   ├── AgentSelector.tsx
│   │   ├── AgentIcon.tsx
│   │   ├── AbilityIcon.tsx
│   │   ├── DrawingElementRenderer.tsx
│   │   ├── ElementPropertiesPanel.tsx
│   │   └── KonvaWarningSuppress.tsx
│   ├── lib/
│   │   ├── services/          # API clients
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Helper functions
│   └── types/                 # TypeScript definitions
│
├── public/
│   └── assets/
│       ├── maps/
│       ├── agents/
│       └── abilities/
│
├── scripts/                   # Maintenance scripts
│   ├── scrape-assets.mjs
│   └── update-maps.mjs
│
├── prisma/
│   └── schema.prisma
│
├── docs/
│   ├── ROADMAP.md
│   ├── GUIDELINES.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── USER_GUIDE.md
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Development Roadmap

### Milestone 1: MVP ✅ COMPLETED

- [x] Project setup (Next.js 14 + TypeScript + Tailwind CSS)
- [x] Implement canvas with Konva.js (react-konva)
- [x] Load and display Valorant maps (12 competitive maps)
- [x] Drawing system (pen/freehand, line, arrow, circle, rectangle, text)
- [x] Color selector (7 Valorant-themed colors)
- [x] Map rotation system (correct orientations)
- [x] Attack/Defense side switching with 180° map rotation
- [x] Zoom functionality (50%-300% with mouse wheel)
- [x] Pan navigation (drag in select mode)
- [x] Undo/Redo system (50-state history)
- [x] Keyboard shortcuts (Ctrl+Z, Ctrl+Alt+Z, Delete)
- [x] Element selection (Ctrl+click, Shift+click for multi-select)
- [x] Selection box (Shift+drag for area selection)
- [x] Element properties panel (color, stroke width, text, font size)
- [x] Drag selected elements
- [x] Hover effects (only in select mode)
- [x] Asset download system (28 agents, 23 maps, 100+ abilities)
- [x] Electron desktop app configuration
- [x] Development scripts (bin/ folder with .bat and .sh)
- [x] Place agent icons
- [x] Place ability icons

### Milestone 1.5: Advanced Ability System 🚧 WIP

- [x] Agent icon placement with side indicators
- [x] Agent selector UI with all 28 agents
- [x] Ability icon placement system
- [x] Ability selector (filtered by agent)
- [x] Visual effect indicators (smoke, wall, area, path)
- [x] Curved-wall system with configurable intermediate points
- [x] Tension control (straight vs curved lines)
- [x] Ability-specific configurations (Deadlock Annihilation, Harbor High Tide)
- [x] Editable handles for all ability shapes
- [x] Guided-path system for free-form trajectories

### Milestone 2: Agent & Ability System

- [x] Agent icon placement on canvas
- [x] Agent selector UI
- [x] Ability icon placement
- [x] Ability selector (filtered by agent)
- [x] Visual effect indicators (smoke radius, wall placement, etc.)
- [ ] Duration and timing indicators

### Milestone 3: File Management

- [ ] Save strategy to local file (.ovb format)
- [ ] Load strategy from file
- [ ] Recent files list
- [ ] Auto-save functionality
- [ ] File metadata (name, description, tags)
- [ ] Strategy thumbnail generation

### Milestone 4: Export & Import

- [ ] Export as PNG/JPG image
- [ ] Export as PDF
- [ ] Copy to clipboard
- [ ] Import from file (drag & drop)
- [ ] Batch export
- [ ] Export settings (resolution, quality)

### Milestone 5: Cloud Sync (Optional)

- [ ] Google Drive authentication
- [ ] Auto-sync to cloud
- [ ] Conflict resolution UI
- [ ] Manual sync trigger
- [ ] Sync status indicator
- [ ] OneDrive integration (alternative)

### Milestone 6: Polish and Distribution

- [x] UX improvements (cursor pointer, selection box, properties panel)
- [ ] Performance optimization
- [ ] Testing (unit, integration, e2e)
- [ ] Complete documentation
- [ ] Tutorials and guides

## Data Models

### Strategy File (.ovb format - JSON)

```typescript
interface StrategyFile {
  version: string;
  metadata: {
    title: string;
    description: string;
    map: MapName;
    side: 'attack' | 'defense';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    thumbnail?: string; // base64 or path
  };
  canvasData: CanvasData;
}
```

### Canvas Data

```typescript
interface CanvasData {
  version: string;
  mapName: MapName;
  side: 'attack' | 'defense';
  elements: (AgentPlacement | AbilityPlacement | DrawingElement)[];
}
```

### App Settings (localStorage)

```typescript
interface AppSettings {
  recentFiles: string[]; // file paths
  defaultExportFormat: 'png' | 'jpg' | 'pdf';
  autoSave: boolean;
  autoSaveInterval: number; // minutes
  cloudSync: {
    enabled: boolean;
    provider: 'gdrive' | 'onedrive' | null;
    lastSync: Date;
  };
  theme: 'dark' | 'light';
}
```

## Required Assets

### Graphic Assets

**Maps**: High-quality images of all official maps

- Ascent, Bind, Haven, Split, Icebox, Breeze, Fracture, Pearl, Lotus, Sunset, Abyss
- Overhead view (top-down)
- Different height levels when applicable

**Agent Icons**: ~25 current agents + future

- SVG or PNG format with transparency
- Simplified version for canvas

**Ability Icons**: ~100+ abilities

- Organized by agent
- Visual indicators (smoke, wall, etc.)

**UI Elements**: Custom cursors, buttons, etc.

### Asset Sources

- Riot Games Developer Portal (verify license)
- Community assets with appropriate license
- Create own assets when necessary

## Legal Considerations

- **Trademark**: Valorant is a Riot Games trademark
- **Fair Use**: Clearly state this is a fan project
- **Disclaimer**: "OpenValoBook isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties"
- **Assets**: Only use resources with permission or create own
- **Project License**: MIT or GPL-3.0

## Contribution and Community

- **Open Source**: Public code on GitHub
- **Contributions**: Clear guidelines for collaborators
- **Discord/Community**: Channel for feedback and discussions
- **Public Roadmap**: Transparency in development
- **Issues**: Issue system for bugs and features

## Success Metrics

- [ ] 1000+ downloads in first month
- [ ] 5000+ strategies created
- [ ] Average strategy creation time < 5 minutes
- [ ] 80%+ user satisfaction
- [ ] Active GitHub community with contributions
- [ ] Multi-platform support (Windows, macOS, Linux)

## Next Steps

1. **Project Setup**
   - Initialize Git repository
   - Configure folder structure
   - Setup React + TypeScript + Vite/Next.js
   - Install basic dependencies

2. **Visual Prototype**
   - Design wireframes in Figma
   - Define color palette and typography
   - Create mockups of main screens

3. **Technical Research**
   - Test Konva.js vs Fabric.js
   - Evaluate best way to load/render maps
   - Define canvas data structure

4. **Asset Collection**
   - Download Valorant maps
   - Create/collect agent icons
   - Organize assets in folders

---

**Ready to begin? The next step would be to initialize the project with the chosen stack and create the first canvas editor prototype.**
