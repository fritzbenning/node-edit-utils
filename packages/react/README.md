# @node-edit-utils/react

React components and hooks for seamless integration of node editing utilities with your React applications. Provides high-level abstractions over the core utilities with React best practices.

## ✨ Features

- **React Components** - Pre-built components for canvas management and viewport handling
- **React Hooks** - Custom hooks for node tools and canvas interactions
- **Provider Pattern** - Context-based state management for canvas and tools
- **TypeScript Support** - Fully typed components and hooks
- **Server-Side Compatible** - Works with Next.js and other SSR frameworks

## 📦 Installation

```bash
npm install @node-edit-utils/react @node-edit-utils/core
# or
pnpm add @node-edit-utils/react @node-edit-utils/core
# or
yarn add @node-edit-utils/react @node-edit-utils/core
```

### Peer Dependencies

This package requires:
- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@node-edit-utils/core` - Core utilities
- `@markup-canvas/core` and `@markup-canvas/react` - Canvas library

## 🚀 Quick Start

### Basic Setup with CanvasProvider

```tsx
import { CanvasProvider } from '@node-edit-utils/react';
import '@node-edit-utils/core/styles.css';

export function App() {
  return (
    <CanvasProvider width={20000} height={15000}>
      {/* Your editable content goes here */}
      <h1>Editable Title</h1>
      <p>Editable content</p>
    </CanvasProvider>
  );
}
```

## 📚 Components

### `CanvasProvider`

Wrapper component that sets up the canvas environment with viewport and node tools.

**Props:**
- `width: number` - Canvas width in pixels
- `height: number` - Canvas height in pixels
- `children: React.ReactNode` - Child elements to render

**Example:**
```tsx
<CanvasProvider width={20000} height={15000}>
  <YourContent />
</CanvasProvider>
```

### `NodeTools`

Component that wraps content and provides node editing capabilities with visual feedback.

**Props:**
- `children: React.ReactNode` - Selectable content
- `isVisible?: boolean` - Show/hide the tools

**Example:**
```tsx
import { NodeTools } from '@node-edit-utils/react';

function Editor() {
  return (
    <NodeTools isVisible={true}>
      <EditableElement />
    </NodeTools>
  );
}
```

### `Viewport`

Component that creates a viewport with optional resize handle.

**Props:**
- `children: React.ReactNode` - Viewport content

**Example:**
```tsx
import { Viewport } from '@node-edit-utils/react';

function Canvas() {
  return (
    <Viewport>
      <YourCanvasContent />
    </Viewport>
  );
}
```

## 🪝 Hooks

### `useCanvasObserver()`

Monitor canvas state and interactions. Call this hook at the top level of your component tree.

**Returns:** `void`

**Example:**
```tsx
import { useCanvasObserver } from '@node-edit-utils/react';

function App() {
  useCanvasObserver();
  
  return <YourApp />;
}
```

### `useViewport()`

Access and control the viewport programmatically.

**Returns:** `Viewport` object with methods:
- `setWidth(width: number)` - Set viewport width
- `cleanup()` - Clean up the viewport

**Example:**
```tsx
import { useViewport } from '@node-edit-utils/react';

function ViewportController() {
  const viewport = useViewport();
  
  const handleResize = (newWidth: number) => {
    viewport.setWidth(newWidth);
  };
  
  return (
    <button onClick={() => handleResize(800)}>
      Set Width to 800px
    </button>
  );
}
```

### `useCanvasStartPosition(nodeToolsRef)`

Calculate and manage the initial canvas position based on node tools state.

**Parameters:**
- `nodeToolsRef: React.RefObject<NodeToolsRef>` - Reference to node tools

**Returns:** Object with:
- `x: number` - Initial X position
- `y: number` - Initial Y position
- `isReady: boolean` - Whether position is calculated

**Example:**
```tsx
import { useCanvasStartPosition } from '@node-edit-utils/react';
import { useRef } from 'react';

