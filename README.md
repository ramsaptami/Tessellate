# Tessellate - Consolidated Platform

A unified platform that combines three powerful applications:

- **Lookbook Creator** (`/lookbook`) - AI-powered fashion lookbook creation
- **Project Dashboard** (`/dashboard`) - Comprehensive project management and analytics  
- **Moodboard Studio** (`/moodboard`) - Visual inspiration and design collaboration

## Features

### 🎨 Lookbook Creator
- AI-powered product search and matching
- Magazine-style layout generation
- Natural language style queries
- Professional editorial formats

### 📊 Project Dashboard  
- Real-time project metrics and analytics
- Task management and prioritization
- Team collaboration tools
- Performance tracking

### 🎭 Moodboard Studio
- Drag-and-drop visual editor
- Real-time collaboration
- Smart layout suggestions  
- Export and sharing capabilities

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **State Management**: Zustand (ready for integration)
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is optimized for Vercel deployment with path-based routing:

- **Home**: `/` - Landing page with app overview
- **Lookbook**: `/lookbook` - Fashion and style creation tools  
- **Dashboard**: `/dashboard` - Project management interface
- **Moodboard**: `/moodboard` - Visual collaboration tools

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── lookbook/          # Lookbook application pages
│   ├── dashboard/         # Dashboard application pages
│   ├── moodboard/         # Moodboard application pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/            
│   ├── shared/            # Shared components across apps
│   └── ui/                # Reusable UI components
└── lib/                   # Utility functions and configurations
```

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types
3. Update tests for new functionality
4. Ensure responsive design across all breakpoints

## License

Private project - All rights reserved.