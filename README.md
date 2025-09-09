# Tessellate - Consolidated Platform

A unified platform combining creative workflow tools and project management solutions.

## Application Architecture

### 🎨 Creative Workflow (Integrated)
A seamless two-step creative process where inspiration flows naturally into curated content:

**Step 1: Moodboard Studio** (`/moodboard`)
- Visual inspiration and design collaboration
- Drag-and-drop visual editor  
- Real-time team collaboration
- Smart layout suggestions and AI assistance
- Export and sharing capabilities

**Step 2: Lookbook Creator** (`/lookbook`)  
- AI-powered fashion lookbook creation
- Natural language product search ("brown leather couch with teak tables")
- Magazine-style "Key Prices" layouts with brand attribution
- Seamless integration with moodboard inspiration
- Professional editorial formats

### 📊 Project Management (Access-Controlled)

**Project Dashboard** (`/dashboard`) - *Requires Authentication*
- Comprehensive project analytics and metrics
- Task management and team collaboration  
- GitHub integration and code quality tracking
- Performance monitoring and reporting
- Role-based access control (Coming Soon)

## Key Differentiators

- **Integrated Creative Workflow**: Moodboard → Lookbook represents a natural creative progression
- **Access-Controlled Dashboard**: Separate authentication layer for sensitive project data  
- **Modern Polyvore Alternative**: Advanced AI-powered product matching and curation
- **Professional Layouts**: Magazine-quality "Key Prices" style presentations

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