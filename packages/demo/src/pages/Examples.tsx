export default function Examples() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Basic Example */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-pool-deck-800 mb-4">
            Basic Viewer
          </h2>
          <p className="text-pool-deck-600 mb-4">
            The simplest way to display a 3D model.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code className="text-pool-deck-800">{`import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';

function BasicViewer() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="h-96">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
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
}`}</code>
            </pre>
          </div>
        </div>

        {/* With Material Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-pool-deck-800 mb-4">
            With Material Controls
          </h2>
          <p className="text-pool-deck-600 mb-4">
            Add interactive material customization.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code className="text-pool-deck-800">{`import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';
import { MaterialControls } from 'react-3d-model-viewer/controls';

function ViewerWithControls() {
  const [file, setFile] = useState<File | null>(null);
  const [materialType, setMaterialType] = useState('standard');
  const [color, setColor] = useState('#64748b');

  return (
    <>
      <MaterialControls
        selectedMaterialType={materialType}
        onMaterialTypeSelect={setMaterialType}
        materialColor={color}
        onColorChange={setColor}
        // ... other props
      />
      <ThreeCanvas>
        <ModelWrapper
          file={file}
          materialType={materialType}
          materialColor={color}
          // ... other props
        />
      </ThreeCanvas>
    </>
  );
}`}</code>
            </pre>
          </div>
        </div>

        {/* Modular Imports */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-pool-deck-800 mb-4">
            Modular Imports
          </h2>
          <p className="text-pool-deck-600 mb-4">
            Import only what you need for better tree-shaking.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code className="text-pool-deck-800">{`// Import from core module
import { ThreeCanvas, ModelWrapper } from 'react-3d-model-viewer/core';

// Import from controls module
import {
  MaterialControls,
  LightingControls
} from 'react-3d-model-viewer/controls';

// Import from utils module
import { ZipExtractor } from 'react-3d-model-viewer/utils';

// Or import everything (larger bundle)
import {
  ThreeCanvas,
  ModelWrapper,
  MaterialControls
} from 'react-3d-model-viewer';`}</code>
            </pre>
          </div>
        </div>

        {/* TypeScript Support */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-pool-deck-800 mb-4">
            TypeScript Support
          </h2>
          <p className="text-pool-deck-600 mb-4">
            Fully typed with comprehensive type definitions.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code className="text-pool-deck-800">{`import {
  ThreeCanvas,
  ModelWrapper,
  type ThreeCanvasRef,
  type ModelWrapperRef
} from 'react-3d-model-viewer/core';

import type {
  MaterialType,
  CameraAction
} from 'react-3d-model-viewer/types';

function TypedViewer() {
  const canvasRef = useRef<ThreeCanvasRef>(null);
  const [materialType, setMaterialType] = useState<MaterialType>('standard');

  // TypeScript will provide autocomplete and type checking
  return (
    <ThreeCanvas ref={canvasRef}>
      {/* ... */}
    </ThreeCanvas>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
