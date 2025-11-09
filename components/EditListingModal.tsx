import React, { useState } from 'react';
import { Category, CITIES_ISRAEL, ListingType, Listing } from '../types';

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
    imageUrl: listing.imageUrl || '',
  });

  // Gestion multi-photos
  const [images, setImages] = useState<string[]>(
    listing.imageUrl ? [listing.imageUrl] : []
  );

  const isDemand = formData.type === ListingType.DEMAND;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      // Mettre à jour formData avec la première image
      if (newImages.length > 0 && images.length === 0) {
        setFormData({ ...formData, imageUrl: newImages[0] });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // Mettre à jour formData avec la première image restante ou vide
    setFormData({ ...formData, imageUrl: newImages[0] || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedListing: Partial<Listing> = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? Number(formData.price) : undefined,
      category: formData.category,
      city: formData.city,
      type: formData.type,
      imageUrl: formData.imageUrl || null,
    };

    onSave(updatedListing);
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
          
          {/* Type d'annonce */}
          <div>
            <Label>Type d'annonce</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {Object.values(ListingType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold border-2 transition ${
                    formData.type === type 
                      ? 'bg-primary-50 border-primary-500 text-primary-600' 
                      : 'bg-white border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {type === ListingType.OFFER ? 'Je vends (Offre)' : 'Je cherche (Demande)'}
                </button>
              ))}
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
              />
              
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
            </div>
            <p className="text-xs text-gray-500 mt-1">Ajoutez des photos pour rendre votre annonce plus attractive.</p>
          </div>
        </form>

        {/* Footer avec boutons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 flex gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
