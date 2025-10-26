# Node Edit Utils

A powerful collection of utilities for editing and manipulating DOM nodes in interactive canvas environments. Built with TypeScript and designed for seamless integration with React applications.

## 🚀 Features

- **Node Selection & Highlighting** - Select and highlight DOM nodes with visual feedback
- **Text Editing** - Enable inline text editing for selected nodes
- **Canvas Viewport** - Resizable viewport for content viewing and manipulation
- **Canvas Observer** - Monitor canvas interactions and state changes
- **React Integration** - Comprehensive React hooks and components
- **TypeScript Support** - Full type safety and IDE support
- **Framework Agnostic Core** - Use the core utilities in any project

## 📦 Packages

This monorepo contains the following packages:

- **[@node-edit-utils/core](./packages/core)** - Core utilities for node manipulation
- **[@node-edit-utils/react](./packages/react)** - React components and hooks
- **examples-react** - Example application showcasing usage

## 🔧 Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Install Node.js (if not already installed)
# Using Homebrew on macOS:
brew install node

# Using pnpm:
npm install -g pnpm
```

### Available Commands

```bash
# Build all packages
pnpm build

# Start development mode with file watching
pnpm dev

# Run linting checks
pnpm lint

# Format code using Biome
pnpm format

# Clean all dist directories
pnpm clean

# Check code quality
pnpm check
```

### Development Workflow

1. **Install dependencies** once at the start:
   ```bash
   pnpm install
   ```

2. **Start the development server** for the example app:
   ```bash
   pnpm dev
   ```
   This will run the packages in watch mode and start the dev server for the examples.

3. **Build for production**:
   ```bash
   pnpm build
   ```

4. **Lint and format code**:
   ```bash
   pnpm lint
   pnpm format
   ```

### Project Structure

```
node-edit-utils/
├── packages/
│   ├── core/              # Core utilities (framework agnostic)
│   ├── react/             # React components and hooks
│   └── examples-react/    # Example React application
├── scripts/               # Build and versioning scripts
├── biome.json             # Code quality configuration
├── pnpm-workspace.yaml    # Workspace configuration
└── turbo.json             # Build orchestration
```

## 📚 Documentation

For detailed documentation on each package, see:

- [Core Package Documentation](./packages/core/README.md)
- [React Package Documentation](./packages/react/README.md)
- [Examples](./packages/examples-react/README.md)

## 📝 License

CC-BY-NC-4.0

## 👤 Author

Fritz Benning <mail@fritzbenning.de>

## 🔗 Links

- [GitHub Repository](https://github.com/fritzbenning/node-edit-utils)
- [Issue Tracker](https://github.com/fritzbenning/node-edit-utils/issues)
