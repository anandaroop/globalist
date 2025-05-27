# Globalist

This single-purpose cartographic tool — available at [https://anandaroop.github.io/globalist](https://anandaroop.github.io/globalist) — allows a user to create a custom globe view and download the resulting vector art as an SVG file, for further customization in the illustration tool of their choice.

<img width="1646" alt="light" src="https://github.com/user-attachments/assets/a73b375e-e61d-4d3f-8054-c45d98aa8e2f" />
<!--
<img width="1646" alt="dark" src="https://github.com/user-attachments/assets/32fa1b38-78c3-4794-aa74-8b35384bb6ac" />
-->


It was born from my own need to have access to customizable vector globe artwork, for use in locator maps and insets that I create in the course of my [cartography projects](https://www.anandarooproy.com), such as the globe at the top right of this map:

<img width="25%" alt="example" src="https://github.com/user-attachments/assets/fa74b010-ae93-4fec-bee6-f390dd74f9f9" style="margin: auto;" />

Generating those globes was a somewhat fiddly and time-consuming process, thus my wish for something quick and easy.

## Vibes ✨

Notably, this was also an experiment in **vibe coding** with Claude Code, primarily using Claude 4 Sonnet, with a few assists by Claude 4 Opus. (And one gnarly Typescript fix via GPT 4.1)

According to [automated analysis](./scripts/analyze.rb), as of this writing about 79% of the line changes in this project were created by AI, and 21% by me.

## Features

- **Dual Projection Modes** — Switch between Orthographic and Satellite views
- **Customizable Parameters** — Adjust central meridian, parallel, and z-axis rotation, zoom
- **Interactive Globe Rendering** — Control the parameters via precise text input, sliders, or direct manipulation of the globe
- **SVG Export** — Download the resulting globe view as a Scalable Vector Graphics file, for further modifcation or styling

## Development

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd globalist

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
yarn dev          # Start Vite dev server with HMR
yarn preview      # Preview production build locally

# Code Quality
yarn typecheck    # Run TypeScript compiler check
yarn lint         # Run ESLint on all files
yarn lint:fix     # Run ESLint with auto-fix
yarn format       # Format code with Prettier
yarn format:check # Check code formatting

# Build
yarn build        # TypeScript compilation + Vite production build

# Deployment
yarn deploy       # Build and deploy to GitHub Pages

# Pre-commit verification
yarn typecheck && yarn lint && yarn format:check
```

### Git Workflow

- Pre-commit hooks run ESLint and Prettier automatically
- Conventional commit messages enforced by commitlint

### Architecture

The project follows a modular architecture with clear separation of concerns:

```
src/
├── components/             # React components
│   ├── Globe/              # Main globe visualization component
│   ├── Controls/           # UI control components
│   └── common/             # Reusable UI components
├── hooks/                  # Custom React hooks
│   ├── useGeoData.ts       # GeoJSON data fetching
│   ├── useDimensions.ts    # Responsive sizing
│   ├── useD3Projection.ts  # D3 projection management
│   ├── useGlobeInteraction.ts # Mouse/touch interactions
│   ├── useGlobeZoom.ts     # Zoom functionality
│   └── useGlobeState.ts    # Global state management
├── utils/                  # Pure utility functions
│   ├── d3-helpers.ts       # D3.js utilities
│   ├── math.ts             # Mathematical calculations
│   ├── download.ts         # SVG export functionality
│   ├── theme.ts            # Color schemes
│   └── constants.ts        # Configuration constants
├── types/                  # TypeScript type definitions
├── styles/                 # CSS modules and global styles
└── public/                 # Static assets
```

### Technical Stack

- **React 19.1.0** - UI framework with modern hooks
- **TypeScript 5.8.3** - Type-safe development
- **D3.js** - Data visualization and geographic projections
  - d3-geo - Geographic projections and paths
  - d3-geo-projection - Extended projection library
  - d3-selection - DOM manipulation
- **Vite 6.3.5** - Fast build tool and dev server
- **Radix** - Component library
- **CSS Modules** - Scoped ad-hoc component styling
- **ESLint + Prettier** - Code quality and formatting
- **Husky + lint-staged** - Git hooks for quality enforcement

## Deployment

### GitHub Pages

The project is configured for easy deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages
yarn deploy
```

This command:

1. Builds the production version of the app
2. Publishes to the `gh-pages` branch
3. Makes the site available at `https://yourusername.github.io/globalist/`

**Setup Requirements:**

1. Push your code to a GitHub repository
2. Run `yarn deploy`
3. Enable GitHub Pages in repository settings (source: gh-pages branch)

### Data

The globe uses Natural Earth country boundaries from GeoJSON files located in `public/`. The data includes world country polygons optimized for web visualization with two resolution options:

- `countries110.geojson` - Low resolution (faster loading)
- `countries50.geojson` - Medium resolution (more detail)
