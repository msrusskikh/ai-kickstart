# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ultra-minimal interactive education web application built with Next.js 14, featuring a clean interface for structured learning modules with quizzes and progress tracking. The app contains hardcoded Russian language content about AI fundamentals.

## Essential Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint (Next.js + TypeScript config)
- `npm run type-check` - Run TypeScript type checking (tsc --noEmit)
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Architecture & Key Files

### Core Structure
```
src/
├── app/                    # Next.js App Router
│   ├── learn/[module]/[section]/  # Dynamic learning routes
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Layout components
│   ├── lesson/            # Lesson-specific components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── content.ts         # ALL lesson content and structure
│   ├── progress.ts        # Progress tracking logic
│   ├── keyboard.ts        # Keyboard shortcuts
│   └── types.ts           # TypeScript interfaces
└── hooks/                 # React hooks
```

### Content Management System
- **Primary content file**: `src/lib/content.ts` contains all modules, lessons, and content
- Content is structured as hardcoded TypeScript objects, not MDX files
- Each lesson has: title, summary, duration, objectives, prerequisites, quiz questions
- Content uses HTML strings with Tailwind CSS classes
- Quiz types: MCQ (multiple choice) and reflection prompts

### State Management
- **Zustand** for global state management
- **Progress tracking**: Automatic lesson completion detection
- **Theme**: Dark/light mode with next-themes
- **Navigation**: Keyboard shortcuts (K for command menu, J/L for prev/next)

### UI Framework
- **Tailwind CSS** for styling with custom CSS variables
- **shadcn/ui** components (Radix UI primitives)
- **Lucide React** for icons
- **Framer Motion** for animations

## Adding New Content

### New Module
1. Add to `modules` array in `src/lib/content.ts`
2. Each module needs unique `id`, `title`, `description`, and `sections` array
3. Sections contain lesson metadata and content

### New Lesson
1. Add section object to appropriate module's `sections` array
2. Required fields: `slug`, `title`, `summary`, `duration`, `module`, `section`
3. Content goes in the `content` field as HTML string
4. Optional: `quiz` array with MCQ or reflection questions

### Content Format
- Use HTML with Tailwind CSS classes
- Structure: headings, paragraphs, lists, code blocks
- Special styling: `bg-blue-50 dark:bg-blue-950 p-4 rounded-lg` for callouts

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Next.js plugin configured for App Router

### Routing
- Dynamic routes: `/learn/[module]/[section]`
- Module and section IDs are numeric
- Progress persists in localStorage

### Prerequisites System
- Lessons can have `prerequisites` array referencing other lesson titles
- Creates logical learning paths
- Avoid circular dependencies

## Testing
- No automated test framework configured
- Manual testing via development server
- TypeScript type checking acts as compile-time verification