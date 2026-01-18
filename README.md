# OpenValoBook

Open-source desktop application for creating and visualizing Valorant strategies.

## Features

- 🎨 **Interactive Strategy Editor** - Canvas-based drawing tool with Konva.js
- 🗺️ **12 Competitive Maps** - All official Valorant maps with correct orientations
- 🖊️ **Drawing Tools** - Pen, line, arrow, circle, rectangle, and text tools
- 🎨 **Color System** - 7 Valorant-themed colors for strategy elements
- ↩️ **Undo/Redo** - 50-state history system with keyboard shortcuts
- 🔍 **Zoom & Pan** - Mouse wheel zoom (50%-300%) and drag navigation
- ⚔️ **Attack/Defense** - Automatic 180° map rotation when switching sides
- ✏️ **Element Editing** - Properties panel for color, stroke width, text, and font size
- 🎯 **Multi-Selection** - Ctrl+click, Shift+click, and selection box (Shift+drag)
- 💻 **Desktop App** - Built with Electron for Windows, macOS, and Linux
- ⚡ **Open Source** - Free forever, built by the community

## Tech Stack

- **Framework**: Next.js 14 (App Router) + Electron
- **Language**: TypeScript (strict mode, no 'any' types)
- **Styling**: Tailwind CSS 3.4
- **Canvas**: Konva.js (react-konva 18)
- **State Management**: Zustand
- **Icons**: lucide-react
- **Desktop**: Electron 39 + electron-builder

## Project Structure

```txt
OpenValoBook/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/
│   │   └── Editor/       # Canvas editor components
│   │       ├── StrategyCanvas.tsx        # Main canvas with Konva
│   │       ├── Toolbar.tsx               # Tools and color selector
│   │       ├── MapSelector.tsx           # Map selection dropdown
│   │       ├── DrawingElementRenderer.tsx # Konva shape renderer
│   │       └── ElementPropertiesPanel.tsx # Selection properties editor
│   ├── lib/
│   │   └── store/        # Zustand state management
│   │       └── editorStore.ts            # Canvas state with undo/redo
│   └── types/
│       └── strategy.ts   # TypeScript definitions
├── public/
│   └── assets/           # Game assets
│       ├── agents/       # 28 agent icons + abilities
│       ├── maps/         # 23 map images (12 competitive)
│       └── abilities/    # 100+ ability icons
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script
├── bin/                 # Executable scripts
│   ├── dev.bat/sh       # Start Next.js dev server
│   ├── electron-dev.bat/sh  MauAlvarado43/open-valobook.git
cd open-valobook
```

2. Install dependencies

```bash
npm install
```

3. Download game assets

```bash
npm run update:all
```

4. Run development server

```bash
npm run dev
# Server runs on http://localhost:3001
```

5. In a new terminal, launch Electron

```bash
npm run electron:dev
```

### Quick Start with Scripts

**Windows:**
```bash
bin\dev.bat           # Start Next.js dev server
bin\electron-dev.bat  # Open Electron app
bin\build-exe.bat     # Build .exe installer
```

**macOS/Linux:**
```bash
./bin/dev.sh           # Start Next.js dev server
./bin/electron-dev.sh  # Open Electron app
./bin/build-exe.sh     # Build installer
```
### Development
- `npm run dev` - Start Next.js dev server (localhost:3001)
- `npm run electron:dev` - Launch Electron app in development mode
- `npm run lint` - Run ESLint

### Building
- `npm run build` - Build Next.js for production (static export)
- `npm run electron:build` - Build Electron app
- `npm run electron:pack` - Package app (no installer)
- `npm run electron:dist` - Create distributable installers

### Assets
- `npm run update:all` - Download all Valorant assets
- `npm run update:agents` - Update agent icons and abilities
- `npm run update:maps` - Update map images

## Keyboard Shortcuts

- `Ctrl+Z` - Undo
- `Ctrl+Alt+Z` - Redo
- `Delete` - Remove selected elements
- `Ctrl+Click` - Switch to select mode and select element
- `Shift+Click` - Multi-select elements
- `Shift+Drag` - Selection box (area select)
- `Mouse Wheel` - Zoom in/out

## Usage

1. **Select a Map**: Choose from 12 competitive maps (Abyss, Ascent, Bind, Breeze, Corrode, Fracture, Haven, Icebox, Lotus, Pearl, Split, Sunset)
2. **Choose Side**: Toggle between Attack and Defense (map rotates 180°)
3. **Select Tool**: Pick from Select, Pen, Line, Arrow, Circle, Rectangle, or Text
4. **Choose Color**: Select from 7 Valorant-themed colors
5. **Draw Strategy**: Click and drag to create elements
6. **Edit Elements**: 
   - Select elements with Ctrl+Click or use Select tool
   - Multi-select with Shift+Click or Shift+Drag box
   - Use properties panel to change color, stroke width, text, font size
7. **Navigate**: 
   - Zoom with mouse wheel
   - Pan by dragging in Select mode
8. **Clear Canvas**: Use Clear Canvas button to start over
```bash
npm run update:all
```

4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run update:all` - Download latest Valorant assets
- `npm run update:agents` - Update agent icons and abilities
- `npm run update:maps` - Update map images

## Contributing

See [docs/GUIDELINES.md](docs/GUIDELINES.md) for development guidelines and coding standards.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the complete development roadmap.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Disclaimer

OpenValoBook isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

All game assets are property of Riot Games and are used for educational and non-commercial purposes only.
