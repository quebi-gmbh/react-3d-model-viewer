import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Accordion, AccordionTab } from 'primereact/accordion';

export type MaterialType = 'standard' | 'basic' | 'phong' | 'lambert' | 'wireframe';

interface MaterialControlsProps {
  selectedMaterialType: MaterialType;
  onMaterialTypeSelect: (type: MaterialType) => void;
  materialColor: string;
  onColorChange: (color: string) => void;
  metalness: number;
  onMetalnessChange: (value: number) => void;
  roughness: number;
  onRoughnessChange: (value: number) => void;
  isModelLoaded: boolean;
  onResetToOriginal: () => void;
  onResetToDefault: () => void;
}

export function MaterialControls({
  selectedMaterialType,
  onMaterialTypeSelect,
  materialColor,
  onColorChange,
  metalness,
  onMetalnessChange,
  roughness,
  onRoughnessChange,
  isModelLoaded,
  onResetToOriginal,
  onResetToDefault
}: MaterialControlsProps) {
  const materialTypes = [
    {
      id: 'standard' as MaterialType,
      label: 'Standard',
      icon: '🌟',
      description: 'Physically based material with metalness and roughness'
    },
    {
      id: 'basic' as MaterialType,
      label: 'Basic',
      icon: '🎨',
      description: 'Simple unlit material'
    },
    {
      id: 'phong' as MaterialType,
      label: 'Phong',
      icon: '✨',
      description: 'Glossy material with specular highlights'
    },
    {
      id: 'lambert' as MaterialType,
      label: 'Lambert',
      icon: '🔆',
      description: 'Matte material that responds to lighting'
    },
    {
      id: 'wireframe' as MaterialType,
      label: 'Wireframe',
      icon: '🕸️',
      description: 'Show model structure as wireframe'
    },
  ];

  const headerTemplate = (
    <div className="flex items-center space-x-2">
      <span>🎨</span>
      <span>Material Controls</span>
    </div>
  );

  return (
    <Card className="p-4 mb-4">
      <Accordion className="w-full">
        <AccordionTab header={headerTemplate}>
          <div className="space-y-4">
            {/* Material Type Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Material Type:</span>
                <span className="text-xs text-gray-500">
                  {!isModelLoaded 
                    ? "Upload a model to enable material controls"
                    : materialTypes.find(m => m.id === selectedMaterialType)?.description
                  }
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {materialTypes.map((material) => (
                  <Button
                    key={material.id}
                    variant={selectedMaterialType === material.id ? "primary" : "secondary"}
                    onClick={() => onMaterialTypeSelect(material.id)}
                    className="flex items-center space-x-1 text-sm px-3 py-1"
                    title={material.description}
                    disabled={!isModelLoaded}
                  >
                    <span className="text-sm">{material.icon}</span>
                    <span>{material.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Material Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Color Picker */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={materialColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer disabled:opacity-50"
                    disabled={!isModelLoaded}
                  />
                  <input
                    type="text"
                    value={materialColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 disabled:opacity-50"
                    placeholder="#64748b"
                    disabled={!isModelLoaded}
                  />
                </div>
              </div>

              {/* Metalness Slider - only for standard material */}
              {selectedMaterialType === 'standard' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Metalness: {metalness.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={metalness}
                    onChange={(e) => onMetalnessChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    disabled={!isModelLoaded}
                  />
                </div>
              )}

              {/* Roughness Slider - only for standard material */}
              {selectedMaterialType === 'standard' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Roughness: {roughness.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roughness}
                    onChange={(e) => onRoughnessChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    disabled={!isModelLoaded}
                  />
                </div>
              )}

              {/* Reset Buttons */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reset Options
                </label>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="secondary"
                    onClick={onResetToOriginal}
                    className="w-full text-sm px-3 py-1"
                    title="Reset to original material from the file"
                    disabled={!isModelLoaded}
                  >
                    📂 Reset to Original
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onResetToDefault}
                    className="w-full text-sm px-3 py-1"
                    title="Reset to default material values"
                    disabled={!isModelLoaded}
                  >
                    🔄 Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </Card>
  );
} 