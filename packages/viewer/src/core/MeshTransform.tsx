import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MeshAction } from '../controls/MeshControls';

export interface MeshTransformProps {
  selectedAction: MeshAction;
  enabled: boolean;
}

export interface MeshTransformRef {
  resetTransform: () => void;
  attachToObject: (object: THREE.Group | THREE.Mesh) => void;
}

export const MeshTransform = forwardRef<MeshTransformRef, MeshTransformProps>(
  ({ selectedAction, enabled }, ref) => {
    const transformRef = useRef<any>(null);
    const [targetObject, setTargetObject] = useState<THREE.Group | THREE.Mesh | null>(null);
    const originalTransform = useRef<{
      position: THREE.Vector3;
      rotation: THREE.Euler;
      scale: THREE.Vector3;
    } | null>(null);

    // Store original transform when model is first attached
    useEffect(() => {
      if (targetObject && !originalTransform.current) {
        originalTransform.current = {
          position: targetObject.position.clone(),
          rotation: targetObject.rotation.clone(),
          scale: targetObject.scale.clone(),
        };
      }
    }, [targetObject]);

    // Reset original transform when object changes
    useEffect(() => {
      originalTransform.current = null;
    }, [targetObject]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      resetTransform: () => {
        if (targetObject && originalTransform.current) {
          targetObject.position.copy(originalTransform.current.position);
          targetObject.rotation.copy(originalTransform.current.rotation);
          targetObject.scale.copy(originalTransform.current.scale);
        }
      },
      attachToObject: (object: THREE.Group | THREE.Mesh) => {
        setTargetObject(object);
      },
    }));

    // Update transform controls mode based on selected action
    useEffect(() => {
      if (transformRef.current && targetObject) {
        switch (selectedAction) {
          case 'translate':
            transformRef.current.setMode('translate');
            break;
          case 'rotate':
            transformRef.current.setMode('rotate');
            break;
          case 'scale':
            transformRef.current.setMode('scale');
            break;
          default:
            transformRef.current.setMode('translate');
        }
      }
    }, [selectedAction, targetObject]);

    // Don't render if no object, not enabled, or no action selected
    if (!targetObject || !enabled || selectedAction === 'none') {
      return null;
    }

    return (
      <TransformControls
        ref={transformRef}
        object={targetObject}
        mode={selectedAction}
        enabled={enabled}
        showX={true}
        showY={true}
        showZ={true}
        size={1}
        space="world"
      />
    );
  }
); 