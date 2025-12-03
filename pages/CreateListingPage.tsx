import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, CITIES_ISRAEL, ListingType } from '../types';
import { BackButton } from '../components/BackButton';
import { ProtectedAction } from '../components/ProtectedAction';
import { useAuth } from '../contexts/AuthContext';
import { listingsService } from '../lib/listingsService';
import { uploadService } from '../lib/uploadService';

// Icons
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

// Form input components for consistency
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition" />;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea {...props} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition" />;
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition bg-white" />;
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }> = ({ required, children, ...props }) => (
    <label {...props} className="block text-sm font-semibold text-gray-700 mb-2">
        {children}{required && <span className="text-red-500 text-xs">*</span>}
    </label>
);

const BoostCard: React.FC<{
    duration: string;
    price: string;
    popular?: boolean;
    selected: boolean;
    onClick: () => void;
}> = ({ duration, price, popular = false, selected, onClick }) => (
    <div onClick={onClick} className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${selected ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-gray-300 hover:border-primary-400'}`}>
        {popular && <span className="text-xs font-bold bg-secondary text-white px-2 py-0.5 rounded-full absolute -top-2.5 right-2">Populaire</span>}
         <div className="flex items-start mb-2">
            <input type="radio" name="boost" checked={selected} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mt-1 flex-shrink-0" />
            <span className="ml-3 text-sm font-bold text-gray-800 leading-tight">{duration}</span>
        </div>
        <p className="text-center text-2xl font-extrabold text-gray-900 mt-2">{price} <span className="text-base font-medium text-gray-500">₪</span></p>
    </div>
);


export const CreateListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listingType, setListingType] = useState<ListingType>(ListingType.OFFER);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category | ''>('');
    const [city, setCity] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const MAX_IMAGES = 6;
            const remainingSlots = MAX_IMAGES - images.length;
            
            if (remainingSlots <= 0) {
                alert(`Vous pouvez ajouter maximum ${MAX_IMAGES} images par annonce.`);
                e.target.value = '';
                return;
            }
            
            const filesArray = Array.from(files).slice(0, remainingSlots);
            
            if (files.length > remainingSlots) {
                alert(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s). Limite de ${MAX_IMAGES} images atteinte.`);
            }
            
            const newImages = filesArray.map((file: File) => {
                const url = URL.createObjectURL(file);
                console.log('Nouvelle image ajoutée:', file.name, url);
                return url;
            });

            setImages(prevImages => {
                const updated = [...prevImages, ...newImages];
                console.log('Images après:', updated);
                return updated;
            });
            setImageFiles(prevFiles => [...prevFiles, ...filesArray]);
            // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers à nouveau
            e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const moveImageUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        const newFiles = [...imageFiles];
        [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        setImages(newImages);
        setImageFiles(newFiles);
    };

    const moveImageDown = (index: number) => {
        if (index === images.length - 1) return;
        const newImages = [...images];
        const newFiles = [...imageFiles];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        setImages(newImages);
        setImageFiles(newFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setError('Vous devez être connecté pour créer une annonce');
            return;
        }

        if (!category) {
            setError('Veuillez sélectionner une catégorie');
            return;
        }

        setLoading(true);
        setError('');
        setUploadProgress('');

        try {
            let cloudinaryUrls: string[] = [];

            // Upload des images vers Cloudinary si il y en a
            if (imageFiles.length > 0) {
                setUploadProgress(`Upload des images... 0/${imageFiles.length}`);
                cloudinaryUrls = await uploadService.uploadMultipleImages(
                    imageFiles,
                    'listings',
                    (current, total) => {
                        setUploadProgress(`Upload des images... ${current}/${total}`);
                    }
                );

            }

            setUploadProgress('Création de l\'annonce...');

            const listing = await listingsService.createListing({
                title,
                description,
                price: parseFloat(price) || 0,
                category,
                city,
                images: cloudinaryUrls,
                type: listingType,
                userId: user.id,
            });

            if (listing) {

                navigate(`/listing/${listing.id}?showBoost=true`);
            } else {
                setError('Erreur lors de la création de l\'annonce');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'annonce');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    return (
        <div className="bg-gray-50">
            <BackButton />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-900 font-poppins mb-2 text-center">Poster une annonce</h1>
                    <p className="text-gray-600 mb-8 text-center">Remplissez les détails ci-dessous pour mettre votre annonce en ligne.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Type d'annonce */}
                        <div>
                            <Label>Type d'annonce</Label>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                {(Object.values(ListingType)).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setListingType(type)}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold border-2 transition ${listingType === type ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 hover:border-primary-400'}`}
                                    >
                                        {type === ListingType.OFFER ? 'Je vends (Offre)' : 'Je cherche (Demande)'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Titre */}
                        <div>
                            <Label htmlFor="title" required>Titre de l'annonce</Label>
                            <ProtectedAction>
                                <Input 
                                    id="title" 
                                    type="text" 
                                    placeholder="Ex: Canapé d'angle design" 
                                    maxLength={80} 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required 
                                />
                            </ProtectedAction>
                        </div>

                        {/* Catégorie */}
                        <div>
                            <Label htmlFor="category" required>Catégorie</Label>
                            <ProtectedAction>
                                <Select 
                                    id="category" 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as Category)}
                                    required
                                >
                                    <option value="">Choisissez une catégorie</option>
                                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </Select>
                            </ProtectedAction>
                        </div>
                        
                        {/* Description */}
                        <div>
                            <Label htmlFor="description" required>Description</Label>
                            <ProtectedAction>
                                <Textarea 
                                    id="description" 
                                    placeholder="Décrivez votre article ou service en détail..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required 
                                />
                            </ProtectedAction>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Prix */}
                            <div>
                                <Label htmlFor="price" required={listingType !== ListingType.DEMAND}>Prix</Label>
                                <div className="relative">
                                    <ProtectedAction>
                                        <Input 
                                            id="price" 
                                            type="number" 
                                            placeholder={listingType === ListingType.DEMAND ? "Optionnel" : "0"}
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="pr-8"
                                            required={listingType !== ListingType.DEMAND}
                                            min="0"
                                        />
                                    </ProtectedAction>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₪</span>
                                </div>
                                {listingType === ListingType.DEMAND && (
                                    <p className="text-xs text-gray-500 mt-1">Le prix est facultatif pour les demandes.</p>
                                )}
                            </div>
                            
                            {/* Ville */}
                            <div>
                                <Label htmlFor="city" required>Ville</Label>
                                <ProtectedAction>
                                    <Select 
                                        id="city" 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    >
                                         <option value="">Choisissez une ville</option>
                                         {CITIES_ISRAEL.map(cityName => <option key={cityName} value={cityName}>{cityName}</option>)}
                                    </Select>
                                </ProtectedAction>
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <Label>Photos (optionnel)</Label>
                            
                            {/* Grille de miniatures des photos */}
                            {images.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">La première photo sera la photo principale</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                                                {/* Badge de position */}
                                                <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                                                    {index + 1}
                                                </div>
                                                
                                                <img 
                                                    src={img} 
                                                    alt={`Photo ${index + 1}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                                
                                                {/* Boutons de contrôle */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                    {/* Déplacer vers la gauche */}
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImageUp(index)}
                                                            className="bg-white hover:bg-gray-200 text-gray-800 rounded-full p-2 shadow-lg"
                                                            title="Déplacer à gauche"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    {/* Supprimer */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                                                        title="Supprimer"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Déplacer vers la droite */}
                                                    {index < images.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImageDown(index)}
                                                            className="bg-white hover:bg-gray-200 text-gray-800 rounded-full p-2 shadow-lg"
                                                            title="Déplacer à droite"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Zone d'upload */}
                            {images.length < 6 && (
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400 transition-colors">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <PhotoIcon />
                                        <div className="flex text-sm text-gray-600 justify-center mt-2">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                <span>{images.length === 0 ? 'Ajouter une photo' : 'Ajouter une photo'}</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
                                        <p className="text-xs text-primary-600 font-medium mt-1">{images.length}/6 images</p>
                                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleImageChange} accept="image/*"/>
                                    </div>
                                </div>
                            )}
                            {images.length >= 6 && (
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 font-medium">Limite de 6 images atteinte</p>
                                        <p className="text-xs text-gray-500 mt-1">Supprimez une image pour en ajouter une autre</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        {uploadProgress && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm text-center">
                                {uploadProgress}
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <ProtectedAction>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-bold py-3 px-8 rounded-2xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Publication...' : 'Publier mon annonce'}
                                </button>
                            </ProtectedAction>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
