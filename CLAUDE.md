# Claude Development Guide

## UI Component Architecture

### shadcn/ui Components

**Directory Structure:**
- `src/components/ui/` - shadcn/ui registry components only
- `src/components/` - Custom/composite components organized in semantic folders

**Component Sourcing Priority:**
1. Install from [shadcn/ui official registry](https://ui.shadcn.com)
2. Check [shadcn/ui directory](https://ui.shadcn.com/docs/directory) for compatible third-party registries
3. Prefer external high-quality components over custom implementations
4. Only build custom components when no suitable external option exists

**Installation:**
```bash
# Official shadcn components
bunx shadcn@latest add [component-name]

# From other registries (verify compatibility first)
bunx shadcn@latest add [registry-url]
```

**Custom Component Guidelines:**
- Place in semantic folders under `src/components/`
- Compose from shadcn/ui primitives when possible
- Follow the project's existing patterns for state management and styling
- Use TypeScript with proper typing
- Export from index files for clean imports

**Code Quality:**
- Clean, human-readable code
- Concise implementations
- Maintainable architecture
- Proper separation of concerns

**Styling:**
- Use Tailwind CSS utilities
- Leverage shadcn/ui CSS variables for theming
- Support both light and dark modes
- Follow the project's existing Tailwind configuration
