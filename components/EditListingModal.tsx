import React, { useState } from 'react';
import { Category, CITIES_ISRAEL, ListingType, Listing } from '../types';
import { uploadService } from '../lib/uploadService';

interface EditListingModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (updatedListing: Partial<Listing>) => void;
}
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => 
  <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition" />;

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => 
  <textarea {...props} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition" />;

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => 
  <select {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition bg-white" />;

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }> = ({ required, children, ...props }) => (
  <label {...props} className="block text-sm font-semibold text-gray-700 mb-2">
    {children}{required && <span className="text-red-500 text-xs ml-1">*</span>}
  </label>
);

export const EditListingModal: React.FC<EditListingModalProps> = ({ listing, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price?.toString() || '',
    category: listing.category,
    city: listing.city,
    type: listing.type,
  });

  // Gestion multi-photos - CHARGER LES IMAGES EXISTANTES
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const isDemand = formData.type === ListingType.DEMAND;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const MAX_IMAGES = 6;
      const remainingSlots = MAX_IMAGES - images.length;
      
      if (remainingSlots <= 0) {
        alert(`Vous pouvez avoir maximum ${MAX_IMAGES} images par annonce.`);
        e.target.value = '';
        return;
      }
      
      const filesArray = Array.from(files).slice(0, remainingSlots);
      
      if (files.length > remainingSlots) {
        alert(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s). Limite de ${MAX_IMAGES} images atteinte.`);
      }
      
      // Créer blob URLs pour preview
      const newImages = filesArray.map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      setImageFiles([...imageFiles, ...filesArray]);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    setUploadProgress('');

    try {
      // Séparer les images existantes (URLs Cloudinary) des nouvelles (blob URLs)
      const existingImages = images.filter(img => img.startsWith('https://res.cloudinary.com'));
      let newCloudinaryUrls: string[] = [];

      // Upload des nouvelles images vers Cloudinary si il y en a
      if (imageFiles.length > 0) {
        setUploadProgress(`Upload des nouvelles images... 0/${imageFiles.length}`);
        newCloudinaryUrls = await uploadService.uploadMultipleImages(
          imageFiles,
          'listings',
          (current, total) => {
            setUploadProgress(`Upload des nouvelles images... ${current}/${total}`);
          }
        );

      }

      // Combiner images existantes + nouvelles images
      const allImages = [...existingImages, ...newCloudinaryUrls];

      const updatedListing: Partial<Listing> = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number(formData.price) : undefined,
        category: formData.category,
        city: formData.city,
        type: formData.type,
        images: allImages,
      };

      onSave(updatedListing);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload des images. Veuillez réessayer.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins">
            Modifier mon annonce
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          
          {/* Type d'annonce (non modifiable) */}
          <div>
            <Label>Type d'annonce</Label>
            <div className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-600">
              {formData.type === ListingType.OFFER ? '🏷️ Je vends (Offre)' : '🔍 Je cherche (Demande)'}
              <span className="text-xs font-normal text-gray-500 ml-2">(non modifiable)</span>
            </div>
          </div>

          {/* Titre */}
          <div>
            <Label htmlFor="edit-title" required>Titre de l'annonce</Label>
            <Input 
              id="edit-title" 
              type="text" 
              placeholder="Ex: Canapé d'angle design" 
              maxLength={120} 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required 
            />
          </div>

          {/* Catégorie */}
          <div>
            <Label htmlFor="edit-category" required>Catégorie</Label>
            <Select 
              id="edit-category" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              required
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="edit-description" required>Description</Label>
            <Textarea 
              id="edit-description" 
              placeholder="Décrivez votre article ou service en détail..." 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prix */}
            <div>
              <Label htmlFor="edit-price" required={!isDemand}>Prix</Label>
              <div className="relative">
                <Input 
                  id="edit-price" 
                  type="number" 
                  placeholder={isDemand ? "Optionnel" : "0"}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pr-8"
                  required={!isDemand}
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₪</span>
              </div>
              {isDemand && <p className="text-xs text-gray-500 mt-1">Le prix est facultatif pour les demandes.</p>}
            </div>
            
            {/* Ville */}
            <div>
              <Label htmlFor="edit-city" required>Ville</Label>
              <Select 
                id="edit-city" 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              >
                {CITIES_ISRAEL.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Image (optionnel) */}
          <div>
            <Label htmlFor="edit-image">Photos (optionnel)</Label>
            <div className="space-y-3">
              {/* Grille de miniatures des photos existantes */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={img} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Supprimer la photo"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Boutons d'action */}
              <input 
                id="edit-image"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={images.length >= 6}
              />
              
              {images.length < 6 ? (
                <div className="flex gap-2">
                  <label 
                    htmlFor="edit-image"
                    className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors bg-gray-50 hover:bg-primary-50"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      {images.length === 0 ? 'Ajouter une photo' : 'Ajouter une photo'}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-600 font-medium">Limite de 6 images atteinte</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {images.length < 6 
                ? `${images.length}/6 images - Ajoutez des photos pour rendre votre annonce plus attractive.`
                : 'Maximum de 6 images atteint. Supprimez une image pour en ajouter une autre.'
              }
            </p>
          </div>
        </form>

        {/* Footer avec boutons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 flex flex-col gap-3 rounded-b-3xl">
          {uploadProgress && (
            <div className="text-center text-sm text-primary-600 font-medium">
              {uploadProgress}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {uploading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
