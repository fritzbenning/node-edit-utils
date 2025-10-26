# @node-edit-utils/core

Core utilities for selecting, highlighting, and editing DOM nodes. This package provides framework-agnostic tools for building interactive node editing experiences.

## ✨ Features

- **Node Selection** - Select DOM nodes and highlight them with visual frames
- **Highlight Management** - Create and update visual highlight frames around selected nodes
- **Text Editing** - Enable inline text editing for node content
- **Canvas Observer** - Monitor canvas state and interactions
- **Viewport Management** - Create resizable viewports for content viewing
- **Event Handling** - Comprehensive keyboard and mouse event support
- **Post Message API** - Cross-frame communication support

## 📦 Installation

```bash
npm install @node-edit-utils/core
# or
pnpm add @node-edit-utils/core
# or
yarn add @node-edit-utils/core
```

## 🚀 Quick Start

### Basic Node Selection and Highlighting

```javascript
import { createNodeTools } from '@node-edit-utils/core';
import '@node-edit-utils/core/styles.css';

// Get the container element
const container = document.getElementById('content');

// Create node tools
const nodeTools = createNodeTools(container);

// Select a node to highlight it
const targetNode = document.querySelector('.editable-element');
nodeTools.selectNode(targetNode);

// Get the currently selected node
const selected = nodeTools.getSelectedNode();

// Clear the selection
nodeTools.clearSelectedNode();

// Clean up when done
nodeTools.cleanup();
```

### Working with Text Editing

The text editing functionality is built into the node selection system. When you select a node, it automatically becomes editable:

```javascript
const nodeTools = createNodeTools(container);

// Select a node - it becomes editable
const node = document.querySelector('h1');
nodeTools.selectNode(node);

// The node is now in edit mode - users can edit the text
// Press Escape to exit edit mode
// Get the currently edited node
const editableNode = nodeTools.getEditableNode();
```

### Canvas Observer

Monitor canvas state changes and interactions:

```javascript
import { createCanvasObserver } from '@node-edit-utils/core';

// Create observer to monitor canvas events
const observer = createCanvasObserver();

// The observer tracks canvas interactions automatically
// You can integrate it with your canvas library
```

### Viewport Management

Create a resizable viewport for content viewing:

```javascript
import { createViewport } from '@node-edit-utils/core';

// Get your viewport container
const viewportContainer = document.getElementById('viewport');

// Create the viewport
const viewport = createViewport(viewportContainer);

// Programmatically set viewport width
viewport.setWidth(800);

// Clean up
viewport.cleanup();
```

## 📖 API Reference

### `createNodeTools(element: HTMLElement | null): NodeTools`

Creates a node tools manager for a given container element.

**Parameters:**
- `element` - The container element that holds the nodes to edit

**Returns:** `NodeTools` object with the following methods:

#### NodeTools Methods

- **`selectNode(node: HTMLElement | null): void`** - Select and highlight a node
- **`getSelectedNode(): HTMLElement | null`** - Get the currently selected node
- **`getEditableNode(): HTMLElement | null`** - Get the node currently in edit mode
- **`clearSelectedNode(): void`** - Clear the selection and remove highlight
- **`refreshHighlightFrame(): void`** - Refresh the highlight frame (useful after DOM changes)
- **`cleanup(): void`** - Clean up and remove all listeners

### `createCanvasObserver(): CanvasObserver`

Creates a canvas observer for monitoring canvas interactions.

**Returns:** `CanvasObserver` object

### `createViewport(container: HTMLElement): Viewport`

Creates a viewport with resize handles.

**Parameters:**
- `container` - The viewport container element

**Returns:** `Viewport` object with methods:
- **`setWidth(width: number): void`** - Set the viewport width
- **`cleanup(): void`** - Clean up the viewport

## 🎨 Styling

The package includes default styles that can be imported:

```javascript
import '@node-edit-utils/core/styles.css';
```

You can customize the appearance by overriding CSS variables:

```css
/* Override highlight colors */
:root {
  --highlight-color: #3b82f6;
  --highlight-border-width: 2px;
}
```

## 💡 Examples

### Example 1: Full Node Editor Setup

```javascript
import { createNodeTools, createViewport, createCanvasObserver } from '@node-edit-utils/core';
import '@node-edit-utils/core/styles.css';

// Setup
const container = document.getElementById('editor-container');
const viewportEl = document.getElementById('viewport');

// Create tools
const nodeTools = createNodeTools(container);
const viewport = createViewport(viewportEl);
const canvasObserver = createCanvasObserver();

// Handle node selection from UI
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('editable')) {
    nodeTools.selectNode(e.target);
  }
});

// Handle exit
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nodeTools.clearSelectedNode();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  nodeTools.cleanup();
  viewport.cleanup();
});
```

### Example 2: Programmatic Node Selection

```javascript
const nodeTools = createNodeTools(container);

// Select different nodes
const nodes = container.querySelectorAll('[data-selectable]');
nodes.forEach((node, index) => {
  setTimeout(() => {
    nodeTools.selectNode(node);
  }, index * 1000);
});
```

### Example 3: Edit Mode with Custom Handling

```javascript
const nodeTools = createNodeTools(container);

// Listen for when a node is selected
container.addEventListener('click', (e) => {
  const target = e.target;
  nodeTools.selectNode(target);
  
  // Check if it's in edit mode
  if (nodeTools.getEditableNode()) {
    console.log('Node is now editable:', nodeTools.getEditableNode());
  }
});
```

## 🔄 Event Handling

The node tools automatically handle:

- **Click events** - Select nodes on click
- **Keyboard events** - Exit edit mode with Escape key
- **Resize events** - Update highlight on viewport resize
- **Mutation events** - Refresh highlight on DOM changes

## 🧹 Cleanup

Always clean up when you're done to prevent memory leaks:

```javascript
// When component unmounts or feature is disabled
nodeTools.cleanup();
viewport.cleanup();
```

## 🤝 Integration with Other Libraries

This package works well with:

- **@markup-canvas/core** and **@markup-canvas/react** - Canvas manipulation
- **React** - Via the `@node-edit-utils/react` package
- Any custom canvas or DOM manipulation library

## ⚠️ Notes

- The package modifies the DOM by adding highlight frames and edit mode elements
- Always import the CSS file for proper styling
- The package uses ResizeObserver and MutationObserver for monitoring
- Browser support requires a modern browser with ES2020+ support

## 📝 License

CC-BY-NC-4.0

## 👤 Author

Fritz Benning <mail@fritzbenning.de>
