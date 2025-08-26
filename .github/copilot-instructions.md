# Pomerium Documentation Repository

Pomerium's documentation is a Docusaurus 3.8.1-based static site generator that creates comprehensive documentation from MDX files. The site is published at https://pomerium.com/docs.

**ALWAYS follow these instructions first and only use additional search or bash commands when you encounter unexpected information that does not match what is documented here.**

## Working Effectively

### Bootstrap and Install Dependencies
```bash
yarn install  # Takes 90 seconds, NEVER CANCEL
```

**Note**: Installation includes optional Puppeteer dependency that may fail in network-restricted environments - this is safe to ignore.

### Build the Documentation
**NEVER CANCEL BUILD COMMANDS - THEY TAKE 3-4 MINUTES TO COMPLETE. SET TIMEOUTS TO 300+ SECONDS.**

**Standard Build**:
```bash
yarn build  # Takes 3-4 minutes, NEVER CANCEL. Set timeout to 300+ seconds.
```

**Sandboxed/Network-Restricted Environment (use when external API access fails)**:
```bash
POMERIUM_DOCS_OFFLINE=1 yarn build  # Takes 3-4 minutes, NEVER CANCEL. Set timeout to 300+ seconds.
```

The repository includes integration with an external API (console.pomerium.app) for OpenAPI documentation. In network-restricted environments, use the `POMERIUM_DOCS_OFFLINE=1` environment variable to disable this integration.

### Development Server
**Run the development server (with hot reload)**:

**Standard Mode**:
```bash
yarn start  # Runs on http://localhost:3001, compiles in 30-60 seconds
```

**Network-Restricted Environment**:
```bash
POMERIUM_DOCS_OFFLINE=1 yarn start  # Runs on http://localhost:3001
```

### Production Preview
**Serve the built site for testing**:
```bash
yarn serve  # Runs on http://localhost:3000 after running yarn build
```

**In network-restricted environments**:
```bash
POMERIUM_DOCS_OFFLINE=1 yarn serve  # Use after POMERIUM_DOCS_OFFLINE=1 yarn build
```

### Code Quality and Linting
**Format code with Prettier**:
```bash
yarn format          # Auto-fix formatting, takes 7 seconds
yarn format-check    # Check formatting without fixing, takes 7 seconds
```

**Spell checking**:
```bash
npx cspell "content/**/*"  # Use npx, not yarn cspell (command not found globally)
```

**Pre-commit validation** (has known issues with cspell):
```bash
yarn precommit  # Runs format-check + cspell, but cspell may fail globally
```

## Validation Requirements

### Manual Testing Scenarios
**ALWAYS run these scenarios after making changes**:

1. **Standard Build and Serve**:
   ```bash
   yarn build
   yarn serve
   curl http://localhost:3000/ | grep -i pomerium  # Should return site title
   ```

2. **Network-Restricted Build (use when external API fails)**:
   ```bash
   POMERIUM_DOCS_OFFLINE=1 yarn build
   POMERIUM_DOCS_OFFLINE=1 yarn serve
   curl http://localhost:3000/ | grep -i pomerium  # Should return site title
   ```

3. **Development Workflow**:
   ```bash
   yarn start  # or POMERIUM_DOCS_OFFLINE=1 yarn start if needed
   curl http://localhost:3001/ | grep -i pomerium  # Should return site title
   ```

### Build Warnings and Issues
**Expected warnings (SAFE TO IGNORE)**:
- Puppeteer optional dependency installation failure (network related)
- MUI X Pro license key warning (functionality not affected)
- Image processing warnings for specific SVG files (build continues successfully)
- Multiple MDX parsing warnings (pages still render correctly)
- Broken link/anchor warnings (existing documentation issues, not build failures)

**When to use offline mode**:
- Build fails with "ENOTFOUND console.pomerium.app" error
- Development server fails to start due to network connectivity
- Working in sandboxed environments without external API access

## Repository Structure

### Key Directories
- `content/` - All documentation content in MDX format
- `content/docs/` - Core documentation pages
- `content/examples/` - Example configurations and guides
- `static/` - Static assets (images, files)
- `src/` - React components and themes
- `plugins/` - Custom Docusaurus plugins
- `.github/workflows/` - CI/CD configurations

### Configuration Files
- `docusaurus.config.js` - Main Docusaurus configuration with offline mode support
- `sidebars.js` - Navigation sidebar configuration
- `package.json` - Dependencies and scripts
- `.pre-commit-config.yaml` - Git hooks for code quality

### Build Artifacts (DO NOT COMMIT)
- `build/` - Generated static site
- `node_modules/` - Dependencies
- `.docusaurus/` - Docusaurus cache

## Common Tasks and Solutions

### Network Dependency Management
The repository includes a redocusaurus plugin that fetches OpenAPI specs from `console.pomerium.app`. The configuration automatically handles this:

- **With network access**: API documentation is included in the build
- **Offline mode**: API documentation is excluded, broken links become warnings

**Use offline mode when**:
```bash
export POMERIUM_DOCS_OFFLINE=1
```

### Build Performance
- **Full build**: 22 seconds to 4 minutes depending on network and system
- **Development server startup**: 30-60 seconds for initial compilation
- **Dependency installation**: 90 seconds

### Content Editing Guidelines
- Use MDX format for documentation files
- Place new content in appropriate subdirectories under `content/`
- Follow existing file naming conventions
- Include proper frontmatter for metadata

### Troubleshooting Common Issues

**Build fails with network errors**:
```bash
export POMERIUM_DOCS_OFFLINE=1
yarn build
```

**"cspell: not found" error**:
```bash
npx cspell "content/**/*"  # Use npx instead of yarn cspell
```

**Development server not starting**:
- Ensure port 3001 is available
- Use offline mode if network access is limited: `POMERIUM_DOCS_OFFLINE=1 yarn start`
- Wait for webpack compilation to complete (30-60 seconds)

**Images not displaying correctly**:
- Check SVG file integrity (some warnings are expected for specific files)
- Ensure images are in `static/img/` or appropriate `content/` subdirectories
- Image processing warnings are usually non-critical

**Broken link warnings**:
- Many broken anchor warnings are existing issues in the documentation
- In offline mode, `/docs/api` links will show as broken (expected)
- These warnings don't prevent successful builds

## CI/CD Integration

The repository uses:
- **Pre-commit hooks**: Prettier formatting and cspell checking
- **GitHub Actions**: Automated builds and deployments
- **Netlify**: Production hosting and previews

**Before committing changes**:
```bash
yarn format
npx cspell "content/**/*"
yarn build  # Verify build succeeds (use POMERIUM_DOCS_OFFLINE=1 if needed)
```

## Environment Requirements

- **Node.js**: v20.19.4+ (no .nvmrc file, use system default)
- **Package Manager**: Yarn 1.22.22+ (yarn.lock present)
- **Memory**: At least 2GB for webpack compilation
- **Disk**: 1GB+ for node_modules and build artifacts
- **Network**: Optional for OpenAPI documentation integration

## Critical Timing Information

**NEVER CANCEL these commands - they require significant time to complete**:
- `yarn install`: 90 seconds
- `yarn build`: 22 seconds to 240 seconds (depending on system and network)
- Initial development server compilation: 30-60 seconds
- `yarn format`: 7 seconds (safe to use default timeouts)

## Offline Mode Features

The `POMERIUM_DOCS_OFFLINE=1` environment variable:
- Disables external API fetching for OpenAPI documentation
- Changes broken link errors to warnings for missing API routes
- Allows builds to complete in network-restricted environments
- Maintains full documentation functionality except API reference section