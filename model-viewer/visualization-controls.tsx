import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export type CameraAction = 'rotate' | 'pan' | 'zoom' | 'none';

interface VisualizationControlsProps {
  selectedAction: CameraAction;
  onActionSelect: (action: CameraAction) => void;
  onResetView: () => void;
}

export function VisualizationControls({ 
  selectedAction, 
  onActionSelect, 
  onResetView
}: VisualizationControlsProps) {
  const actions = [
    { 
      id: 'rotate' as CameraAction, 
      label: 'Rotate', 
      icon: '↻',
      description: 'Left click + drag to rotate view'
    },
    { 
      id: 'pan' as CameraAction, 
      label: 'Pan', 
      icon: '✋',
      description: 'Left click + drag to pan view'
    },
    { 
      id: 'zoom' as CameraAction, 
      label: 'Zoom', 
      icon: '🔍',
      description: 'Left click + drag to zoom view'
    },
  ];

  const handleActionClick = (actionId: CameraAction) => {
    // Toggle: if already selected, deselect (set to 'none')
    if (selectedAction === actionId) {
      onActionSelect('none');
    } else {
      onActionSelect(actionId);
    }
  };

  const headerTemplate = (
    <div className="flex items-center space-x-2">
      <span>📷</span>
      <span>Camera Controls</span>
    </div>
  );

  return (
    <Card className="p-4 mb-4">
      <Accordion className="w-full">
        <AccordionTab header={headerTemplate}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Camera Controls:</span>
                <div className="flex space-x-1">
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      variant={selectedAction === action.id ? "primary" : "secondary"}
                      onClick={() => handleActionClick(action.id)}
                      className="flex items-center space-x-1 text-sm px-3 py-1"
                      title={selectedAction === action.id ? "Click to deselect" : action.description}
                    >
                      <span className="text-sm">{action.icon}</span>
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {selectedAction !== 'none' 
                    ? `${actions.find(a => a.id === selectedAction)?.description}` 
                    : "Click a camera action above or use traditional mouse controls"
                  }
                </span>
                <Button
                  variant="secondary"
                  onClick={onResetView}
                  className="flex items-center space-x-1 text-sm px-3 py-1"
                  title="Reset camera to default position"
                >
                  <span className="text-sm">🏠</span>
                  <span>Reset View</span>
                </Button>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 border-t pt-3">
              <strong>Always available:</strong> 
              • Mouse wheel for zoom 
              • Right-click + drag for pan 
              • Middle-click + drag for rotate
              <br />
              <strong>Selected action:</strong> Left-click + drag will perform the selected camera action above
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </Card>
  );
} 