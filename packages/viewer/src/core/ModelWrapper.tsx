import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { ModelLoader, type ModelLoaderRef } from './ModelLoader';
import { MeshTransform, type MeshTransformRef } from './MeshTransform';
import type { MeshAction } from '../controls/MeshControls';
import type { MaterialType } from '../controls/MaterialControls';
import type { ThreeCanvasRef } from './ThreeCanvas';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { STLLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';

export interface ModelWrapperProps {
  file?: File | null;
  cloudFileUrl?: string;
  selectedMeshAction: MeshAction;
  materialType: MaterialType;
  materialColor: string;
  metalness: number;
  roughness: number;
  cameraRef?: React.RefObject<ThreeCanvasRef | null>;
  onLoad?: (geometry: THREE.BufferGeometry | THREE.Group) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number, status: string) => void;
}

export interface ModelWrapperRef {
  resetTransform: () => void;
  resetToOriginalMaterials: () => void;
}

// Loading UI component
function ModelLoadingUI({ 
  progress = 0, 
  status = 'Loading model...',
  isVisible = true 
}: { 
  progress?: number; 
  status?: string;
  isVisible?: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center space-y-4 p-6">
        {/* Spinner */}
        <div className="relative mx-auto size-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-aqua-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Status Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-pool-deck-700">{status}</p>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="flex justify-between text-sm text-pool-deck-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-pool-deck-200 rounded-full h-2">
              <div 
                className="bg-aqua-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex items-center justify-center space-x-1">
          <div className="size-2 bg-aqua-blue-500 rounded-full animate-bounce"></div>
          <div className="size-2 bg-aqua-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="size-2 bg-aqua-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Enhanced cloud model loader with progress tracking
function CloudModelLoader({ 
  url, 
  onLoad, 
  onError,
  onProgress
}: { 
  url: string; 
  onLoad?: (geometry: THREE.BufferGeometry | THREE.Group) => void; 
  onError?: (error: Error) => void;
  onProgress?: (progress: number, status: string) => void;
}) {
  const [model, setModel] = useState<THREE.Group | THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const loadCloudModel = async () => {
      try {
        if (cancelled) return;
        
        setLoading(true);
        onProgress?.(0, 'Preparing to load model...');
        
        // Determine format from URL - parse pathname to avoid query parameters
        const urlPath = new URL(url).pathname;
        const extension = urlPath.split('.').pop()?.toLowerCase();
        
        if (cancelled) return;
        onProgress?.(10, 'Detecting file format...');
        
        let loader: any;
        let loadedModel: any;
        
        // Setup progress tracking with throttling to prevent UI freezing
        let lastProgressUpdate = 0;
        const onLoadProgress = (progressEvent: ProgressEvent) => {
          if (cancelled) return;
          
          const now = Date.now();
          if (now - lastProgressUpdate < 100) return; // Throttle to max 10 updates per second
          lastProgressUpdate = now;
          
          if (progressEvent.lengthComputable) {
            const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
            const totalProgress = Math.min(10 + (percentComplete * 0.8), 90); // 10-90% range
            onProgress?.(totalProgress, `Loading ${extension?.toUpperCase()} model...`);
          }
        };
        
        if (cancelled) return;
        
        switch (extension) {
          case 'glb':
          case 'gltf':
            onProgress?.(15, 'Loading GLTF/GLB model...');
            loader = new GLTFLoader();
            loadedModel = await new Promise((resolve, reject) => {
              if (cancelled) {
                reject(new Error('Loading cancelled'));
                return;
              }
              
              loader.load(url, 
                (gltf: any) => {
                  if (!cancelled) resolve(gltf.scene);
                },
                onLoadProgress,
                (error: any) => {
                  if (!cancelled) reject(error);
                }
              );
            });
            break;
            
          case 'obj':
            onProgress?.(15, 'Loading OBJ model...');
            loader = new OBJLoader();
            loadedModel = await new Promise((resolve, reject) => {
              if (cancelled) {
                reject(new Error('Loading cancelled'));
                return;
              }
              
              loader.load(url, 
                (obj: any) => {
                  if (!cancelled) resolve(obj);
                },
                onLoadProgress,
                (error: any) => {
                  if (!cancelled) reject(error);
                }
              );
            });
            break;
            
          case 'stl':
            onProgress?.(15, 'Loading STL model...');
            loader = new STLLoader();
            loadedModel = await new Promise((resolve, reject) => {
              if (cancelled) {
                reject(new Error('Loading cancelled'));
                return;
              }
              
              loader.load(url,
                (geometry: any) => {
                  if (!cancelled) resolve(geometry);
                },
                onLoadProgress,
                (error: any) => {
                  if (!cancelled) reject(error);
                }
              );
            });
            break;
            
          case 'fbx':
            onProgress?.(15, 'Loading FBX model...');
            loader = new FBXLoader();
            loadedModel = await new Promise((resolve, reject) => {
              if (cancelled) {
                reject(new Error('Loading cancelled'));
                return;
              }
              
              loader.load(url,
                (fbx: any) => {
                  if (!cancelled) resolve(fbx);
                },
                onLoadProgress,
                (error: any) => {
                  if (!cancelled) reject(error);
                }
              );
            });
            break;
            
          default:
            throw new Error(`Unsupported file format: ${extension}`);
        }
        
        if (cancelled) return;
        
        onProgress?.(95, 'Finalizing model...');
        
        setModel(loadedModel);
        onProgress?.(100, 'Model loaded successfully!');
        setLoading(false);
        
        if (onLoad) {
          onLoad(loadedModel);
        }
        
      } catch (error) {
        if (cancelled) return;
        
        setLoading(false);
        onProgress?.(0, 'Failed to load model');
        console.error('Cloud model loading error:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };
    
    // Use setTimeout to prevent blocking the main thread
    const timeoutId = setTimeout(() => {
      loadCloudModel();
    }, 10);
    
    // Cleanup function
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [url]); // Only depend on URL, not functions

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="transparent" opacity={0} />
      </mesh>
    );
  }

  if (!model) return null;

  return <primitive object={model} />;
}

export const ModelWrapper = forwardRef<ModelWrapperRef, ModelWrapperProps>(
  ({ file, cloudFileUrl, selectedMeshAction, materialType, materialColor, metalness, roughness, cameraRef, onLoad, onError, onProgress }, ref) => {
    const modelRef = useRef<THREE.Group>(null);
    const meshTransformRef = useRef<MeshTransformRef>(null);
    const modelLoaderRef = useRef<ModelLoaderRef>(null);
    const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

    useImperativeHandle(ref, () => ({
      resetTransform: () => {
        if (meshTransformRef.current) {
          meshTransformRef.current.resetTransform();
        }
      },
      resetToOriginalMaterials: () => {
        // Restore original materials
        if (modelRef.current) {
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && originalMaterials.current.has(child)) {
              const originalMaterial = originalMaterials.current.get(child);
              if (originalMaterial) {
                child.material = originalMaterial;
              }
            }
          });
        }
      },
    }));

    // Function to store original materials
    const storeOriginalMaterials = (object: THREE.Object3D) => {
      originalMaterials.current.clear();
      object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Store a copy of the original material
          if (Array.isArray(child.material)) {
            originalMaterials.current.set(child, child.material.map(mat => mat.clone()));
          } else {
            originalMaterials.current.set(child, child.material.clone());
          }
        }
      });
    };

    // Function to create material based on type and properties
    const createMaterial = () => {
      const color = new THREE.Color(materialColor);
      
      switch (materialType) {
        case 'basic':
          return new THREE.MeshBasicMaterial({ 
            color,
            side: THREE.DoubleSide 
          });
        case 'phong':
          return new THREE.MeshPhongMaterial({ 
            color,
            shininess: 100,
            side: THREE.DoubleSide 
          });
        case 'lambert':
          return new THREE.MeshLambertMaterial({ 
            color,
            side: THREE.DoubleSide 
          });
        case 'wireframe':
          return new THREE.MeshBasicMaterial({ 
            color,
            wireframe: true,
            side: THREE.DoubleSide 
          });
        case 'standard':
        default:
          return new THREE.MeshStandardMaterial({ 
            color,
            metalness,
            roughness,
            side: THREE.DoubleSide 
          });
      }
    };

    // Function to apply material to all meshes in a group
    const applyMaterialToObject = (object: THREE.Object3D) => {
      const material = createMaterial();
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
    };

    // Update materials when properties change
    useEffect(() => {
      if (modelRef.current) {
        applyMaterialToObject(modelRef.current);
      }
    }, [materialType, materialColor, metalness, roughness]);

    const handleModelLoad = (geometry: THREE.BufferGeometry | THREE.Group) => {
      console.log('Model loaded in wrapper:', geometry);
      
      // Clear the model ref first
      if (modelRef.current) {
        modelRef.current.clear();
      }

      // Add the loaded model to our wrapper group
      if (modelRef.current) {
        if (geometry instanceof THREE.Group) {
          // If it's already a group, add its children
          geometry.children.forEach(child => {
            const clonedChild = child.clone();
            modelRef.current!.add(clonedChild);
          });
        } else {
          // If it's a geometry, create a mesh and add it
          const mesh = new THREE.Mesh(geometry, createMaterial());
          modelRef.current.add(mesh);
        }

        // Store original materials before applying new ones
        storeOriginalMaterials(modelRef.current);

        // Apply current materials to the loaded model
        applyMaterialToObject(modelRef.current);

        // Attach the wrapper group to transform controls
        if (meshTransformRef.current) {
          meshTransformRef.current.attachToObject(modelRef.current);
        }

        // Fit camera to the loaded model
        if (cameraRef?.current) {
          // Use a small delay to ensure the model is fully rendered
          setTimeout(() => {
            if (modelRef.current && cameraRef.current) {
              cameraRef.current.fitCameraToObject(modelRef.current);
            }
          }, 100);
        }
      }

      // Call the original onLoad callback
      if (onLoad) {
        onLoad(geometry);
      }
    };

    return (
      <group>
        {/* Wrapper group that will contain the actual model */}
        <group ref={modelRef} />
        
        {/* Hidden model loader - we'll copy its output to our wrapper */}
        <group visible={false}>
          {file ? (
            <ModelLoader
              ref={modelLoaderRef}
              file={file}
              onLoad={handleModelLoad}
              onError={onError}
            />
          ) : cloudFileUrl ? (
            <CloudModelLoader
              url={cloudFileUrl}
              onLoad={handleModelLoad}
              onError={onError}
              onProgress={onProgress}
            />
          ) : null}
        </group>

        {/* Transform controls that operate on our wrapper group */}
        <MeshTransform
          ref={meshTransformRef}
          selectedAction={selectedMeshAction}
          enabled={selectedMeshAction !== 'none'}
        />
      </group>
    );
  }
); 