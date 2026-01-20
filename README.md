# OpenValoBook

Open-source desktop application for creating and visualizing Valorant strategies.

## ✨ Features

- 🎨 **Interactive Strategy Editor** - Canvas-based drawing tool with Konva.js
- 🗺️ **12 Competitive Maps** - All official Valorant maps with correct orientations
- 🖊️ **Drawing Tools** - Pen, line, arrow, circle, rectangle, and text tools
- 🎨 **Color System** - Valorant-themed colors + HEX selector
- ↩️ **Undo/Redo** - 50-state history system with keyboard shortcuts
- 🔍 **Zoom & Pan** - Mouse wheel zoom (50%-300%) and interactive navigation
- ⚔️ **Attack/Defense** - Automatic 180° map rotation when switching sides
- ✏️ **Element Editing** - Properties panel for color, stroke, text, and icons
- 💻 **Desktop App** - Built with Electron for Windows, macOS, and Linux
- ⚡ **CI/CD** - Automatic builds for all platforms via GitHub Actions

## 🚀 Getting Started

1. **Clone & Install**
```bash
git clone https://github.com/MauAlvarado43/open-valobook.git
cd open-valobook
npm install
```

2. **Download Assets**
```bash
npm run update:all
```

3. **Run Dev Environment**
```bash
npm run dev
```
*Starts both Next.js and Electron automatically.*

## 🛠️ Scripts (npm)

- `npm run dev`: Full development environment (Next.js + Electron).
- `npm run build`: Build web frontend and package Electron executable.
- `npm run release`: Build and publish a new version to GitHub.
- `npm run update:assets`: Download game icons and maps.
- `npm run update:stats`: Scrape latest ability stats from the wiki.

## 📂 Windows Utilities (bin/)

- `bin\dev.bat`: Fast entry to dev mode.
- `bin\build.bat`: Build for distribution (.exe).
- `bin\update-assets.bat`: Sync latest game data.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `V` | Select Mode |
| `P` | Pen / Pencil |
| `L` | Line |
| `A` | Arrow |
| `C` | Circle |
| `R` | Rectangle |
| `T` | Text |
| `I` | Marker Icon |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `S` / `Ctrl + S` | Save to Library |
| `Ctrl + E` | Export as PNG |
| `Shift + Esc` | Clear Canvas (with confirmation) |
| `Delete` | Remove selected elements |

## 📦 Releases & Versioning

This project uses **GitHub Actions** for automated releases.
1. Update `"version"` in `package.json`.
2. Push to `main`.
3. A new Release with binaries for Windows, macOS, and Linux will be created automatically.

## 🔮 Future Vision (Roadmap)
- **The "Book" Experience**: Group strategies into coherent books with chronological steps/phases.
- **P2P Collaboration**: Multi-user sharing without heavy server dependencies using WebRTC.
- **Role-Based Focus**: Filter strategies to highlight individual player responsibilities.

For full details, see the [Development Roadmap](docs/ROADMAP.md).

## ⚠️ Disclaimer

OpenValoBook isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

All game assets are property of Riot Games and are used for educational and non-commercial purposes only.
