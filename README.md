# joebad.com

A lightweight static site generator that builds my personal website with React components, Markdown content, and RSS feed integration.

## Features

- 🏗️ **Static Site Generation** - Compiles React/TSX components and Markdown files to static HTML
- 📡 **RSS Feed Integration** - Automatically fetches and displays recent activity from https://rss.joebad.com
- 🎨 **Tailwind CSS** - Built-in styling with Tailwind CSS compilation
- ⚡ **Fast & Light** - Generates optimized static HTML files (homepage is less than 6kb)
- 🔄 **Daily Updates** - Automatically rebuilds daily to fetch fresh RSS content

## Quick Start

```bash
# Install dependencies
yarn

# Build the site
yarn build

# Development with file watching
yarn dev

# Use serve to view locally built static files
npx serve ./dist
```

## How It Works

The build process:

1. **Fetches RSS data** from `https://rss.joebad.com`
2. **Processes React components** from `src/pages/` (gets RSS data as props)
3. **Processes Markdown files** from `src/content/`
4. **Compiles Tailwind CSS** from `src/styles/main.css`
5. **Generates static HTML** files in `dist/`

## Project Structure

```
src/
├── pages/           # React/TSX components (become HTML pages)
├── content/         # Markdown files
├── components/      # Shared React components
└── styles/          # Tailwind CSS source
└── build.ts         # Build script that builds static html in ./dist
```

## Daily Builds

The site automatically rebuilds daily via GitHub Actions to pull in fresh RSS content, keeping the activity feed current without manual intervention.

## Tech Stack

- **TypeScript** - Type-safe development
- **React** - Component-based pages
- **Tailwind CSS** - Utility-first styling
- **Remark** - Markdown processing
- **esbuild** - Fast TypeScript compilation
