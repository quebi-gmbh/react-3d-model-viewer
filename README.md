# React 3D Model Viewer

A modular React component library for 3D model visualization with Three.js. Supports STL, OBJ, GLTF/GLB, FBX, DAE, and 3DS formats.

## 🎯 Features

- 📦 **Multiple Formats** - STL, OBJ, GLTF/GLB, FBX, DAE, 3DS, and ZIP packages
- 🎨 **Material Controls** - Standard, Phong, Lambert, Basic, and Wireframe materials
- 💡 **Lighting System** - Configurable ambient, directional, and environment lighting
- 🎯 **Transform Controls** - Interactive translate, rotate, and scale operations
- 🧩 **Modular Architecture** - Tree-shakeable exports for minimal bundle size
- ⚡ **TypeScript Support** - Fully typed with comprehensive type definitions
- 🔧 **Customizable** - Flexible props and styling options

## 📦 Installation

```bash
npm install react-3d-model-viewer three @react-three/fiber @react-three/drei
```

or

```bash
pnpm add react-3d-model-viewer three @react-three/fiber @react-three/drei
```

## 🚀 Quick Start

```tsx
import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';
import { MaterialControls } from 'react-3d-model-viewer/controls';

function MyViewer() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <ThreeCanvas>
        <ModelWrapper
          file={file}
          materialType="standard"
          materialColor="#64748b"
          selectedMeshAction="none"
          metalness={0.5}
          roughness={0.5}
        />
      </ThreeCanvas>
    </>
  );
}
```

## 📚 Documentation

- [Live Demo](https://yourusername.github.io/react-3d-model-viewer/)
- [API Documentation](./packages/viewer/README.md)
- [Examples](https://yourusername.github.io/react-3d-model-viewer/examples)

## 🏗️ Monorepo Structure

This project uses pnpm workspaces:

```
react-3d-model-viewer/
├── packages/
│   ├── viewer/          # Main library package (published to npm)
│   └── demo/            # Demo application (deployed to GitHub Pages)
├── .github/workflows/   # CI/CD workflows
└── package.json         # Root workspace configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build viewer library
pnpm build:viewer

# Run demo app locally
pnpm dev

# Build everything
pnpm build
```

### Available Scripts

- `pnpm build` - Build all packages
- `pnpm build:viewer` - Build viewer library only
- `pnpm build:demo` - Build demo app only
- `pnpm dev` - Run demo app in development mode
- `pnpm typecheck` - Run TypeScript type checking

## 📦 Publishing

The library is automatically published to npm when a new release is created or a version tag is pushed:

```bash
# Create a new version
cd packages/viewer
npm version patch  # or minor, or major

# Push tag to GitHub
git push origin v1.0.1

# Or create a GitHub Release through the UI
```

## 🚀 Deployment

The demo application is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [React Three Drei](https://github.com/pmndrs/drei)
- [Vite](https://vitejs.dev/)
