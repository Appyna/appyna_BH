import React from 'react';
import { BackButton } from '../components/BackButton';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Cookies</h1>
          <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 25 novembre 2025</p>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 mb-3">
              La présente Politique de Cookies explique ce que sont les cookies, comment nous les utilisons sur la plateforme Appyna, et comment vous pouvez les gérer ou les refuser.
            </p>
            <p className="text-gray-700">
              En utilisant notre site web <a href="https://appyna.com" className="text-primary-600 hover:underline">https://appyna.com</a>, vous acceptez l'utilisation de cookies conformément à cette politique.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-700 mb-3">
              Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences (comme votre connexion, langue, taille de police, etc.) pendant une certaine période, afin que vous n'ayez pas à les ressaisir à chaque fois que vous revenez sur le site ou naviguez d'une page à l'autre.
            </p>
            <p className="text-gray-700">
              Les cookies ne contiennent aucune information permettant de vous contacter par téléphone, email ou courrier. Ils ne peuvent pas extraire d'informations de votre disque dur ou transmettre des virus informatiques.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Pourquoi utilisons-nous des cookies ?</h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons des cookies pour plusieurs raisons :
            </p>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li><strong>Assurer le bon fonctionnement du site</strong> : cookies essentiels pour la navigation, l'authentification et la sécurité</li>
              <li><strong>Améliorer votre expérience</strong> : mémoriser vos préférences (langue, filtres de recherche, etc.)</li>
              <li><strong>Analyser la fréquentation</strong> : comprendre comment vous utilisez notre site pour l'améliorer (Google Analytics)</li>
              <li><strong>Personnaliser les publicités</strong> : afficher des publicités pertinentes (Google AdMob)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Types de cookies utilisés sur Appyna</h2>

            <div className="space-y-6">
              {/* Cookies essentiels */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies strictement nécessaires (essentiels)</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés dans nos systèmes et ne nécessitent pas votre consentement selon le RGPD.
                </p>
                
                <div className="bg-gray-50 rounded p-3 mb-2">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Cookie de session Supabase</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Nom :</strong> sb-access-token, sb-refresh-token</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Finalité :</strong> Maintenir votre session connectée, authentification sécurisée</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Durée :</strong> Session (supprimé à la fermeture du navigateur) ou 7 jours (si "Se souvenir de moi")</p>
                  <p className="text-xs text-gray-700"><strong>Émetteur :</strong> Appyna (first-party)</p>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Cookie de position de scroll</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Nom :</strong> scrollPosition</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Finalité :</strong> Mémoriser votre position de défilement lors de la navigation (UX)</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Durée :</strong> Session</p>
                  <p className="text-xs text-gray-700"><strong>Émetteur :</strong> Appyna (first-party)</p>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies analytiques (statistiques)</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Ces cookies nous permettent de mesurer l'audience du site et de comprendre comment les visiteurs utilisent nos pages. <strong>Votre consentement est requis.</strong>
                </p>
                
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Google Analytics</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Nom :</strong> _ga, _gid, _gat</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Finalité :</strong> Analyse du trafic, pages les plus visitées, temps passé, taux de rebond, données démographiques (âge, sexe, centres d'intérêt)</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Durée :</strong> _ga : 2 ans, _gid : 24 heures, _gat : 1 minute</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Émetteur :</strong> Google LLC (third-party, USA)</p>
                  <p className="text-xs text-gray-700"><strong>En savoir plus :</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Politique de confidentialité de Google</a></p>
                </div>
              </div>

              {/* Cookies publicitaires */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies publicitaires</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Ces cookies sont utilisés pour afficher des publicités personnalisées en fonction de vos centres d'intérêt. <strong>Votre consentement est requis.</strong>
                </p>
                
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Google AdMob</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Nom :</strong> IDE, _gcl_au, NID</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Finalité :</strong> Diffusion de publicités ciblées, mesure de l'efficacité des campagnes publicitaires, limitation du nombre d'affichages d'une même publicité</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Durée :</strong> IDE : 13 mois, _gcl_au : 3 mois, NID : 6 mois</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Émetteur :</strong> Google LLC (third-party, USA)</p>
                  <p className="text-xs text-gray-700"><strong>En savoir plus :</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Comment Google utilise les cookies publicitaires</a></p>
                </div>
              </div>

              {/* Cookies de paiement */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de paiement</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Ces cookies sont nécessaires au traitement sécurisé des paiements pour les boosts d'annonces.
                </p>
                
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Stripe</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Nom :</strong> __stripe_mid, __stripe_sid</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Finalité :</strong> Prévention de la fraude, traitement sécurisé des paiements</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Durée :</strong> __stripe_mid : 1 an, __stripe_sid : 30 minutes</p>
                  <p className="text-xs text-gray-700 mb-1"><strong>Émetteur :</strong> Stripe Inc. (third-party, USA)</p>
                  <p className="text-xs text-gray-700"><strong>En savoir plus :</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Politique de confidentialité de Stripe</a></p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies tiers (third-party cookies)</h2>
            <p className="text-gray-700 mb-3">
              Certains cookies sont déposés par des services tiers (Google Analytics, Google AdMob, Stripe) pour nous aider à améliorer nos services ou à mesurer l'efficacité de nos campagnes publicitaires.
            </p>
            <p className="text-gray-700">
              Ces cookies sont soumis aux politiques de confidentialité de ces tiers. Nous n'avons aucun contrôle sur ces cookies et vous encourageons à consulter leurs politiques de confidentialité respectives (liens fournis ci-dessus).
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Comment gérer ou refuser les cookies ?</h2>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-blue-900 mb-2">Contacter Appyna</p>
              <p className="text-blue-800 text-sm">
                Pour refuser les cookies non essentiels (Google Analytics, Google AdMob), envoyez un email à : <a href="mailto:appyna.contact@gmail.com" className="underline font-semibold">appyna.contact@gmail.com</a>
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Paramètres de votre navigateur</h3>
            <p className="text-gray-700 mb-3">
              Vous pouvez également gérer les cookies directement via les paramètres de votre navigateur. Voici comment procéder pour les navigateurs les plus courants :
            </p>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 text-sm mb-1">Google Chrome</p>
                <p className="text-xs text-gray-700">Paramètres → Confidentialité et sécurité → Cookies et autres données de sites → Bloquer les cookies tiers</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 text-sm mb-1">Mozilla Firefox</p>
                <p className="text-xs text-gray-700">Options → Vie privée et sécurité → Cookies et données de sites → Bloquer les cookies</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 text-sm mb-1">Safari</p>
                <p className="text-xs text-gray-700">Préférences → Confidentialité → Bloquer tous les cookies</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 text-sm mb-1">Microsoft Edge</p>
                <p className="text-xs text-gray-700">Paramètres → Cookies et autorisations de site → Gérer et supprimer les cookies</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-900 font-semibold mb-1">Attention</p>
              <p className="text-yellow-800 text-sm">
                Le blocage de tous les cookies peut affecter le fonctionnement de certaines parties du site, notamment la connexion à votre compte et la sauvegarde de vos préférences.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cookies et profilage publicitaire</h2>
            <p className="text-gray-700 mb-3">
              Les cookies publicitaires de Google AdMob peuvent être utilisés pour créer un profil de vos centres d'intérêt basé sur votre navigation. Ce profilage permet d'afficher des publicités plus pertinentes.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Vous pouvez vous opposer au profilage publicitaire :</strong>
            </p>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>En désactivant la personnalisation des annonces dans vos <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">paramètres Google Ads</a></li>
              <li>En installant le <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">module complémentaire de navigateur pour la désactivation de Google Analytics</a></li>
              <li>En nous contactant à <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a></li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Durée de conservation des cookies</h2>
            <p className="text-gray-700 mb-3">
              La durée de conservation des cookies varie selon leur type :
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Cookies de session</strong> : supprimés à la fermeture du navigateur</li>
                <li>• <strong>Cookies Supabase</strong> : jusqu'à 7 jours (si "Se souvenir de moi")</li>
                <li>• <strong>Google Analytics</strong> : jusqu'à 2 ans</li>
                <li>• <strong>Google AdMob</strong> : jusqu'à 13 mois</li>
                <li>• <strong>Stripe</strong> : jusqu'à 1 an</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Modifications de la Politique de Cookies</h2>
            <p className="text-gray-700 mb-3">
              Nous nous réservons le droit de modifier la présente Politique de Cookies à tout moment, notamment pour nous conformer à l'évolution de la législation ou de nos pratiques.
            </p>
            <p className="text-gray-700">
              Toute modification substantielle vous sera notifiée par email ou via un bandeau d'information sur le site. Nous vous recommandons de consulter régulièrement cette page pour rester informé.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 mb-2">
              Pour toute question relative aux cookies ou pour exercer vos droits :
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email :</strong> <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline font-semibold">appyna.contact@gmail.com</a>
            </p>
            <p className="text-gray-700">
              <strong>Adresse :</strong> Appyna, Jérusalem, Israël
            </p>
          </section>

          {/* Liens utiles */}
          <section className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Liens utiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="/terms" className="text-primary-600 hover:underline text-sm">→ Conditions Générales d'Utilisation</a>
              <a href="/privacy" className="text-primary-600 hover:underline text-sm">→ Politique de Confidentialité</a>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">→ Politique de Google</a>
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">→ Politique de Stripe</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
