import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { Suspense, useRef, useImperativeHandle, forwardRef } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';
import type { CameraAction } from './visualization-controls';
import type { EnvironmentPreset } from './lighting-controls';

interface ThreeCanvasProps {
  children?: ReactNode;
  className?: string;
  selectedCameraAction?: CameraAction;
  disableCameraControls?: boolean;
  ambientIntensity?: number;
  directionalIntensity?: number;
  environmentPreset?: EnvironmentPreset;
  showGrid?: boolean;
  showAxes?: boolean;
}

export interface ThreeCanvasRef {
  resetCamera: () => void;
  fitCameraToObject: (object: THREE.Object3D) => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#94a3b8" wireframe />
    </mesh>
  );
}

export const ThreeCanvas = forwardRef<ThreeCanvasRef, ThreeCanvasProps>(
  ({ 
    children, 
    className = '', 
    selectedCameraAction = 'rotate', 
    disableCameraControls = false,
    ambientIntensity = 0.6,
    directionalIntensity = 0.8,
    environmentPreset = 'studio',
    showGrid = true,
    showAxes = true
  }, ref) => {
    const controlsRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      },
      fitCameraToObject: (object: THREE.Object3D) => {
        if (controlsRef.current && controlsRef.current.object) {
          const camera = controlsRef.current.object;
          const controls = controlsRef.current;
          
          // Calculate bounding box
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          // Calculate distance needed to fit object in view
          const maxDimension = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const distance = maxDimension / (2 * Math.tan(fov / 2));
          
          // Add some padding (20% extra distance)
          const paddedDistance = distance * 1.2;
          
          // Keep the current camera angle, just adjust distance from target
          const currentDirection = camera.position.clone().sub(controls.target).normalize();
          const newPosition = center.clone().add(currentDirection.multiplyScalar(paddedDistance));
          
          // Update camera position and controls target (preserves current viewing angle)
          camera.position.copy(newPosition);
          controls.target.copy(center);
          controls.update();
          
          console.log('Camera fitted to object (angle preserved):', {
            center,
            size,
            maxDimension,
            distance: paddedDistance,
            currentDirection,
            newPosition
          });
        }
      },
    }));

    // Configure OrbitControls based on selected camera action
    const getControlsConfig = () => {
      // If camera controls are disabled, disable all mouse interactions
      if (disableCameraControls) {
        return {
          enablePan: false,
          enableZoom: false,
          enableRotate: false,
          enabled: false,
        };
      }

      switch (selectedCameraAction) {
        case 'pan':
          return {
            enablePan: true,
            enableZoom: false,
            enableRotate: false,
            enabled: true,
            mouseButtons: {
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE,
            },
          };
        case 'zoom':
          return {
            enablePan: false,
            enableZoom: true,
            enableRotate: false,
            enabled: true,
            mouseButtons: {
              LEFT: THREE.MOUSE.DOLLY,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE,
            },
          };
        case 'rotate':
        default:
          return {
            enablePan: true,
            enableZoom: true,
            enableRotate: true,
            enabled: true,
            mouseButtons: {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            },
          };
        case 'none':
          return {
            enablePan: true,
            enableZoom: true,
            enableRotate: true,
            enabled: true,
            mouseButtons: {
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            },
          };
      }
    };

    const controlsConfig = getControlsConfig();

    return (
      <div className={`w-full h-full ${className}`}>
        <Canvas
          camera={{ position: [8, 6, 8], fov: 50, near: 0.1, far: 1000 }}
          shadows
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#f8fafc' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* Lighting Setup */}
            <ambientLight intensity={ambientIntensity} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={directionalIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            <pointLight position={[10, -10, 10]} intensity={0.3} />
            
            {/* Environment and Grid */}
            <Environment preset={environmentPreset} />
            {/* Double-sided grid visible from all angles */}
            {showGrid && (
              <>
                <Grid
                  renderOrder={-1}
                  position={[0, -2, 0]}
                  infiniteGrid
                  cellSize={1}
                  cellThickness={0.6}
                  sectionSize={10}
                  sectionThickness={1.5}
                  fadeDistance={30}
                  fadeStrength={1}
                  side={THREE.DoubleSide}
                />
                {/* Additional reference planes for better spatial orientation */}
                {/* Horizontal plane at center */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[50, 50]} />
                  <meshBasicMaterial 
                    color="#e0e0e0" 
                    transparent 
                    opacity={0.15} 
                    side={THREE.DoubleSide}
                    wireframe
                  />
                </mesh>
                {/* Vertical plane (XY) */}
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[50, 50]} />
                  <meshBasicMaterial 
                    color="#e0e0e0" 
                    transparent 
                    opacity={0.1} 
                    side={THREE.DoubleSide}
                    wireframe
                  />
                </mesh>
                {/* Vertical plane (YZ) */}
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <planeGeometry args={[50, 50]} />
                  <meshBasicMaterial 
                    color="#e0e0e0" 
                    transparent 
                    opacity={0.1} 
                    side={THREE.DoubleSide}
                    wireframe
                  />
                </mesh>
              </>
            )}
            
            {/* Axis helpers */}
            {showAxes && (
              <group>
                {/* X axis - Red (extends from -100 to +100) */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[200, 0.02, 0.02]} />
                  <meshBasicMaterial color="#ff0000" />
                </mesh>
                {/* Y axis - Green (extends from -100 to +100) */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.02, 200, 0.02]} />
                  <meshBasicMaterial color="#00ff00" />
                </mesh>
                {/* Z axis - Blue (extends from -100 to +100) */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.02, 0.02, 200]} />
                  <meshBasicMaterial color="#0000ff" />
                </mesh>
                {/* Origin indicator */}
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.05, 16, 8]} />
                  <meshBasicMaterial color="#ff6b35" />
                </mesh>
              </group>
            )}
            
            {/* Controls with dynamic configuration */}
            <OrbitControls
              ref={controlsRef}
              {...controlsConfig}
              enableDamping={true}
              dampingFactor={0.05}
              screenSpacePanning={false}
              minDistance={0.1}
              maxDistance={1000}
              target={[0, 0, 0]}
            />
            
            {/* Model Content */}
            {children}
          </Suspense>
        </Canvas>
      </div>
    );
  }
); 