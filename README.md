# OpenValoBook

Open-source Valorant strategy planner and sharing platform.

## Features

- 🎨 **Interactive Strategy Editor** - Canvas-based drawing tool for creating strategies
- 🗺️ **All Maps Supported** - Complete coverage of Valorant maps
- 👥 **Agent System** - Full agent roster with abilities
- 🌍 **Share & Discover** - Community platform for sharing strategies
- 🌐 **Multilingual** - Support for multiple languages
- ⚡ **Open Source** - Free forever, built by the community

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: Konva.js (planned)
- **Database**: PostgreSQL + Prisma (planned)
- **Deployment**: Vercel (planned)

## Project Structure

```txt
OpenValoBook/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and services
│   └── types/           # TypeScript type definitions
├── public/
│   └── assets/          # Game assets (agents, maps, abilities)
├── scripts/             # Maintenance scripts
├── prisma/              # Database schema
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/openvalobook.git
cd openvalobook
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
