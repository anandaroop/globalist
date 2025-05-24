# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server:**

```bash
yarn dev          # Start Vite dev server with HMR
yarn preview      # Preview production build locally
```

**Code Quality:**

```bash
yarn typecheck    # Run TypeScript compiler check
yarn lint         # Run ESLint on all files
yarn lint:fix     # Run ESLint with auto-fix
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

**Build:**

```bash
yarn build        # TypeScript compilation + Vite production build
```

**Pre-commit Verification:**

```bash
yarn typecheck && yarn lint && yarn format:check
```

## Package Management

- Use **Yarn** as the package manager
- When adding dependencies, install type definitions as devDependencies when needed
- Run `yarn install` to install dependencies

## Code Architecture

**Framework Stack:**

- React 19.1.0 with TypeScript 5.8.3
- Vite 6.3.5 as build tool and dev server
- ESM module format throughout

**Entry Points:**

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main React component
- `index.html` - Vite HTML template

**TypeScript Configuration:**

- `tsconfig.json` - Project references configuration
- `tsconfig.app.json` - Strict app configuration (ES2020, React JSX)
- `tsconfig.node.json` - Node/Vite tooling configuration (ES2022)

## Code Quality Setup

**Automated Git Hooks:**

- Pre-commit: Runs lint-staged (ESLint + Prettier on staged files)
- Commit-msg: Validates commit messages with conventional commits

**ESLint Configuration:**

- Flat config format in `eslint.config.js`
- TypeScript support with React hooks and refresh plugins
- Prettier integration to avoid conflicts

**Formatting:**

- Prettier configured with double quotes preference
- Integrated with ESLint via eslint-config-prettier

## Commit Standards

- Use conventional commit messages (enforced by commitlint)
- Examples: `feat:`, `fix:`, `chore:`, `docs:`
- Git hooks automatically run code quality checks

## Coding Guidelines

- Prefer named exports over default exports
- Stick to requirements when implementing features
- Ensure code is type-checked, linted, and formatted before commits
