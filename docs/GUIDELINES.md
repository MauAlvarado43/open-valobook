# OpenValoBook Development Guidelines

## Table of Contents
- [General Principles](#general-principles)
- [Code Standards](#code-standards)
- [Project Structure](#project-structure)
- [Naming Conventions](#naming-conventions)
- [Documentation](#documentation)
- [Scripts & Automation](#scripts--automation)
- [Internationalization (i18n)](#internationalization-i18n)
- [Git Workflow](#git-workflow)
- [Performance](#performance)
- [Security](#security)

---

## General Principles

### Core Values
- **Simplicity**: Prefer simple, readable solutions over clever code
- **Modularity**: Build reusable, single-responsibility components
- **Maintainability**: Write code that others can easily understand and modify
- **Performance**: Optimize where it matters, profile before optimizing
- **Accessibility**: Ensure the app is usable by everyone

### Language
- **All code must be written in English**: variables, functions, comments, commit messages
- **Documentation in English**: READMEs, guides, API docs
- **User-facing content**: Support multiple languages via i18n system (see [Internationalization](#internationalization-i18n))

---

## Code Standards

### TypeScript/JavaScript

#### General Rules
```typescript
// ✅ GOOD: Clear, descriptive names
const isStrategyPublic = strategy.visibility === 'public';
const activeAgents = agents.filter(agent => agent.isSelected);

// ❌ BAD: Unclear abbreviations, emojis
const isPub = strat.vis === 'pub';
const activeAgs = ags.filter(a => a.isSel); // 🎯 don't use emojis
```

#### Formatting
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings, backticks for templates
- **Semicolons**: Always use semicolons
- **Line length**: Max 100 characters (enforced by Prettier)

#### Variables & Functions
```typescript
// ✅ GOOD: Descriptive, camelCase
const strategyCanvas = document.getElementById('strategy-canvas');
function calculateAbilityRange(ability: Ability): number { }

// ❌ BAD: Unclear, inconsistent
const sc = document.getElementById('strategy-canvas');
function calc_ability_rng(ability) { }
```

#### Comments
```typescript
// ✅ GOOD: Explain WHY, not WHAT
// Sanitize filename to prevent path traversal attacks
const safeName = sanitizeFilename(agent.displayName);

// Calculate ability range based on agent's current position
// and map boundaries to prevent out-of-bounds rendering
const range = calculateAbilityRange(ability, agent.position);

// ❌ BAD: Stating the obvious
// Set variable to 10
const maxAgents = 10;
```

#### No Emojis in Code
```typescript
// ❌ BAD: Emojis in code
const strategies = []; // 🎯
console.log('✅ Strategy saved!');

// ✅ GOOD: Clean, professional code
const strategies = [];
console.log('Strategy saved successfully');
```

**Note**: Emojis are acceptable in:
- User-facing messages (via i18n)
- Git commit messages (optional, for visual categorization)
- Documentation for visual emphasis (use sparingly)

### CSS/Styling

#### Use Tailwind Utilities
```tsx
// ✅ GOOD: Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">

// ❌ AVOID: Custom CSS unless necessary
<div className="custom-container">
```

#### Custom CSS (when needed)
```css
/* Use BEM naming convention */
.strategy-editor__canvas {
  position: relative;
}

.strategy-editor__toolbar--active {
  background-color: var(--color-primary);
}
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Editor/
│   │   ├── Canvas.tsx
│   │   ├── Toolbar.tsx
│   │   └── index.ts    # Barrel exports
│   └── shared/         # Shared components
├── features/           # Feature-based modules
│   ├── strategies/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
├── hooks/             # Global custom hooks
├── lib/               # Third-party integrations
├── services/          # API clients, business logic
├── types/             # Global TypeScript types
├── utils/             # Helper functions
└── constants/         # App-wide constants
```

---

## Naming Conventions

### Files & Directories
```
components/Canvas.tsx           # PascalCase for components
hooks/useStrategyEditor.ts      # camelCase with "use" prefix
utils/sanitizeFilename.ts       # camelCase for utilities
types/strategy.types.ts         # camelCase with .types suffix
constants/maps.constants.ts     # camelCase with .constants suffix
services/strategyApi.service.ts # camelCase with .service suffix
```

### Components
```typescript
// ✅ GOOD: PascalCase, descriptive
export function StrategyEditor() { }
export function AgentSelector() { }

// ❌ BAD: Unclear, inconsistent
export function strategyEditor() { }
export function agent_sel() { }
```

### Hooks
```typescript
// ✅ GOOD: Start with "use", descriptive
export function useStrategyCanvas() { }
export function useAgentSelection() { }

// ❌ BAD: Missing "use" prefix
export function strategyCanvas() { }
```

### Constants
```typescript
// ✅ GOOD: UPPER_SNAKE_CASE for true constants
export const MAX_STRATEGIES_PER_USER = 50;
export const DEFAULT_MAP_ZOOM = 1.0;

// ✅ GOOD: camelCase for config objects
export const canvasConfig = {
  width: 1024,
  height: 768,
};

// ❌ BAD: Unclear naming
export const max = 50;
export const cfg = { w: 1024, h: 768 };
```

---

## Documentation

### Code Documentation

#### Functions
```typescript
/**
 * Sanitizes a filename by removing invalid characters
 * 
 * @param filename - The original filename to sanitize
 * @returns A sanitized filename safe for file system use
 * 
 * @example
 * ```ts
 * sanitizeFilename('KAY/O') // returns 'kay-o'
 * sanitizeFilename('Agent:123') // returns 'agent-123'
 * ```
 */
export function sanitizeFilename(filename: string): string {
  return filename.toLowerCase().replace(/[\/\\:*?"<>|]/g, '-');
}
```

#### Complex Logic
```typescript
// Complex calculations or business logic should have clear explanations
/**
 * Calculates the optimal ability placement position on the canvas
 * 
 * Takes into account:
 * - Current map boundaries
 * - Existing ability placements to prevent overlap
 * - Agent position constraints
 * - Ability-specific range limitations
 */
function calculateAbilityPlacement(/* ... */) {
  // Implementation
}
```

### README Files
Every major directory should have a README explaining its purpose:

```markdown
# components/Editor

Canvas-based strategy editor components.

## Components

- `Canvas.tsx` - Main drawing canvas using Konva.js
- `Toolbar.tsx` - Drawing tools and controls
- `LayerPanel.tsx` - Layer management UI

## Usage

\`\`\`tsx
import { Canvas, Toolbar } from '@/components/Editor';

function StrategyPage() {
  return (
    <div>
      <Toolbar />
      <Canvas />
    </div>
  );
}
\`\`\`
```

---

## Scripts & Automation

### Reusable Scripts
All automation scripts should be:
- **Idempotent**: Can be run multiple times safely
- **Self-documenting**: Include help text and examples
- **Error-handling**: Gracefully handle failures
- **Logged**: Provide clear progress and error messages

### Script Structure
```javascript
/**
 * Script: update-agents.js
 * Purpose: Fetch and update agent data from Valorant API
 * Usage: node scripts/update-agents.js [--force]
 */

import { program } from 'commander';

// Configuration
const CONFIG = {
  apiUrl: 'https://valorant-api.com/v1/agents',
  outputDir: './frontend/public/assets/agents',
  retryAttempts: 3,
};

// Parse CLI arguments
program
  .option('-f, --force', 'Force update even if data exists')
  .option('-v, --verbose', 'Verbose logging')
  .parse();

// Main execution
async function main() {
  try {
    console.log('Starting agent update...');
    // Implementation
    console.log('Update completed successfully');
  } catch (error) {
    console.error('Update failed:', error.message);
    process.exit(1);
  }
}

main();
```

### Available Scripts
Maintain these utility scripts:

```json
{
  "scripts": {
    "update:agents": "node scripts/update-agents.js",
    "update:maps": "node scripts/update-maps.js",
    "update:abilities": "node scripts/update-abilities.js",
    "update:all": "npm run update:agents && npm run update:maps && npm run update:abilities",
    "validate:assets": "node scripts/validate-assets.js"
  }
}
```

### Script Guidelines
```javascript
// ✅ GOOD: Configurable, documented
const CONFIG = {
  apiUrl: process.env.VALORANT_API_URL || 'https://valorant-api.com/v1',
  timeout: 30000,
  retries: 3,
};

async function downloadAsset(url, destination) {
  for (let attempt = 1; attempt <= CONFIG.retries; attempt++) {
    try {
      await download(url, destination);
      console.log(`Downloaded: ${destination}`);
      return;
    } catch (error) {
      if (attempt === CONFIG.retries) throw error;
      console.log(`Retry ${attempt}/${CONFIG.retries}...`);
    }
  }
}

// ❌ BAD: Hardcoded, no error handling
async function downloadAsset(url, dest) {
  await download(url, dest);
}
```

---

## Internationalization (i18n)

### Setup
Use `next-intl` or `react-i18next` for internationalization.

### Directory Structure
```
locales/
├── en/
│   ├── common.json
│   ├── editor.json
│   └── strategies.json
├── es/
│   ├── common.json
│   ├── editor.json
│   └── strategies.json
└── pt/
    ├── common.json
    ├── editor.json
    └── strategies.json
```

### Translation Files
```json
// locales/en/editor.json
{
  "toolbar": {
    "draw": "Draw",
    "agents": "Agents",
    "abilities": "Abilities",
    "save": "Save Strategy"
  },
  "canvas": {
    "zoom_in": "Zoom In",
    "zoom_out": "Zoom Out",
    "reset_view": "Reset View"
  }
}

// locales/es/editor.json
{
  "toolbar": {
    "draw": "Dibujar",
    "agents": "Agentes",
    "abilities": "Habilidades",
    "save": "Guardar Estrategia"
  },
  "canvas": {
    "zoom_in": "Acercar",
    "zoom_out": "Alejar",
    "reset_view": "Restablecer Vista"
  }
}
```

### Usage in Code
```typescript
import { useTranslation } from 'next-intl';

export function Toolbar() {
  const t = useTranslation('editor');
  
  return (
    <div>
      <button>{t('toolbar.draw')}</button>
      <button>{t('toolbar.agents')}</button>
      <button>{t('toolbar.save')}</button>
    </div>
  );
}
```

### Translation Keys
```typescript
// ✅ GOOD: Namespaced, descriptive
t('editor.toolbar.save_strategy')
t('strategies.list.empty_state')
t('errors.network.timeout')

// ❌ BAD: Flat, unclear
t('save')
t('empty')
t('error')
```

### Default Language
- **Default**: English (en)
- **Fallback**: Always provide English translations
- **New Features**: Add translations for all supported languages

---

## Git Workflow

### Branch Naming
```bash
feature/agent-drag-and-drop
fix/canvas-zoom-issue
refactor/strategy-service
docs/api-documentation
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

feat(editor): add ability placement tool
fix(canvas): resolve zoom reset bug
refactor(api): simplify strategy service
docs(readme): update installation steps
chore(deps): update react to v19
test(editor): add canvas interaction tests
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functionality change)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, build, etc.)
- `perf`: Performance improvements

---

## Performance

### Canvas Optimization
```typescript
// ✅ GOOD: Debounce expensive operations
import { debounce } from 'lodash';

const handleCanvasUpdate = debounce((data) => {
  saveStrategy(data);
}, 500);

// ✅ GOOD: Virtualize large lists
import { FixedSizeList } from 'react-window';

function StrategyList({ strategies }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={strategies.length}
      itemSize={80}
    >
      {/* ... */}
    </FixedSizeList>
  );
}
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/assets/agents/jett.png"
  alt="Jett"
  width={64}
  height={64}
  loading="lazy"
/>
```

### Code Splitting
```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const StrategyEditor = lazy(() => import('./components/StrategyEditor'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <StrategyEditor />
    </Suspense>
  );
}
```

---

## Security

### Input Validation
```typescript
// ✅ GOOD: Validate and sanitize user input
function saveStrategy(data: unknown) {
  const schema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500),
    isPublic: z.boolean(),
  });
  
  const validated = schema.parse(data);
  return api.saveStrategy(validated);
}

// ❌ BAD: Trust user input
function saveStrategy(data) {
  return api.saveStrategy(data);
}
```

### Environment Variables
```bash
# .env.example (committed)
NEXT_PUBLIC_API_URL=
DATABASE_URL=
JWT_SECRET=

# .env.local (gitignored)
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/openvalobook
JWT_SECRET=your-secret-key-here
```

### API Security
```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

app.use('/api/', limiter);

// CORS configuration
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

---

## Testing

### Test Structure
```typescript
// Canvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('should render canvas element', () => {
    render(<Canvas />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('should handle zoom in action', () => {
    render(<Canvas />);
    const zoomButton = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomButton);
    // Assert zoom level changed
  });
});
```

### Test Coverage
- **Unit Tests**: All utility functions, hooks
- **Integration Tests**: API services, complex features
- **E2E Tests**: Critical user flows (create strategy, save, share)

---

## Tools & Linting

### Required Tools
```json
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

---

## Review Checklist

Before submitting a PR, ensure:
- [ ] All code is in English
- [ ] No emojis in code (only in user-facing messages via i18n)
- [ ] Functions are modular and single-purpose
- [ ] Complex logic is documented
- [ ] New features have tests
- [ ] No hardcoded strings (use i18n)
- [ ] No console.logs in production code
- [ ] Types are properly defined (no `any`)
- [ ] ESLint and Prettier pass
- [ ] Changes are reflected in documentation

---

## Questions or Suggestions?

Open an issue or discussion on GitHub to propose changes to these guidelines.
