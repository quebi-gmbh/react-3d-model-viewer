# React 3D Model Viewer

A modular React component library for 3D model visualization with Three.js.

## Installation

```bash
npm install react-3d-model-viewer three @react-three/fiber @react-three/drei
```

## Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.95.0"
}
```

## Supported Formats

- **STL** - Stereolithography (3D printing)
- **OBJ** - Wavefront OBJ (with optional MTL materials)
- **GLTF/GLB** - GL Transmission Format (PBR materials)
- **FBX** - Autodesk FBX
- **DAE** - Collada
- **3DS** - 3D Studio
- **ZIP** - ZIP packages containing GLTF and resources

## Quick Start

```tsx
import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';

function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ height: '600px' }}>
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
    </div>
  );
}
```

## Modular Imports

The library supports tree-shakeable modular imports:

```tsx
// Import from core module (3D viewer components)
import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';

// Import from controls module (UI control panels)
import { MaterialControls, LightingControls } from 'react-3d-model-viewer/controls';

// Import from utils module
import { ZipExtractor } from 'react-3d-model-viewer/utils';

// Import types
import type { MaterialType, CameraAction } from 'react-3d-model-viewer/types';
```

## Core Components

### ThreeCanvas

The main 3D canvas container with camera and lighting setup.

```tsx
import { ThreeCanvas } from 'react-3d-model-viewer/core';

<ThreeCanvas
  selectedCameraAction="rotate"
  ambientIntensity={0.6}
  directionalIntensity={0.8}
  environmentPreset="studio"
  showGrid={true}
  showAxes={true}
>
  {/* Your 3D content here */}
</ThreeCanvas>
```

**Props:**
- `selectedCameraAction?: CameraAction` - Camera interaction mode ('rotate' | 'pan' | 'zoom' | 'none')
- `ambientIntensity?: number` - Ambient light intensity (0-1)
- `directionalIntensity?: number` - Directional light intensity (0-1)
- `environmentPreset?: EnvironmentPreset` - Environment map preset
- `showGrid?: boolean` - Show grid helper
- `showAxes?: boolean` - Show axis helpers

**Ref Methods:**
- `resetCamera()` - Reset camera to initial position
- `fitCameraToObject(object)` - Fit camera to view an object

### ModelWrapper

Wrapper for loading and displaying 3D models with material application.

```tsx
import { ModelWrapper } from 'react-3d-model-viewer/core';

<ModelWrapper
  file={file}
  cloudFileUrl="https://example.com/model.glb"
  materialType="standard"
  materialColor="#64748b"
  metalness={0.5}
  roughness={0.5}
  selectedMeshAction="none"
  onLoad={(model) => console.log('Loaded', model)}
  onError={(error) => console.error('Error', error)}
  onProgress={(progress, status) => console.log(progress, status)}
/>
```

**Props:**
- `file?: File | null` - Local file to load
- `cloudFileUrl?: string` - URL to load model from
- `materialType: MaterialType` - Material type ('standard' | 'basic' | 'phong' | 'lambert' | 'wireframe')
- `materialColor: string` - Material color (hex)
- `metalness: number` - Metalness value (0-1, for standard material)
- `roughness: number` - Roughness value (0-1, for standard material)
- `selectedMeshAction: MeshAction` - Transform mode ('translate' | 'rotate' | 'scale' | 'none')
- `cameraRef?: React.RefObject<ThreeCanvasRef>` - Reference to ThreeCanvas for camera control
- `onLoad?: (geometry) => void` - Callback when model loads
- `onError?: (error) => void` - Callback on error
- `onProgress?: (progress, status) => void` - Callback for loading progress

**Ref Methods:**
- `resetTransform()` - Reset model transform to origin
- `resetToOriginalMaterials()` - Restore original materials from file

## Control Components

### MaterialControls

UI panel for material customization.

```tsx
import { MaterialControls } from 'react-3d-model-viewer/controls';

<MaterialControls
  selectedMaterialType={materialType}
  onMaterialTypeSelect={setMaterialType}
  materialColor={color}
  onColorChange={setColor}
  metalness={metalness}
  onMetalnessChange={setMetalness}
  roughness={roughness}
  onRoughnessChange={setRoughness}
  isModelLoaded={!!file}
  onResetToOriginal={() => {}}
  onResetToDefault={() => {}}
/>
```

### LightingControls

UI panel for lighting and environment configuration.

```tsx
import { LightingControls } from 'react-3d-model-viewer/controls';

<LightingControls
  ambientIntensity={ambient}
  onAmbientIntensityChange={setAmbient}
  directionalIntensity={directional}
  onDirectionalIntensityChange={setDirectional}
  environmentPreset={preset}
  onEnvironmentPresetChange={setPreset}
  showGrid={showGrid}
  onShowGridChange={setShowGrid}
  showAxes={showAxes}
  onShowAxesChange={setShowAxes}
/>
```

### VisualizationControls

UI panel for camera control mode selection.

```tsx
import { VisualizationControls } from 'react-3d-model-viewer/controls';

<VisualizationControls
  selectedAction={cameraAction}
  onActionSelect={setCameraAction}
  onResetView={() => canvasRef.current?.resetCamera()}
/>
```

### MeshControls

UI panel for mesh transformation mode selection.

```tsx
import { MeshControls } from 'react-3d-model-viewer/controls';

<MeshControls
  selectedAction={meshAction}
  onActionSelect={setMeshAction}
  onResetMesh={() => modelRef.current?.resetTransform()}
/>
```

## TypeScript Support

The library is fully typed. Import types from the types module:

```tsx
import type {
  MaterialType,
  CameraAction,
  MeshAction,
  EnvironmentPreset,
  ThreeCanvasRef,
  ModelWrapperRef,
} from 'react-3d-model-viewer/types';
```

## License

MIT
