import { useEffect, useState, useRef, Suspense, forwardRef, useImperativeHandle } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';

import { ColladaLoader } from 'three-stdlib';
import { TDSLoader } from 'three-stdlib';
import * as THREE from 'three';
import { ZipExtractor, type GLTFPackage } from './zip-extractor';

export interface ModelLoaderRef {
  getModelRef: () => { current: THREE.Group | THREE.Mesh | null };
}

interface ModelLoaderProps {
  file: File;
  onLoad?: (geometry: THREE.BufferGeometry | THREE.Group) => void;
  onError?: (error: Error) => void;
}

function STLModel({ file, onLoad, onError }: ModelLoaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [url, setUrl] = useState<string>('');
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadSTL = async () => {
      try {
        setLoading(true);
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        
        // Create object URL
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        
        // Load STL with custom loader to catch errors
        const loader = new STLLoader();
        
        const loadedGeometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
          loader.load(
            objectUrl,
            (geometry) => {
              console.log('STL loaded successfully:', geometry);
              resolve(geometry);
            },
            (progress) => {
              console.log('Loading progress:', progress);
            },
            (error) => {
              console.error('STL loading error:', error);
              reject(new Error(`Failed to load STL file: ${error.message || 'Unknown error'}`));
            }
          );
        });
        
        setGeometry(loadedGeometry);
        setLoading(false);
        
        // Cleanup URL
        URL.revokeObjectURL(objectUrl);
        
      } catch (error) {
        setLoading(false);
        console.error('STL loading error:', error);
        if (onError) {
          onError(error as Error);
        }
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
    
    loadSTL();
  }, [file, onError]);
  
  useEffect(() => {
    if (geometry && onLoad) {
      console.log('STL geometry loaded:', geometry);
      onLoad(geometry);
    }
  }, [geometry, onLoad]);

  // Removed auto-rotation per user request

  useEffect(() => {
    if (geometry) {
      try {
        // Calculate bounding box and center the model
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) {
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          console.log('Model center:', center);
          console.log('Model size:', size);
          
          // Scale to fit in a reasonable size (target size of 5 units)
          const maxDimension = Math.max(size.x, size.y, size.z);
          const targetSize = 5;
          const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
          
          if (meshRef.current) {
            meshRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
            meshRef.current.scale.set(scale, scale, scale);
          }
        }
      } catch (error) {
        console.error('Error processing geometry:', error);
      }
    }
  }, [geometry]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#94a3b8" wireframe />
      </mesh>
    );
  }

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color="#64748b" 
        metalness={0.1} 
        roughness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function OBJModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [url, setUrl] = useState<string>('');
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadOBJ = async () => {
      try {
        setLoading(true);
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        
        // Create object URL
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        
        // Load OBJ with custom loader to catch errors
        const loader = new OBJLoader();
        
        const loadedObj = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            objectUrl,
            (object) => {
              console.log('OBJ loaded successfully:', object);
              resolve(object);
            },
            (progress) => {
              console.log('Loading progress:', progress);
            },
            (error) => {
              console.error('OBJ loading error:', error);
              reject(new Error(`Failed to load OBJ file: ${error.message || 'Unknown error'}`));
            }
          );
        });
        
        setObj(loadedObj);
        setLoading(false);
        
        // Cleanup URL
        URL.revokeObjectURL(objectUrl);
        
      } catch (error) {
        setLoading(false);
        console.error('OBJ loading error:', error);
        if (onError) {
          onError(error as Error);
        }
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
    
    loadOBJ();
  }, [file, onError]);
  
  useEffect(() => {
    if (obj && onLoad) {
      console.log('OBJ model loaded:', obj);
      onLoad(obj);
    }
  }, [obj, onLoad]);

  // Removed auto-rotation per user request

  useEffect(() => {
    if (obj) {
      try {
        // Calculate bounding box and center the model
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        console.log('Model center:', center);
        console.log('Model size:', size);
        
        // Scale to fit in a reasonable size (target size of 5 units)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
        
        // Apply default material to all meshes
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#64748b',
              metalness: 0.1,
              roughness: 0.6,
              side: THREE.DoubleSide
            });
          }
        });
      } catch (error) {
        console.error('Error processing OBJ:', error);
      }
    }
  }, [obj]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#94a3b8" wireframe />
      </mesh>
    );
  }

  if (!obj) return null;

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}

function GLTFModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [url, setUrl] = useState<string>('');
  const [gltf, setGltf] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadGLTF = async () => {
      try {
        setLoading(true);
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        
        // Create object URL
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        
        // Load GLTF with custom loader to catch errors
        // Configure loading manager to handle missing external resources gracefully
        const manager = new THREE.LoadingManager();
        
        // Handle missing external resources (textures, buffers)
        manager.setURLModifier((url) => {
          // If it's trying to load an external resource, create a fallback
          if (url !== objectUrl && !url.startsWith('blob:') && !url.startsWith('data:')) {
            console.warn(`GLTF external resource not available: ${url}`);
            console.warn('Consider using GLB format for single-file uploads with embedded resources');
            
            // Return a data URL for missing textures (1x1 transparent pixel)
            if (url.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
              return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            }
          }
          return url;
        });
        
        const loader = new GLTFLoader(manager);
        
        const loadedGltf = await new Promise<any>((resolve, reject) => {
          loader.load(
            objectUrl,
            (gltf) => {
              console.log('GLTF loaded successfully:', gltf);
              
              // Check if we had missing external resources
              const hasExternalResources = gltf.parser?.json?.buffers?.some((buffer: any) => 
                buffer.uri && !buffer.uri.startsWith('data:')
              ) || gltf.parser?.json?.images?.some((image: any) => 
                image.uri && !image.uri.startsWith('data:')
              );
              
              if (hasExternalResources) {
                console.warn('This GLTF file references external resources that are not available.');
                console.warn('For best results, use GLB format or upload all associated files together.');
              }
              
              resolve(gltf);
            },
            (progress) => {
              console.log('Loading progress:', progress);
            },
            (error) => {
              console.error('GLTF loading error:', error);
              
              // Provide more helpful error messages
              if (error.message.includes('Failed to load buffer')) {
                reject(new Error(`GLTF file references external binary files (.bin) that are not available. Use GLB format for single-file uploads.`));
              } else if (error.message.includes('load texture')) {
                reject(new Error(`GLTF file references external texture files that are not available. Use GLB format for single-file uploads.`));
              } else {
                reject(new Error(`Failed to load GLTF file: ${error.message || 'Unknown error'}`));
              }
            }
          );
        });
        
        setGltf(loadedGltf);
        setLoading(false);
        
        // Cleanup URL
        URL.revokeObjectURL(objectUrl);
        
      } catch (error) {
        setLoading(false);
        console.error('GLTF loading error:', error);
        if (onError) {
          onError(error as Error);
        }
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
    
    loadGLTF();
  }, [file, onError]);
  
  useEffect(() => {
    if (gltf && onLoad) {
      console.log('GLTF model loaded:', gltf);
      onLoad(gltf.scene);
    }
  }, [gltf, onLoad]);

  // Removed auto-rotation per user request

  useEffect(() => {
    if (gltf && gltf.scene) {
      try {
        // Calculate bounding box and center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        console.log('GLTF Model center:', center);
        console.log('GLTF Model size:', size);
        
        // Scale to fit in a reasonable size (target size of 5 units)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
      } catch (error) {
        console.error('Error processing GLTF:', error);
      }
    }
  }, [gltf]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#94a3b8" wireframe />
      </mesh>
    );
  }

  if (!gltf) return null;

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function ZipGLTFModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string>('Extracting ZIP...');
  const gltfPackageRef = useRef<GLTFPackage | null>(null);
  
  useEffect(() => {
    const loadZipGLTF = async () => {
      try {
        setLoading(true);
        setExtractionStatus('Extracting ZIP archive...');
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        
        console.log('Starting ZIP GLTF extraction:', file.name);
        
        // Extract GLTF package from ZIP
        const gltfPackage = await ZipExtractor.extractGLTFPackage(file);
        gltfPackageRef.current = gltfPackage;
        
        // Validate package
        const validation = ZipExtractor.validateGLTFPackage(gltfPackage);
        if (!validation.valid) {
          throw new Error(`Invalid GLTF package: ${validation.errors.join(', ')}`);
        }
        
        if (!gltfPackage.mainGltfFile) {
          throw new Error('No GLTF file found in ZIP archive');
        }
        
        setExtractionStatus('Loading GLTF from extracted files...');
        
        // Create URL resolver for Three.js loader
        const urlResolver = ZipExtractor.createURLResolver(gltfPackage);
        
        // Configure loading manager with custom URL resolver
        const manager = new THREE.LoadingManager();
        
        // Test that URLModifier is working
        console.log('Setting up LoadingManager with URLModifier');
        const testResolver = (url: string) => {
          console.log(`🔄 LoadingManager URLModifier called with: "${url}"`);
          return urlResolver(url);
        };
        
        manager.setURLModifier(testResolver);
        
        const loader = new GLTFLoader(manager);
        
        console.log('Loading main GLTF file:', gltfPackage.mainGltfFile.path);
        
        const loadedGltf = await new Promise<any>((resolve, reject) => {
          loader.load(
            gltfPackage.mainGltfFile!.url,
            (gltf) => {
              console.log('ZIP GLTF loaded successfully:', gltf);
              console.log('Package contents:', {
                binFiles: gltfPackage.binFiles.length,
                textureFiles: gltfPackage.textureFiles.length,
                otherFiles: gltfPackage.otherFiles.length
              });
              resolve(gltf);
            },
            (progress) => {
              console.log('ZIP GLTF loading progress:', progress);
              setExtractionStatus('Loading GLTF resources...');
            },
            (error) => {
              console.error('ZIP GLTF loading error:', error);
              reject(new Error(`Failed to load GLTF from ZIP: ${error.message || 'Unknown error'}`));
            }
          );
        });
        
        setGltf(loadedGltf);
        setLoading(false);
        setExtractionStatus('');
        
      } catch (error) {
        setLoading(false);
        setExtractionStatus('');
        console.error('ZIP GLTF loading error:', error);
        if (onError) {
          onError(error as Error);
        }
        // Clean up resources on error
        if (gltfPackageRef.current) {
          ZipExtractor.cleanup(gltfPackageRef.current);
        }
      }
    };
    
    loadZipGLTF();
  }, [file, onError]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gltfPackageRef.current) {
        ZipExtractor.cleanup(gltfPackageRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (gltf && onLoad) {
      console.log('ZIP GLTF model loaded:', gltf);
      onLoad(gltf.scene);
    }
  }, [gltf, onLoad]);

  useEffect(() => {
    if (gltf && gltf.scene) {
      try {
        // Calculate bounding box and center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        console.log('ZIP GLTF Model center:', center);
        console.log('ZIP GLTF Model size:', size);
        
        // Scale to fit in a reasonable size (target size of 5 units)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
      } catch (error) {
        console.error('Error processing ZIP GLTF:', error);
      }
    }
  }, [gltf]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#3b82f6" wireframe />
      </mesh>
    );
  }

  if (!gltf) return null;

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function FBXModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [url, setUrl] = useState<string>('');
  const [fbx, setFbx] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadFBX = async () => {
      try {
        setLoading(true);
        
        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        
        // Create object URL
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        
        // Load FBX with custom loader to catch errors
        const loader = new FBXLoader();
        
        const loadedFbx = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            objectUrl,
            (object) => {
              console.log('FBX loaded successfully:', object);
              resolve(object);
            },
            (progress) => {
              console.log('FBX loading progress:', progress);
            },
            (error) => {
              console.error('FBX loading error:', error);
              reject(new Error(`Failed to load FBX file: ${error.message || 'Unknown error'}`));
            }
          );
        });
        
        setFbx(loadedFbx);
        setLoading(false);
        
        // Cleanup URL
        URL.revokeObjectURL(objectUrl);
        
      } catch (error) {
        setLoading(false);
        console.error('FBX loading error:', error);
        if (onError) {
          onError(error as Error);
        }
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
    
    loadFBX();
  }, [file, onError]);
  
  useEffect(() => {
    if (fbx && onLoad) {
      console.log('FBX model loaded:', fbx);
      onLoad(fbx);
    }
  }, [fbx, onLoad]);

  useEffect(() => {
    if (fbx) {
      try {
        // Calculate bounding box and center the model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        console.log('FBX Model center:', center);
        console.log('FBX Model size:', size);
        
        // Scale to fit in a reasonable size (target size of 5 units)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
        
        // FBX models often come with their own materials, but let's ensure good visibility
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Only apply default material if the mesh doesn't have one
            if (!child.material || (Array.isArray(child.material) && child.material.length === 0)) {
              child.material = new THREE.MeshStandardMaterial({
                color: '#64748b',
                metalness: 0.1,
                roughness: 0.6,
                side: THREE.DoubleSide
              });
            } else {
              // Ensure existing materials are visible
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
                    mat.side = THREE.DoubleSide;
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshBasicMaterial) {
                child.material.side = THREE.DoubleSide;
              }
            }
          }
        });
      } catch (error) {
        console.error('Error processing FBX:', error);
      }
    }
  }, [fbx]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#8b5cf6" wireframe />
      </mesh>
    );
  }

  if (!fbx) return null;

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}



function DAEModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [url, setUrl] = useState<string>('');
  const [dae, setDae] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDAE = async () => {
      try {
        setLoading(true);
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        const loader = new ColladaLoader();
        const loadedDae = await new Promise<any>((resolve, reject) => {
          loader.load(
            objectUrl,
            (collada) => {
              console.log('DAE loaded successfully:', collada);
              resolve(collada);
            },
            (progress) => {
              console.log('DAE loading progress:', progress);
            },
            (error) => {
              console.error('DAE loading error:', error);
              reject(new Error(`Failed to load DAE file: ${error.message || 'Unknown error'}`));
            }
          );
        });
        setDae(loadedDae);
        setLoading(false);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        setLoading(false);
        console.error('DAE loading error:', error);
        if (onError) onError(error as Error);
        if (url) URL.revokeObjectURL(url);
      }
    };
    loadDAE();
  }, [file, onError]);

  useEffect(() => {
    if (dae && onLoad) {
      onLoad(dae.scene || dae);
    }
  }, [dae, onLoad]);

  useEffect(() => {
    if (dae && dae.scene) {
      try {
        const box = new THREE.Box3().setFromObject(dae.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
      } catch (error) {
        console.error('Error processing DAE:', error);
      }
    }
  }, [dae]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>
    );
  }
  if (!dae) return null;
  return (
    <group ref={groupRef}>
      <primitive object={dae.scene || dae} />
    </group>
  );
}

