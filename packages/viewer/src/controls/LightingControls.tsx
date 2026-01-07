import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Accordion, AccordionTab } from 'primereact/accordion';

export type EnvironmentPreset = 'studio' | 'sunset' | 'dawn' | 'night' | 'forest' | 'apartment' | 'city' | 'park' | 'warehouse';

export interface LightingControlsProps {
  ambientIntensity: number;
  onAmbientIntensityChange: (value: number) => void;
  directionalIntensity: number;
  onDirectionalIntensityChange: (value: number) => void;
  environmentPreset: EnvironmentPreset;
  onEnvironmentPresetChange: (preset: EnvironmentPreset) => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  showAxes: boolean;
  onShowAxesChange: (show: boolean) => void;
}

export function LightingControls({
  ambientIntensity,
  onAmbientIntensityChange,
  directionalIntensity,
  onDirectionalIntensityChange,
  environmentPreset,
  onEnvironmentPresetChange,
  showGrid,
  onShowGridChange,
  showAxes,
  onShowAxesChange
}: LightingControlsProps) {
  const environmentPresets = [
    { id: 'studio' as EnvironmentPreset, label: 'Studio', icon: '🏢', description: 'Neutral lighting for design work' },
    { id: 'sunset' as EnvironmentPreset, label: 'Sunset', icon: '🌅', description: 'Warm golden hour lighting' },
    { id: 'dawn' as EnvironmentPreset, label: 'Dawn', icon: '🌄', description: 'Cool morning lighting' },
    { id: 'night' as EnvironmentPreset, label: 'Night', icon: '🌙', description: 'Dark moody lighting' },
    { id: 'forest' as EnvironmentPreset, label: 'Forest', icon: '🌲', description: 'Natural forest lighting' },
    { id: 'apartment' as EnvironmentPreset, label: 'Apartment', icon: '🏠', description: 'Indoor ambient lighting' },
    { id: 'city' as EnvironmentPreset, label: 'City', icon: '🏙️', description: 'Urban environment lighting' },
    { id: 'park' as EnvironmentPreset, label: 'Park', icon: '🌳', description: 'Outdoor park lighting' },
    { id: 'warehouse' as EnvironmentPreset, label: 'Warehouse', icon: '🏭', description: 'Industrial lighting' },
  ];

  const headerTemplate = (
    <div className="flex items-center space-x-2">
      <span>💡</span>
      <span>Lighting Controls</span>
    </div>
  );

  return (
    <Card className="p-4 mb-4">
      <Accordion className="w-full">
        <AccordionTab header={headerTemplate}>
          <div className="space-y-4">
            {/* Environment Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Environment:</span>
                <span className="text-xs text-gray-500">
                  {environmentPresets.find(e => e.id === environmentPreset)?.description}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {environmentPresets.map((env) => (
                  <Button
                    key={env.id}
                    variant={environmentPreset === env.id ? "primary" : "secondary"}
                    onClick={() => onEnvironmentPresetChange(env.id)}
                    className="flex items-center space-x-1 text-sm px-3 py-1"
                    title={env.description}
                  >
                    <span className="text-sm">{env.icon}</span>
                    <span>{env.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Lighting Intensity Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ambient Light Intensity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ambient Light: {ambientIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={ambientIntensity}
                  onChange={(e) => onAmbientIntensityChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Directional Light Intensity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Directional Light: {directionalIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={directionalIntensity}
                  onChange={(e) => onDirectionalIntensityChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Scene Helpers */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Scene Helpers
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => onShowGridChange(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Show Grid</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAxes}
                      onChange={(e) => onShowAxesChange(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Show Axes</span>
                  </label>
                </div>
              </div>

              {/* Reset Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reset
                </label>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onAmbientIntensityChange(0.6);
                    onDirectionalIntensityChange(0.8);
                    onEnvironmentPresetChange('studio');
                    onShowGridChange(true);
                    onShowAxesChange(true);
                  }}
                  className="w-full text-sm px-3 py-1"
                  title="Reset lighting to default values"
                >
                  💡 Reset Lighting
                </Button>
              </div>
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </Card>
  );
} 