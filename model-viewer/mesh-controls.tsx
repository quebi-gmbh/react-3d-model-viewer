import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Accordion, AccordionTab } from 'primereact/accordion';

export type MeshAction = 'translate' | 'rotate' | 'scale' | 'none';

interface MeshControlsProps {
  selectedAction: MeshAction;
  onActionSelect: (action: MeshAction) => void;
  onResetMesh: () => void;
  isModelLoaded: boolean;
}

export function MeshControls({ 
  selectedAction, 
  onActionSelect, 
  onResetMesh,
  isModelLoaded 
}: MeshControlsProps) {
  const actions = [
    { 
      id: 'translate' as MeshAction, 
      label: 'Translate', 
      icon: '⬌',
      description: 'Left click + drag to move the model'
    },
    { 
      id: 'rotate' as MeshAction, 
      label: 'Rotate', 
      icon: '🔄',
      description: 'Left click + drag to rotate the model'
    },
    { 
      id: 'scale' as MeshAction, 
      label: 'Scale', 
      icon: '⤢',
      description: 'Left click + drag to scale the model'
    },
  ];

  const handleActionClick = (actionId: MeshAction) => {
    // Toggle: if already selected, deselect (set to 'none')
    if (selectedAction === actionId) {
      onActionSelect('none');
    } else {
      onActionSelect(actionId);
    }
  };

  const headerTemplate = (
    <div className="flex items-center space-x-2">
      <span>🔧</span>
      <span>Mesh Controls</span>
    </div>
  );

  return (
    <Card className="p-4 mb-4">
      <Accordion className="w-full">
        <AccordionTab header={headerTemplate}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Mesh Controls:</span>
                <div className="flex space-x-1">
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={selectedAction === action.id ? "primary" : "secondary"}
                      onClick={() => handleActionClick(action.id)}
                      className="flex items-center space-x-1 text-sm px-3 py-1"
                      title={!isModelLoaded ? "Upload a model first" : selectedAction === action.id ? "Click to deselect" : action.description}
                      disabled={!isModelLoaded}
                    >
                      <span className="text-sm">{action.icon}</span>
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {!isModelLoaded 
                    ? "Upload a model to enable mesh controls"
                    : selectedAction !== 'none' 
                      ? `${actions.find(a => a.id === selectedAction)?.description}`
                      : "Click a mesh action above to transform the model"
                  }
                </span>
                <Button
                  variant="secondary"
                  onClick={onResetMesh}
                  className="flex items-center space-x-1 text-sm px-3 py-1"
                  title="Reset model to original position, rotation, and scale"
                  disabled={!isModelLoaded}
                >
                  <span className="text-sm">🔄</span>
                  <span>Reset Mesh</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 border-t pt-3">
              {!isModelLoaded ? (
                <span className="text-amber-600">
                  <strong>Upload a model to enable mesh controls</strong>
                </span>
              ) : (
                <>
                  <strong>Mesh manipulation:</strong> 
                  • Select an action above and left-click + drag on the model to transform it
                  <br />
                  <strong>Precise control:</strong> 
                  • Hold Shift for slower, more precise transformations
                  • Hold Ctrl for constrained transformations (single axis)
                </>
              )}
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </Card>
  );
} 