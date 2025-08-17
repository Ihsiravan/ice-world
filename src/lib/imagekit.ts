// ImageKit.io configuration and utilities
const IMAGEKIT_CONFIG = {
  publicKey: 'public_RJdT2rhZ+ZJjltBIbs5EN+4kJqI=',
  urlEndpoint: 'https://ik.imagekit.io/x6qhu235f',
  authenticationEndpoint: '/api/imagekit-auth'
};

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height?: number;
  width?: number;
  thumbnailUrl?: string;
}

export interface PhotoData {
  caption: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  tripId?: string;
}

export interface UploadedPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  tripId?: string;
  uploadedAt: Date;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
}

// Get authentication parameters from backend
export const getImageKitAuth = async (): Promise<{
  token: string;
  signature: string;
  expire: number;
}> => {
  try {
    const response = await fetch(IMAGEKIT_CONFIG.authenticationEndpoint);
    if (!response.ok) {
      throw new Error('Failed to get authentication parameters');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting ImageKit auth:', error);
    throw new Error('Authentication failed');
  }
};

// Upload photo to ImageKit
export const uploadPhotoToImageKit = async (
  file: File,
  photoData: PhotoData,
  userId: string
): Promise<UploadedPhoto> => {
  try {
    // Get authentication parameters
    const auth = await getImageKitAuth();
    console.log('ImageKit auth params:', auth);
    
    // Prepare form data
    const formData = new FormData();
    
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file');
    }
    
    console.log('File info:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    formData.append('file', file);
    formData.append('fileName', `${userId}_${Date.now()}_${file.name}`);
    formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
    formData.append('signature', auth.signature);
    formData.append('expire', auth.expire.toString());
    console.log('Sending expire as:', auth.expire, typeof auth.expire);
    formData.append('token', auth.token);
    formData.append('useUniqueFileName', 'true');
    
    // Add tags
    if (photoData.tags.length > 0) {
      formData.append('tags', photoData.tags.join(','));
    }
    
    // Add folder structure (simplified)
    formData.append('folder', '/travel-photos');
    
    // Add custom metadata
    const customMetadata = {
      userId,
      caption: photoData.caption,
      location: photoData.location,
      latitude: photoData.latitude,
      longitude: photoData.longitude,
      tripId: photoData.tripId,
      uploadedAt: new Date().toISOString()
    };
    formData.append('customMetadata', JSON.stringify(customMetadata));
    
    // Debug: Log form data contents
    console.log('Form data contents:');
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (key === 'file' && value instanceof File) {
        console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}:`, value);
      }
    });
    
    // Upload to ImageKit
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('ImageKit upload error:', errorData);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(errorData.message || 'Upload failed');
    }
    
    const result: ImageKitUploadResponse = await response.json();
    
    // Return formatted result
    return {
      id: result.fileId,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      caption: photoData.caption,
      location: photoData.location,
      latitude: photoData.latitude,
      longitude: photoData.longitude,
      tags: photoData.tags,
      tripId: photoData.tripId,
      uploadedAt: new Date(),
      fileName: result.name,
      fileSize: result.size,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload photo');
  }
};

// Compress image before upload
export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Get ImageKit URL with transformations
export const getImageKitUrl = (url: string, transformations?: string): string => {
  if (!transformations) return url;
  return `${url}?tr=${transformations}`;
};

// Get thumbnail URL
export const getThumbnailUrl = (url: string, width = 300, height = 300): string => {
  return getImageKitUrl(url, `w-${width},h-${height},c-at_max`);
}; 