function TDSModel({ file, onLoad, onError }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [url, setUrl] = useState<string>('');
  const [tds, setTds] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTDS = async () => {
      try {
        setLoading(true);
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        const loader = new TDSLoader();
        const loadedTds = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            objectUrl,
            (object) => {
              console.log('3DS loaded successfully:', object);
              resolve(object);
            },
            (progress) => {
              console.log('3DS loading progress:', progress);
            },
            (error) => {
              console.error('3DS loading error:', error);
              reject(new Error(`Failed to load 3DS file: ${error.message || 'Unknown error'}`));
            }
          );
        });
        setTds(loadedTds);
        setLoading(false);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        setLoading(false);
        console.error('3DS loading error:', error);
        if (onError) onError(error as Error);
        if (url) URL.revokeObjectURL(url);
      }
    };
    loadTDS();
  }, [file, onError]);

  useEffect(() => {
    if (tds && onLoad) {
      onLoad(tds);
    }
  }, [tds, onLoad]);

  useEffect(() => {
    if (tds) {
      try {
        const box = new THREE.Box3().setFromObject(tds);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
        if (groupRef.current) {
          groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          groupRef.current.scale.set(scale, scale, scale);
        }
      } catch (error) {
        console.error('Error processing 3DS:', error);
      }
    }
  }, [tds]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#f472b6" wireframe />
      </mesh>
    );
  }
  if (!tds) return null;
  return (
    <group ref={groupRef}>
      <primitive object={tds} />
    </group>
  );
}

