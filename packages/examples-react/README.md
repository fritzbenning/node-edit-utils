# Node Edit Utils - React Examples

A demonstration application showcasing the capabilities of `@node-edit-utils/core` and `@node-edit-utils/react` packages. This example includes interactive node selection, text editing, and canvas manipulation.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation & Running

```bash
# From the project root
pnpm install

# Start the development server
pnpm dev

# The example app will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the example
pnpm build

# Preview the production build
pnpm preview
```

## 📖 What's Included

This example demonstrates:

- **Interactive Node Selection** - Click on elements to select and highlight them
- **Text Editing** - Edit text content of selected nodes inline
- **Canvas Manipulation** - Zoom, pan, and resize viewport
- **Responsive Design** - Beautiful UI built with Tailwind CSS
- **React Integration** - Full React component examples

## 🎯 Features Demonstrated

### 1. Basic Node Selection

Click on any product card to select it. The selected element is highlighted with a visual frame.

```tsx
// From the example app
<ProductCard 
  name="React T-Shirt" 
  price={29} 
  rating={4} 
  inStock={true} 
/>
```

### 2. Text Editing

Once a node is selected, you can edit its text content. Press Escape to exit edit mode.

### 3. Canvas Viewport

The entire content area is wrapped in a resizable viewport that supports:
- Zooming with scroll wheel
- Panning by dragging
- Resizable viewport width

## 📁 Project Structure

```
packages/examples-react/
├── src/
│   ├── App.tsx                 # Main application
│   ├── App.css                 # App styles
│   ├── main.tsx                # Entry point
│   ├── vite-env.d.ts          # Vite environment types
│   ├── components/
│   │   ├── cards/
│   │   │   └── ProductCard.tsx # Editable product card
│   │   ├── sections/
│   │   │   └── ...
│   │   ├── actions/
│   │   │   └── ...
│   │   └── styles/
│   ├── examples/
│   │   ├── DefaultExample.tsx  # Main example component
│   │   └── index.ts
│   ├── assets/
│   ├── styles/
│   │   └── globals.css
│   ├── index.html              # HTML entry point
│   └── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 💻 Development

### Available Scripts

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

### File Watching

During development, changes to the core packages and react wrappers are automatically rebuilt and hot-reloaded.

## 🎨 Code Examples

### Example 1: Setting Up the Canvas Provider

```tsx
import { CanvasProvider } from '@node-edit-utils/react';
import '@node-edit-utils/core/styles.css';

export function App() {
  return (
    <CanvasProvider width={20000} height={15000}>
      {/* Your editable content */}
    </CanvasProvider>
  );
}
```

### Example 2: Creating an Editable Component

```tsx
function ProductCard({ name, price, rating, inStock }) {
  return (
    <div className="card" data-editable="true">
      <h2>{name}</h2>
      <div className="price">${price}</div>
      <div className="rating">⭐ {rating}</div>
      <div className={`stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </div>
    </div>
  );
}
```

### Example 3: Using Hooks

```tsx
import { useCanvasObserver, useViewport } from '@node-edit-utils/react';

function Editor() {
  useCanvasObserver(); // Setup canvas observer
  const viewport = useViewport(); // Access viewport controls

  const handleZoom = (scale) => {
    // Zoom logic here
  };

  return (
    <div>
      <button onClick={() => handleZoom(1.5)}>Zoom In</button>
    </div>
  );
}
```

## 🎮 User Interactions

### Selecting Elements

1. **Click** on any element in the canvas to select it
2. A blue highlight frame appears around the selected element
3. The element becomes editable

### Editing Text

1. Double-click on text content or select an element
2. Edit the text directly
3. Press **Escape** to exit edit mode

### Canvas Navigation

- **Scroll** - Zoom in/out
- **Drag** - Pan around the canvas
- **Drag Edge** - Resize the viewport

## 🛠️ Customization

### Modify Styling

Edit `src/App.css` and `src/styles/globals.css` to customize the appearance.

### Add New Examples

Create new files in `src/examples/` and add routes in `App.tsx`:

```tsx
import { HashRouter, Route, Routes } from "react-router-dom";
import DefaultExample from "./examples/DefaultExample";
import NewExample from "./examples/NewExample";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DefaultExample />} />
        <Route path="/new" element={<NewExample />} />
      </Routes>
    </HashRouter>
  );
}
```

### Use Different Canvas Sizes

Modify the `CanvasProvider` dimensions in `DefaultExample.tsx`:

```tsx
<CanvasProvider width={30000} height={20000}>
  {/* Your content */}
</CanvasProvider>
```

## 📦 Dependencies

Main dependencies:

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing
- **@markup-canvas/react** - Canvas rendering
- **@node-edit-utils/core** - Core utilities
- **@node-edit-utils/react** - React wrappers

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The `dist/` folder contains static files that can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🐛 Troubleshooting

### Styles not appearing?

Make sure you import the core styles:
```tsx
import '@node-edit-utils/core/styles.css';
```

### Port 5173 already in use?

Change the port in `vite.config.ts`:
```ts
export default {
  server: {
    port: 3000
  }
}
```

### Changes not hot-reloading?

Ensure you're running `pnpm dev` from the project root, not just this package.

## 📚 Learning Resources

- [Node Edit Utils Docs](https://github.com/fritzbenning/node-edit-utils)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Found a bug or want to improve the example?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

CC-BY-NC-4.0

## 👤 Author

Fritz Benning <mail@fritzbenning.de>

## 🔗 Links

- [Main Repository](https://github.com/fritzbenning/node-edit-utils)
- [Core Package](../core/README.md)
- [React Package](../react/README.md)
