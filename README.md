# Globalist

This cartographic tool allows one to create a custom globe visualization and download the resulting SVG.

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
└── data/                   # GeoJSON country data
```

### Technical Stack

- **React 19.1.0** - UI framework with modern hooks
- **TypeScript 5.8.3** - Type-safe development
- **D3.js** - Data visualization and geographic projections
  - d3-geo - Geographic projections and paths
  - d3-geo-projection - Extended projection library
  - d3-selection - DOM manipulation
- **Vite 6.3.5** - Fast build tool and dev server
- **CSS Modules** - Scoped component styling
- **ESLint + Prettier** - Code quality and formatting
- **Husky + lint-staged** - Git hooks for quality enforcement

### Data

The globe uses Natural Earth country boundaries from a GeoJSON file located in `src/data/countries110.geojson`. The data includes world country polygons optimized for web visualization.