function CanvasWrapper() {
  const nodeToolsRef = useRef(null);
  const { x, y, isReady } = useCanvasStartPosition(nodeToolsRef);
  
  return (
    <>
      {isReady && <NodeTools ref={nodeToolsRef} />}
    </>
  );
}
```

## 💡 Complete Example

Here's a complete example of building an editable document editor:

```tsx
import { CanvasProvider, NodeTools, Viewport, useCanvasObserver } from '@node-edit-utils/react';
import '@node-edit-utils/core/styles.css';
import { useRef } from 'react';

function DocumentEditor() {
  useCanvasObserver();
  const nodeToolsRef = useRef(null);

  return (
    <CanvasProvider width={20000} height={15000}>
      <Viewport>
        <NodeTools ref={nodeToolsRef}>
          <div className="document">
            <h1 data-editable="true">Document Title</h1>
            <p data-editable="true">Click on any element to edit it.</p>
            <section data-editable="true">
              <h2>Section Header</h2>
              <p>Section content goes here.</p>
            </section>
          </div>
        </NodeTools>
      </Viewport>
    </CanvasProvider>
  );
}

export default DocumentEditor;
```

## 🎨 Styling

Import the core styles in your app:

```tsx
import '@node-edit-utils/core/styles.css';
```

You can customize styles using CSS variables:

```css
:root {
  --highlight-color: #3b82f6;
  --edit-border-color: #10b981;
  --highlight-border-width: 2px;
}
```

## 🔄 State Management

The package uses React Context internally to manage state. All components work together seamlessly without needing manual context setup.

For accessing tools programmatically:

```tsx
import { useRef } from 'react';
import { NodeTools } from '@node-edit-utils/react';

function MyEditor() {
  const nodeToolsRef = useRef(null);

  const handleSelectAll = () => {
    // Access node tools via ref
    const nodes = document.querySelectorAll('[data-editable]');
    nodes.forEach(node => {
      // You can interact with selected nodes here
    });
  };

  return (
    <>
      <button onClick={handleSelectAll}>Select All</button>
      <NodeTools ref={nodeToolsRef}>
        <YourContent />
      </NodeTools>
    </>
  );
}
```

## 🧹 Cleanup

Components automatically handle cleanup on unmount. You can also manually trigger cleanup:

```tsx
import { useViewport } from '@node-edit-utils/react';
import { useEffect } from 'react';

function Component() {
  const viewport = useViewport();

  useEffect(() => {
    return () => {
      viewport.cleanup();
    };
  }, [viewport]);

  return <div>Content</div>;
}
```

## 🚀 Performance Tips

1. **Use NodeTools Reference** - Keep refs to node tools for better control:
   ```tsx
   const nodeToolsRef = useRef(null);
   ```

2. **Memoize Content** - Wrap expensive content components with `React.memo`:
   ```tsx
   const MemoizedContent = React.memo(YourContent);
   ```

3. **Lazy Load** - Use React's `Suspense` for large canvases:
   ```tsx
   <Suspense fallback={<Loading />}>
     <CanvasProvider>...</CanvasProvider>
   </Suspense>
   ```

## 🤝 Integration Examples

### With Next.js

```tsx
'use client'; // Client component

import { CanvasProvider } from '@node-edit-utils/react';
import '@node-edit-utils/core/styles.css';

export default function Page() {
  return (
    <CanvasProvider width={20000} height={15000}>
      <YourContent />
    </CanvasProvider>
  );
}
```

### With TypeScript

```tsx
import type { NodeToolsRef } from '@node-edit-utils/core';
import { useRef } from 'react';

function Component() {
  const nodeToolsRef = useRef<NodeToolsRef>(null);
  
  return (
    <NodeTools ref={nodeToolsRef}>
      <Content />
    </NodeTools>
  );
}
```

## ⚠️ Notes

- The package uses browser APIs like ResizeObserver and MutationObserver
- Requires a modern browser (Chrome, Firefox, Safari, Edge)
- Always import the core styles for proper functionality
- The component tree must be within a Canvas context

## 🐛 Troubleshooting

### Styles not applying?
Make sure to import the CSS:
```tsx
import '@node-edit-utils/core/styles.css';
```

### Ref is null?
Ensure components are properly mounted before accessing refs.

### Events not working?
Check that `useCanvasObserver()` is called at the app level.

## 📝 License

CC-BY-NC-4.0

## 👤 Author

Fritz Benning <mail@fritzbenning.de>
