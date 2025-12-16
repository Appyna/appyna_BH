import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/icons/Logo';
import { useAuth } from '../contexts/AuthContext';
import { listingsService } from '../lib/listingsService';

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedVeracity, setAcceptedVeracity] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            setError('Veuillez accepter les conditions d\'utilisation pour continuer.');
            return;
        }
        if (!acceptedVeracity) {
            setError('Veuillez confirmer la véracité de votre profil pour continuer.');
            return;
        }
        
        setError('');
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const rawName = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Normaliser le nom : trim + réduire espaces multiples à un seul
        const name = rawName.trim().replace(/\s+/g, ' ');

        // Vérifier si le nom d'utilisateur est disponible
        const isAvailable = await listingsService.checkUsernameAvailable(name);
        if (!isAvailable) {
            setError('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');
            setLoading(false);
            return;
        }

        const result = await register({ name, email, password });
        
        if (result.success) {
            // Rediriger vers la page de confirmation email
            navigate('/email-confirmation');
        } else {
            setError(result.error || 'Une erreur est survenue lors de l\'inscription.');
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-teal-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 sm:mt-8 text-center text-3xl sm:text-4xl font-bold font-poppins">
                    <span className="text-gray-900">Bienvenue sur </span>
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Appyna</span>
                    <span className="text-gray-900"> !</span>
                </h2>
                <p className="mt-2 sm:mt-3 text-center text-lg text-gray-600 font-montserrat">
                    Créez votre compte en quelques clics
                </p>
                <p className="mt-3 sm:mt-4 text-center text-sm text-gray-500">
                    Déjà membre ?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                        Connectez-vous ici
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-8 sm:py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom complet
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                maxLength={50}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="Votre nom complet"
                            />
                            <p className="mt-1 text-xs text-gray-500">Maximum 50 caractères</p>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="Minimum 8 caractères"
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-xs">
                                <label htmlFor="terms" className="text-gray-700 font-montserrat">
                                    J'accepte les{' '}
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(true)}
                                        className="font-semibold text-primary-600 hover:text-primary-500 underline transition-colors"
                                    >
                                        conditions d'utilisation
                                    </button>
                                    {' '}du site Appyna.
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="veracity"
                                    name="veracity"
                                    type="checkbox"
                                    checked={acceptedVeracity}
                                    onChange={(e) => setAcceptedVeracity(e.target.checked)}
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-xs">
                                <label htmlFor="veracity" className="text-gray-700 font-montserrat">
                                    Je garantis la véracité de mon profil, et reconnais que des informations ou profils tiers peuvent être inexacts, ce dont j'assume la responsabilité.
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Inscription...' : 'Créer mon compte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal des Conditions d'utilisation */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden relative">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                                Conditions d'utilisation de Appyna
                            </h3>
                            <button
                                onClick={() => setShowTerms(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-88px)]">
                            <div className="prose prose-sm max-w-none font-montserrat text-gray-700 space-y-6">
                                <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 25 novembre 2025</p>

                                {/* Article 1 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 1 - Objet et champ d'application</h2>
                                    <p className="text-sm mb-2">
                                        Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation de la plateforme Appyna, accessible à l'adresse <a href="https://appyna.com" className="text-primary-600 hover:underline">https://appyna.com</a> (ci-après "la Plateforme").
                                    </p>
                                    <p className="text-sm mb-2">
                                        Appyna est une plateforme en ligne permettant aux utilisateurs de publier des annonces de biens et services, de consulter les annonces d'autres utilisateurs, et de communiquer entre eux via un système de messagerie intégré.
                                    </p>
                                    <p className="text-sm">
                                        L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez vous abstenir d'utiliser la Plateforme.
                                    </p>
                                </section>

                                {/* Article 2 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 2 - Accès à la plateforme</h2>
                                    <p className="text-sm mb-2">
                                        <strong>Âge minimum :</strong> L'accès à la Plateforme est réservé aux personnes âgées d'au moins 18 ans. En vous inscrivant, vous déclarez et garantissez avoir au moins 18 ans.
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>Inscription obligatoire :</strong> La création d'un compte utilisateur est nécessaire pour publier des annonces, envoyer des messages et accéder à certaines fonctionnalités de la Plateforme.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Vérification email :</strong> Lors de votre inscription, un email de confirmation vous sera envoyé. Vous devez cliquer sur le lien de validation pour activer votre compte.
                                    </p>
                                </section>

                                {/* Article 3 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 3 - Création et gestion de compte</h2>
                                    <p className="text-sm mb-2">
                                        <strong>Informations exactes :</strong> Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription. Toute fausse information peut entraîner la suspension ou la suppression de votre compte.
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>Sécurité du compte :</strong> Vous êtes seul responsable de la confidentialité de votre mot de passe et de toute activité effectuée sous votre compte. En cas d'utilisation non autorisée de votre compte, vous devez immédiatement nous en informer à l'adresse <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a>.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Compte unique :</strong> Chaque utilisateur ne peut créer qu'un seul compte. La création de comptes multiples dans le but d'abuser du système est strictement interdite et peut entraîner le bannissement définitif de tous vos comptes.
                                    </p>
                                </section>

                                {/* Article 4 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 4 - Publication d'annonces</h2>
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                                        <p className="font-bold text-red-800 mb-1 text-sm">CONTENUS STRICTEMENT INTERDITS</p>
                                        <p className="text-red-700 text-xs mb-2">
                                            La publication des contenus suivants est formellement interdite et entraînera la suppression immédiate de votre annonce et le bannissement de votre compte, sans préavis :
                                        </p>
                                        <ul className="list-disc ml-4 text-red-700 text-xs space-y-1">
                                            <li>Armes, munitions, explosifs ou matériel militaire</li>
                                            <li>Drogues, stupéfiants ou substances illicites</li>
                                            <li>Contrefaçons ou produits piratés</li>
                                            <li>Contenus à caractère pornographique, pédopornographique ou sexuellement explicites</li>
                                            <li>Animaux protégés ou issus du trafic</li>
                                            <li>Services illégaux (piratage, blanchiment, prostitution, etc.)</li>
                                            <li>Documents officiels falsifiés</li>
                                            <li>Contenus incitant à la haine, au racisme ou à la discrimination</li>
                                        </ul>
                                    </div>
                                    <p className="text-sm mb-2">
                                        <strong>Obligation de véracité :</strong> Vous vous engagez à publier des annonces véridiques, exactes et non trompeuses.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Limites techniques :</strong> Chaque annonce peut contenir un maximum de 6 images. Vous ne pouvez publier plus de 15 annonces par jour.
                                    </p>
                                </section>

                                {/* Article 5 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 5 - Responsabilité des utilisateurs</h2>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-3">
                                        <p className="font-bold text-yellow-900 mb-1 text-sm">AVERTISSEMENT IMPORTANT</p>
                                        <p className="text-yellow-800 text-xs mb-2">
                                            <strong>Appyna n'est qu'un intermédiaire technique.</strong> Nous ne vérifions pas l'identité des utilisateurs ni la véracité des annonces.
                                        </p>
                                        <p className="text-yellow-800 text-xs font-bold">
                                            VIGILANCE : Soyez prudent, vérifiez l'identité de vos interlocuteurs et privilégiez les rencontres dans des lieux publics.
                                        </p>
                                    </div>
                                    <p className="text-sm mb-2">
                                        <strong>Responsabilité exclusive :</strong> Vous êtes seul responsable de vos annonces, de vos messages et de toute transaction conclue avec d'autres utilisateurs.
                                    </p>
                                </section>

                                {/* Article 6 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 6 - Modération et signalement</h2>
                                    <p className="text-sm mb-2">
                                        <strong>Droit de modération :</strong> Appyna se réserve le droit, sans préavis ni justification, de supprimer ou masquer toute annonce, message ou contenu qui contreviendrait aux présentes CGU.
                                    </p>
                                    <p className="text-sm">
                                        <strong>Bannissement :</strong> En cas de violation grave ou répétée des CGU, Appyna peut suspendre ou supprimer définitivement votre compte.
                                    </p>
                                </section>

                                {/* Article 7 */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Article 7 - Service de boost payant</h2>
                                    <p className="text-sm mb-2">
                                        <strong>Tarifs :</strong> Boost 1 jour : 9,90 ₪ | Boost 3 jours : 24,90 ₪ | Boost 7 jours : 39,90 ₪
                                    </p>
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-2">
                                        <p className="font-bold text-red-800 text-xs">❌ Les boosts sont strictement non remboursables.</p>
                                    </div>
                                </section>

                                {/* Articles restants résumés */}
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Articles complémentaires</h2>
                                    <p className="text-sm mb-2">
                                        <strong>Messagerie (Art. 8) :</strong> Limite de 5 000 caractères par message. Interdiction de spam et contenus illégaux.
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>Données personnelles (Art. 10) :</strong> Consultez notre Politique de Confidentialité pour plus d'informations.
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>Limitation de responsabilité (Art. 11) :</strong> Appyna ne garantit pas la disponibilité 24/7 ni la véracité des annonces.
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>Litiges (Art. 13) :</strong> Loi applicable : droit israélien. Tribunaux compétents : Jérusalem, Israël.
                                    </p>
                                </section>

                                {/* Contact */}
                                <section className="bg-primary-50 rounded-lg p-4 mt-4">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">Contact</h2>
                                    <p className="text-sm text-gray-700">
                                        <strong>Appyna</strong><br/>
                                        Siège social : Jérusalem, Israël<br/>
                                        Email : <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a>
                                    </p>
                                </section>

                                <p className="text-xs text-gray-500 text-center mt-6">
                                    Pour lire l'intégralité des CGU, rendez-vous sur la page dédiée après votre inscription.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
