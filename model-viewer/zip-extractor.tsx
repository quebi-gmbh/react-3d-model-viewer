import JSZip from 'jszip';

export interface ExtractedFile {
  name: string;
  path: string;
  blob: Blob;
  url: string;
}

export interface GLTFPackage {
  mainGltfFile: ExtractedFile | null;
  binFiles: ExtractedFile[];
  textureFiles: ExtractedFile[];
  otherFiles: ExtractedFile[];
  urlResolver: Map<string, string>;
}

export class ZipExtractor {
  private static readonly GLTF_EXTENSIONS = ['.gltf'];
  private static readonly BIN_EXTENSIONS = ['.bin'];
  private static readonly TEXTURE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.ktx2', '.dds', '.hdr'];

  static async extractGLTFPackage(zipFile: File): Promise<GLTFPackage> {
    console.log('Starting ZIP extraction for GLTF package:', zipFile.name);
    
    const zip = new JSZip();
    const contents = await zip.loadAsync(zipFile);
    
    const extractedFiles: ExtractedFile[] = [];
    const urlResolver = new Map<string, string>();
    
    // Extract all files from the ZIP
    for (const [relativePath, file] of Object.entries(contents.files)) {
      if (!file.dir) {
        try {
          const blob = await file.async('blob');
          const url = URL.createObjectURL(blob);
          
          const extractedFile: ExtractedFile = {
            name: file.name.split('/').pop() || '',
            path: relativePath,
            blob,
            url
          };
          
          extractedFiles.push(extractedFile);
          
          // Map both full path and filename for URL resolution
          urlResolver.set(relativePath, url);
          urlResolver.set(extractedFile.name, url);
          
          // Also handle normalized paths (replace backslashes)
          const normalizedPath = relativePath.replace(/\\/g, '/');
          if (normalizedPath !== relativePath) {
            urlResolver.set(normalizedPath, url);
          }
          
          console.log(`Extracted: ${relativePath} -> ${url}`);
          console.log(`  Mapped paths: ["${relativePath}", "${extractedFile.name}", "${normalizedPath}"]`);
        } catch (error) {
          console.warn(`Failed to extract file ${relativePath}:`, error);
        }
      }
    }
    
    // Categorize extracted files
    const gltfPackage: GLTFPackage = {
      mainGltfFile: null,
      binFiles: [],
      textureFiles: [],
      otherFiles: [],
      urlResolver
    };
    
    for (const file of extractedFiles) {
      const ext = this.getFileExtension(file.name);
      
      if (this.GLTF_EXTENSIONS.includes(ext)) {
        if (!gltfPackage.mainGltfFile) {
          gltfPackage.mainGltfFile = file;
          console.log('Found main GLTF file:', file.path);
        } else {
          console.warn('Multiple GLTF files found, using first:', gltfPackage.mainGltfFile.path);
        }
      } else if (this.BIN_EXTENSIONS.includes(ext)) {
        gltfPackage.binFiles.push(file);
      } else if (this.TEXTURE_EXTENSIONS.includes(ext)) {
        gltfPackage.textureFiles.push(file);
      } else {
        gltfPackage.otherFiles.push(file);
      }
    }
    
    console.log('GLTF Package extraction summary:', {
      mainFile: gltfPackage.mainGltfFile?.path,
      binFiles: gltfPackage.binFiles.length,
      textureFiles: gltfPackage.textureFiles.length,
      otherFiles: gltfPackage.otherFiles.length,
      totalMappings: urlResolver.size
    });
    
    return gltfPackage;
  }
  
  static createURLResolver(gltfPackage: GLTFPackage) {
    return (url: string): string => {
      console.log(`URL Resolver called with: "${url}"`);
      console.log(`URL type: ${typeof url}, length: ${url.length}`);
      
      // Handle malformed blob URLs created by Three.js relative resolution
      // Example: "blob:http://localhost:5173/AnisotropyBarnLamp_basecolor.png"
      if (url.startsWith('blob:') && url.includes('/') && !url.match(/blob:.*\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
        const filename = url.split('/').pop() || '';
        console.log(`🔧 Malformed blob URL detected: ${url}, extracting filename: ${filename}`);
        
        if (filename && gltfPackage.urlResolver.has(filename)) {
          const resolvedUrl = gltfPackage.urlResolver.get(filename)!;
          console.log(`✅ Fixed malformed blob URL: ${url} -> ${resolvedUrl}`);
          return resolvedUrl;
        }
      }
      
      // If it's already a proper blob URL or data URL, return as-is
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        console.log(`URL is already blob/data, returning as-is: ${url}`);
        return url;
      }
      
      // Try exact path match first
      if (gltfPackage.urlResolver.has(url)) {
        const resolvedUrl = gltfPackage.urlResolver.get(url)!;
        console.log(`✅ URL resolved (exact): ${url} -> ${resolvedUrl}`);
        return resolvedUrl;
      }
      
      // Try filename-only match
      const filename = url.split('/').pop() || url;
      console.log(`Trying filename match: "${filename}"`);
      if (gltfPackage.urlResolver.has(filename)) {
        const resolvedUrl = gltfPackage.urlResolver.get(filename)!;
        console.log(`✅ URL resolved (filename): ${url} -> ${resolvedUrl}`);
        return resolvedUrl;
      }
      
      // Try with different path separators
      const normalizedUrl = url.replace(/\\/g, '/');
      if (normalizedUrl !== url && gltfPackage.urlResolver.has(normalizedUrl)) {
        const resolvedUrl = gltfPackage.urlResolver.get(normalizedUrl)!;
        console.log(`✅ URL resolved (normalized): ${url} -> ${resolvedUrl}`);
        return resolvedUrl;
      }
      
      console.error(`❌ Failed to resolve URL: "${url}"`);
      console.log('Available mappings:', Array.from(gltfPackage.urlResolver.keys()));
      
      // Return a transparent fallback for missing textures
      if (this.TEXTURE_EXTENSIONS.some(ext => url.toLowerCase().includes(ext))) {
        console.log('Returning transparent fallback for missing texture');
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      }
      
      // For binary files, we must have a valid URL or the loading will fail
      if (url.endsWith('.bin')) {
        console.error(`Binary file cannot be resolved: ${url}`);
        throw new Error(`Required binary file not found in ZIP package: ${url}`);
      }
      
      // Return original URL for other files (will likely fail but Three.js can handle it)
      console.log(`Returning original URL: ${url}`);
      return url;
    };
  }
  
  static cleanup(gltfPackage: GLTFPackage) {
    console.log('Cleaning up extracted GLTF package URLs');
    
    const allFiles = [
      ...(gltfPackage.mainGltfFile ? [gltfPackage.mainGltfFile] : []),
      ...gltfPackage.binFiles,
      ...gltfPackage.textureFiles,
      ...gltfPackage.otherFiles
    ];
    
    for (const file of allFiles) {
      try {
        URL.revokeObjectURL(file.url);
      } catch (error) {
        console.warn(`Failed to revoke URL ${file.url}:`, error);
      }
    }
    
    gltfPackage.urlResolver.clear();
  }
  
  private static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase();
  }
  
  static validateGLTFPackage(gltfPackage: GLTFPackage): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!gltfPackage.mainGltfFile) {
      errors.push('No GLTF file found in ZIP archive');
    }
    
    if (gltfPackage.binFiles.length === 0 && gltfPackage.textureFiles.length === 0) {
      errors.push('ZIP contains only GLTF file - consider using GLB format instead');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
} 