function UnsupportedModel({ file }: { file: File }) {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#ef4444" 
        transparent 
        opacity={0.7}
      />
    </mesh>
  );
}

function ErrorBoundary({ children, onError }: { children: React.ReactNode; onError?: (error: Error) => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.message);
      if (onError) {
        onError(new Error(event.message));
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    );
  }

  return <>{children}</>;
}

export const ModelLoader = forwardRef<ModelLoaderRef, ModelLoaderProps>(
  ({ file, onLoad, onError }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const currentModelRef = useRef<THREE.Group | THREE.Mesh | null>(null);
    
    useImperativeHandle(ref, () => ({
      getModelRef: () => {
        // Return a ref-like object for the current model
        return { current: currentModelRef.current };
      },
    }));

    const handleError = (err: Error) => {
      console.error('Model loading error:', err);
      setError(err.message);
      if (onError) {
        onError(err);
      }
    };

    const handleLoad = (geometry: THREE.BufferGeometry | THREE.Group) => {
      // Store reference to the loaded model
      currentModelRef.current = geometry as THREE.Group | THREE.Mesh;
      if (onLoad) {
        onLoad(geometry);
      }
    };

  // Detect file format
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const extension = getFileExtension(file.name);
  console.log('Loading file:', file.name, 'Extension:', extension, 'Size:', (file.size / (1024 * 1024)).toFixed(2) + 'MB');

  // Validate file before attempting to load
  useEffect(() => {
    // Check file size
    if (file.size === 0) {
      setError('File is empty');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setError(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 100MB.`);
      return;
    }

    // Reset error on new file
    setError(null);
  }, [file]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    );
  }

      const renderModel = () => {
      switch (extension) {
        case 'stl':
          return <STLModel file={file} onLoad={handleLoad} onError={handleError} />;
        case 'obj':
          return <OBJModel file={file} onLoad={handleLoad} onError={handleError} />;
        case 'gltf':
        case 'glb':
          return <GLTFModel file={file} onLoad={handleLoad} onError={handleError} />;
        case 'fbx':
          return <FBXModel file={file} onLoad={handleLoad} onError={handleError} />;

        case 'zip':
          return <ZipGLTFModel file={file} onLoad={handleLoad} onError={handleError} />;
        case 'vtk':
          // VTK format now handled by dedicated VTK Viewer (scientific data visualization)
          return <UnsupportedModel file={file} />;
        case 'stp':
        case 'step':
          // STEP/STP format not supported (requires OpenCASCADE.js)
          return <UnsupportedModel file={file} />;
        case 'msh':
          // GMSH format not supported (requires custom parsing)
          return <UnsupportedModel file={file} />;
        case 'dae':
          return <DAEModel file={file} onLoad={handleLoad} onError={handleError} />;
        case '3ds':
          return <TDSModel file={file} onLoad={handleLoad} onError={handleError} />;
        default:
          return <UnsupportedModel file={file} />;
      }
    };

    return (
      <ErrorBoundary onError={handleError}>
        {renderModel()}
      </ErrorBoundary>
    );
  }
); 