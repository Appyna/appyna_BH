// Service pour upload d'images vers Cloudinary
import imageCompression from 'browser-image-compression';

const CLOUDINARY_CLOUD_NAME = 'drcq4uwd0';
const CLOUDINARY_UPLOAD_PRESET = 'appyna_unsigned';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Options de compression pour économiser l'espace
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // Taille max 1MB
  maxWidthOrHeight: 1920, // Résolution max 1920px
  useWebWorker: true, // Utiliser un Web Worker pour ne pas bloquer l'UI
  fileType: 'image/jpeg' as const, // Convertir en JPEG pour meilleure compression
};

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Compresse une image avant upload
 * @param file - Le fichier image à compresser
 * @returns Le fichier compressé
 */
async function compressImage(file: File): Promise<File> {
  try {
    const originalSize = (file.size / 1024 / 1024).toFixed(2);
    console.log(`📦 Compression de ${file.name} (${originalSize} MB)...`);
    
    const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
    
    const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
    const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(0);
    
    console.log(`✅ Compressé: ${compressedSize} MB (réduction de ${reduction}%)`);
    
    return compressedFile;
  } catch (error) {
    console.error('Erreur de compression, utilisation du fichier original:', error);
    return file; // En cas d'erreur, on utilise le fichier original
  }
}

/**
 * Upload une image vers Cloudinary (avec compression automatique)
 * @param file - Le fichier image à uploader
 * @param folder - Le dossier Cloudinary où stocker l'image (optionnel)
 * @returns L'URL de l'image uploadée
 */
export async function uploadImage(file: File, folder?: string): Promise<string> {
  // Compresser l'image avant upload
  const compressedFile = await compressImage(file);
  
  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Impossible d\'uploader l\'image. Veuillez réessayer.');
  }
}

/**
 * Upload plusieurs images vers Cloudinary
 * @param files - Les fichiers images à uploader
 * @param folder - Le dossier Cloudinary où stocker les images
 * @param onProgress - Callback appelé pour chaque image uploadée
 * @returns Un tableau d'URLs des images uploadées
 */
export async function uploadMultipleImages(
  files: File[],
  folder?: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    console.log(`Upload image ${i + 1}/${files.length}:`, files[i].name, 'Taille:', files[i].size);
    const url = await uploadImage(files[i], folder);
    console.log(`Image ${i + 1} uploadée:`, url);
    urls.push(url);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  console.log('Toutes les URLs uploadées:', urls);
  return urls;
}

/**
 * Extrait le public_id d'une URL Cloudinary
 * @param url - L'URL complète Cloudinary
 * @returns Le public_id (ex: "listings/abc123")
 */
export function extractPublicId(url: string): string | null {
  try {
    // Format: https://res.cloudinary.com/drcq4uwd0/image/upload/v1762973979/listings/oeysiaoeheoudtmeu5sg.png
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

/**
 * Supprime une image de Cloudinary (nécessite API secret - à faire côté serveur)
 * Pour l'instant, stocke juste le public_id pour suppression manuelle
 * @param imageUrl - L'URL de l'image à supprimer
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  const publicId = extractPublicId(imageUrl);
  
  if (!publicId) {
    console.error('Impossible d\'extraire le public_id de:', imageUrl);
    return false;
  }

  console.log('⚠️ Image à supprimer manuellement sur Cloudinary:', publicId);
  console.log('Dashboard Cloudinary: https://console.cloudinary.com/console/c-f5e9c5b5e5e5e5e5e5e5e5e5e5e5/media_library');
  
  // TODO: Appel API Cloudinary côté serveur avec api_secret
  // Pour l'instant, on log juste pour suppression manuelle
  
  return true;
}

/**
 * Supprime plusieurs images de Cloudinary
 * @param imageUrls - Les URLs des images à supprimer
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<void> {
  for (const url of imageUrls) {
    await deleteImage(url);
  }
}

export const uploadService = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  extractPublicId,
};
