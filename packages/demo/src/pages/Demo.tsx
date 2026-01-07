import { useState, useRef } from 'react';
import { ThreeCanvas, ModelWrapper, type ThreeCanvasRef, type ModelWrapperRef } from 'react-3d-model-viewer/core';
import { MaterialControls, LightingControls, VisualizationControls, MeshControls, type MaterialType, type EnvironmentPreset, type CameraAction, type MeshAction } from 'react-3d-model-viewer/controls';

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [materialType, setMaterialType] = useState<MaterialType>('standard');
  const [materialColor, setMaterialColor] = useState('#64748b');
  const [metalness, setMetalness] = useState(0.5);
  const [roughness, setRoughness] = useState(0.5);
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);
  const [directionalIntensity, setDirectionalIntensity] = useState(0.8);
  const [environmentPreset, setEnvironmentPreset] = useState<EnvironmentPreset>('studio');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [cameraAction, setCameraAction] = useState<CameraAction>('rotate');
  const [meshAction, setMeshAction] = useState<MeshAction>('none');

  const canvasRef = useRef<ThreeCanvasRef>(null);
  const modelWrapperRef = useRef<ModelWrapperRef>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleResetCamera = () => {
    canvasRef.current?.resetCamera();
  };

  const handleResetTransform = () => {
    modelWrapperRef.current?.resetTransform();
  };

  const handleResetToOriginal = () => {
    modelWrapperRef.current?.resetToOriginalMaterials();
  };

  const handleResetToDefault = () => {
    setMaterialType('standard');
    setMaterialColor('#64748b');
    setMetalness(0.5);
    setRoughness(0.5);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-pool-deck-800 mb-4">
            Upload 3D Model
          </h2>
          <input
            type="file"
            accept=".stl,.obj,.gltf,.glb,.fbx,.dae,.3ds,.zip"
            onChange={handleFileChange}
            className="block w-full text-sm text-pool-deck-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-aqua-blue-50 file:text-aqua-blue-700
              hover:file:bg-aqua-blue-100
              cursor-pointer"
          />
          <p className="mt-2 text-sm text-pool-deck-500">
            Supported formats: STL, OBJ, GLTF/GLB, FBX, DAE, 3DS, ZIP
          </p>
        </div>

        {/* Viewer and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <MaterialControls
              selectedMaterialType={materialType}
              onMaterialTypeSelect={setMaterialType}
              materialColor={materialColor}
              onColorChange={setMaterialColor}
              metalness={metalness}
              onMetalnessChange={setMetalness}
              roughness={roughness}
              onRoughnessChange={setRoughness}
              isModelLoaded={!!selectedFile}
              onResetToOriginal={handleResetToOriginal}
              onResetToDefault={handleResetToDefault}
            />

            <LightingControls
              ambientIntensity={ambientIntensity}
              onAmbientIntensityChange={setAmbientIntensity}
              directionalIntensity={directionalIntensity}
              onDirectionalIntensityChange={setDirectionalIntensity}
              environmentPreset={environmentPreset}
              onEnvironmentPresetChange={setEnvironmentPreset}
              showGrid={showGrid}
              onShowGridChange={setShowGrid}
              showAxes={showAxes}
              onShowAxesChange={setShowAxes}
            />

            <VisualizationControls
              selectedAction={cameraAction}
              onActionSelect={setCameraAction}
              onResetView={handleResetCamera}
            />

            <MeshControls
              selectedAction={meshAction}
              onActionSelect={setMeshAction}
              onResetMesh={handleResetTransform}
            />
          </div>

          {/* Viewer Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-[600px]">
                {selectedFile ? (
                  <ThreeCanvas
                    ref={canvasRef}
                    selectedCameraAction={cameraAction}
                    ambientIntensity={ambientIntensity}
                    directionalIntensity={directionalIntensity}
                    environmentPreset={environmentPreset}
                    showGrid={showGrid}
                    showAxes={showAxes}
                  >
                    <ModelWrapper
                      ref={modelWrapperRef}
                      file={selectedFile}
                      selectedMeshAction={meshAction}
                      materialType={materialType}
                      materialColor={materialColor}
                      metalness={metalness}
                      roughness={roughness}
                      cameraRef={canvasRef}
                    />
                  </ThreeCanvas>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-xl text-pool-deck-600">
                        Upload a 3D model to get started
                      </p>
                      <p className="text-sm text-pool-deck-400 mt-2">
                        Supports STL, OBJ, GLTF, FBX, DAE, 3DS
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
