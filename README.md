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

## 🔄 Development Workflow

This repository uses a comprehensive automated workflow system consistent across all team repositories to ensure code quality and streamlined development.

### Branch Protection & Naming Conventions
- **Protected Branch**: `master` (direct commits blocked by pre-commit hooks)
- **All changes** must go through feature branches and pull requests
- **Standardized naming** ensures automated workflow triggers and proper PR categorization

### Supported Branch Types & Auto-PR Features

| Branch Pattern | Purpose | Auto-PR Title | Labels | Examples |
|----------------|---------|---------------|--------|----------|
| `feature/description` | New features and enhancements | ✨ Feature: [description] | `enhancement`, `auto-created` | `feature/github-integration` |
| `fix/description` | Bug fixes and corrections | 🐛 Fix: [description] | `bug`, `auto-created` | `fix/metrics-calculation` |
| `refactor/description` | Code restructuring without changing functionality | ♻️ Refactor: [description] | `refactoring`, `auto-created` | `refactor/dashboard-components` |
| `docs/description` | Documentation updates | 📚 Docs: [description] | `documentation`, `auto-created` | `docs/deployment-guide` |
| `hotfix/description` | Critical production fixes | 🚨 Hotfix: [description] | `hotfix`, `auto-created`, `priority-high` | `hotfix/authentication-bypass` |

### Complete Automated Process
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Push Changes**: Triggers automatic PR creation with proper titles and labels
3. **Automated Checks**: Dependencies validation, tests, build verification
4. **Code Review**: Manual review with auto-generated checklist
5. **Auto-Merge**: Approved PRs merge automatically with cleanup

### Quick Start Commands
```bash
# Feature development
git checkout master && git pull
git checkout -b feature/new-dashboard-widget
# Make changes, commit, and push
git push -u origin feature/new-dashboard-widget
# PR created automatically!

# Bug fix
git checkout -b fix/responsive-layout-issue
# Fix issue and push - auto-PR created with bug labels

# Documentation update  
git checkout -b docs/setup-instructions-update
# Update docs and push - fast-track merge for docs
```

### Integration Setup for New Team Members

1. **Clone Repository**:
   ```bash
   git clone [repository-url]
   cd tessellate
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Verify Pre-commit Hooks**:
   ```bash
   # Hooks should be installed automatically
   # Test branch protection
   echo "test" > test.txt && git add test.txt
   git commit -m "test"  # Should be blocked with helpful message
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   # Open http://localhost:3000 in your browser
   ```

5. **Configure Git Aliases** (Optional):
   ```bash
   git config alias.newfeature '!git checkout master && git pull && git checkout -b feature/$1'
   git config alias.newfix '!git checkout master && git pull && git checkout -b fix/$1'
   ```

6. **First Feature Branch**:
   ```bash
   git checkout -b feature/contributor-setup-complete
   echo "Setup completed by [your-name]" >> CONTRIBUTORS.md
   git add CONTRIBUTORS.md
   git commit -m "Add contributor setup completion"
   git push -u origin feature/contributor-setup-complete
   ```

### Troubleshooting Common Workflow Issues

#### Issue: Branch not triggering auto-PR
**Symptoms**: Pushed branch but no PR created
**Solutions**:
- Verify branch name matches pattern: `feature/*`, `fix/*`, `refactor/*`, `docs/*`, `hotfix/*`
- Check GitHub Actions are enabled in repository settings
- Ensure you have proper repository permissions

#### Issue: Pre-commit hook not blocking direct commits
**Solutions**:
```bash
# Verify hook exists and is executable
ls -la .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Reinstall hooks if needed
npm install  # Hooks should reinstall automatically
```

#### Issue: Auto-merge not working
**Symptoms**: PR approved but not merging
**Checklist**:
- [ ] All status checks passed
- [ ] No merge conflicts
- [ ] Required approvals received
- [ ] No requested changes pending
- [ ] Branch is up to date with master
- [ ] Build passes successfully

#### Issue: Development server not starting
**Solutions**:
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cp .env.example .env.local
# Edit .env.local with correct values

# Verify Node.js version
node --version  # Should be 18+ for Next.js 15
```

For detailed workflow examples and advanced scenarios, see [../../docs/PR_WORKFLOW_EXAMPLES.md](../../docs/PR_WORKFLOW_EXAMPLES.md)

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