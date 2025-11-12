// Service pour upload d'images vers Cloudinary

const CLOUDINARY_CLOUD_NAME = 'drcq4uwd0';
const CLOUDINARY_UPLOAD_PRESET = 'appyna_unsigned';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload une image vers Cloudinary
 * @param file - Le fichier image à uploader
 * @param folder - Le dossier Cloudinary où stocker l'image (optionnel)
 * @returns L'URL de l'image uploadée
 */
export async function uploadImage(file: File, folder?: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
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

export const uploadService = {
  uploadImage,
  uploadMultipleImages,
};
