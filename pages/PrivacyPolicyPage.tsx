import React from 'react';
import { BackButton } from '../components/BackButton';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
          <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 25 novembre 2025</p>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 mb-3">
              Appyna attache une grande importance à la protection de vos données personnelles et au respect de votre vie privée. La présente Politique de Confidentialité vous informe sur la manière dont nous collectons, utilisons, partageons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois israéliennes applicables.
            </p>
            <p className="text-gray-700">
              En utilisant notre plateforme accessible à l'adresse <a href="https://appyna.com" className="text-primary-600 hover:underline">https://appyna.com</a>, vous acceptez les pratiques décrites dans cette politique.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Identité du responsable du traitement</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2"><strong>Nom :</strong> Appyna</p>
              <p className="text-gray-700 mb-2"><strong>Siège social :</strong> Jérusalem, Israël</p>
              <p className="text-gray-700 mb-2"><strong>Numéro d'immatriculation :</strong> En cours d'immatriculation</p>
              <p className="text-gray-700 mb-2"><strong>Email de contact (DPO) :</strong> <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Données personnelles collectées</h2>
            <p className="text-gray-700 mb-4">
              Nous collectons les données personnelles suivantes :
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">a) Données fournies directement par vous :</h3>
            <ul className="list-disc ml-5 text-gray-700 mb-4 space-y-1">
              <li><strong>Adresse email</strong> (obligatoire) : pour créer votre compte et vous envoyer des notifications</li>
              <li><strong>Nom et prénom</strong> (obligatoire) : pour identifier votre profil</li>
              <li><strong>Numéro de téléphone</strong> (optionnel) : pour faciliter les échanges avec d'autres utilisateurs</li>
              <li><strong>Photo de profil (avatar)</strong> (optionnel) : pour personnaliser votre profil</li>
              <li><strong>Contenu des annonces</strong> : titres, descriptions, prix, catégories, villes, photos</li>
              <li><strong>Messages</strong> : contenus des conversations avec d'autres utilisateurs</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">b) Données collectées automatiquement :</h3>
            <ul className="list-disc ml-5 text-gray-700 mb-4 space-y-1">
              <li><strong>Adresse IP</strong> : pour des raisons de sécurité et de prévention des abus</li>
              <li><strong>Données de navigation</strong> : pages consultées, temps passé, clics (via Google Analytics)</li>
              <li><strong>Cookies</strong> : identifiant de session, préférences, statistiques (voir notre <a href="/cookies" className="text-primary-600 hover:underline">Politique de Cookies</a>)</li>
              <li><strong>Informations sur l'appareil</strong> : type de navigateur, système d'exploitation, résolution d'écran</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">c) Données de paiement :</h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li><strong>Informations de carte bancaire</strong> : traitées exclusivement par Stripe (nous ne stockons JAMAIS vos données bancaires)</li>
              <li><strong>Historique des boosts</strong> : date, durée, montant payé</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Base légale et finalités du traitement</h2>
            <p className="text-gray-700 mb-4">
              Nous traitons vos données personnelles sur les bases légales suivantes :
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">Exécution du contrat (CGU)</p>
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                  <li>Création et gestion de votre compte utilisateur</li>
                  <li>Publication et affichage de vos annonces</li>
                  <li>Messagerie entre utilisateurs</li>
                  <li>Traitement des boosts payants</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">Consentement</p>
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                  <li>Envoi de newsletters marketing (opt-in)</li>
                  <li>Utilisation de cookies non essentiels (Google Analytics, Google AdMob)</li>
                  <li>Photo de profil et numéro de téléphone (optionnels)</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">Intérêt légitime</p>
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                  <li>Modération des contenus et lutte contre les abus</li>
                  <li>Sécurité de la plateforme (détection de fraudes, bots, cyberattaques)</li>
                  <li>Amélioration de nos services (analyses statistiques anonymisées)</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">Obligation légale</p>
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                  <li>Conservation des factures de boosts (7 ans conformément au droit fiscal israélien)</li>
                  <li>Réponse aux demandes des autorités judiciaires</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Destinataires de vos données</h2>
            <p className="text-gray-700 mb-4">
              Vos données personnelles peuvent être partagées avec les tiers suivants :
            </p>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">🗄️ Supabase (USA)</p>
                <p className="text-sm text-gray-700">Hébergement de la base de données (utilisateurs, annonces, messages)</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">☁️ Cloudinary (USA)</p>
                <p className="text-sm text-gray-700">Stockage et optimisation des images uploadées</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Stripe (USA)</p>
                <p className="text-sm text-gray-700">Traitement sécurisé des paiements pour les boosts</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Google Analytics (USA)</p>
                <p className="text-sm text-gray-700">Statistiques de fréquentation et comportement des utilisateurs</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Google AdMob (USA)</p>
                <p className="text-sm text-gray-700">Diffusion de publicités ciblées (avec votre consentement)</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Vercel (USA)</p>
                <p className="text-sm text-gray-700">Hébergement du site web et CDN</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Resend (USA)</p>
                <p className="text-sm text-gray-700">Envoi des emails transactionnels (confirmation d'inscription, réinitialisation mot de passe)</p>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-900 mb-1">Sentry (Allemagne)</p>
                <p className="text-sm text-gray-700">Monitoring et capture automatique des erreurs techniques pour améliorer la stabilité du site</p>
              </div>
            </div>

            <p className="text-gray-700 mt-4 text-sm">
              <strong>Important :</strong> Nous ne vendons jamais vos données personnelles à des tiers. Les prestataires ci-dessus sont contractuellement tenus de protéger vos données et de ne les utiliser que dans le cadre des services fournis à Appyna.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Transferts internationaux de données</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-3">
              <p className="text-yellow-900 font-semibold mb-2">Vos données sont transférées hors de l'Union Européenne</p>
              <p className="text-yellow-800 text-sm">
                La plupart de nos prestataires (Supabase, Stripe, Cloudinary, Google, Vercel, Resend) sont situés aux États-Unis. Ces transferts sont encadrés par des <strong>Clauses Contractuelles Types (CCT)</strong> approuvées par la Commission Européenne, garantissant un niveau de protection adéquat de vos données.
              </p>
            </div>
            <p className="text-gray-700">
              Suite à l'invalidation du Privacy Shield en 2020, nous nous assurons que tous nos prestataires américains ont mis en place des garanties supplémentaires (chiffrement, contrôles d'accès stricts, audits réguliers).
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Durée de conservation des données</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🕒</span>
                <div>
                  <p className="font-semibold text-gray-900">Pendant la durée de votre compte</p>
                  <p className="text-sm text-gray-700">Vos données (profil, annonces, messages) sont conservées tant que votre compte est actif. Aucune suppression automatique après inactivité.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-3">🗑️</span>
                <div>
                  <p className="font-semibold text-gray-900">Après suppression de votre compte</p>
                  <p className="text-sm text-gray-700">Vos données sont conservées 30 jours (sauvegarde de sécurité), puis définitivement supprimées de nos serveurs et de ceux de nos prestataires.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-3">📄</span>
                <div>
                  <p className="font-semibold text-gray-900">Données fiscales (factures de boosts)</p>
                  <p className="text-sm text-gray-700">Conservées 7 ans conformément aux obligations légales israéliennes en matière fiscale et comptable.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-3">🍪</span>
                <div>
                  <p className="font-semibold text-gray-900">Cookies</p>
                  <p className="text-sm text-gray-700">Durée variable selon le type de cookie (de quelques heures à 2 ans). Consultez notre <a href="/cookies" className="text-primary-600 hover:underline">Politique de Cookies</a> pour plus de détails.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Vos droits (RGPD)</h2>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">✅ Droit d'accès</p>
                <p className="text-sm text-gray-700">Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">✏️ Droit de rectification</p>
                <p className="text-sm text-gray-700">Vous pouvez corriger vos informations directement depuis votre profil ou nous demander de le faire.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">🗑️ Droit à l'effacement ("droit à l'oubli")</p>
                <p className="text-sm text-gray-700">Vous pouvez supprimer votre compte à tout moment. Vos données seront définitivement effacées après 30 jours (sauf données fiscales conservées 7 ans).</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">📦 Droit à la portabilité</p>
                <p className="text-sm text-gray-700">Vous pouvez récupérer vos données dans un format structuré et couramment utilisé (JSON, CSV).</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">🚫 Droit d'opposition</p>
                <p className="text-sm text-gray-700">Vous pouvez vous opposer au traitement de vos données à des fins de marketing direct (désinscription newsletter) ou de profilage publicitaire.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">⏸️ Droit de limitation du traitement</p>
                <p className="text-sm text-gray-700">Vous pouvez demander la suspension temporaire du traitement de vos données dans certaines situations (contestation de l'exactitude, traitement illicite).</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-900 mb-1">🔙 Droit de retirer votre consentement</p>
                <p className="text-sm text-gray-700">Vous pouvez retirer votre consentement à tout moment pour la newsletter, les cookies non essentiels ou l'utilisation de votre photo de profil.</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-3">
              <p className="font-semibold text-blue-900 mb-2">Comment exercer vos droits ?</p>
              <p className="text-blue-800 text-sm mb-2">
                Pour exercer l'un de ces droits, envoyez un email à : <a href="mailto:appyna.contact@gmail.com" className="underline font-semibold">appyna.contact@gmail.com</a>
              </p>
              <p className="text-blue-800 text-sm">
                Nous vous répondrons dans un délai maximum de <strong>1 mois</strong> suivant votre demande. En cas de demande complexe, ce délai peut être prolongé de 2 mois supplémentaires (vous serez informé).
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Protection des mineurs</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-semibold text-red-900 mb-2">🔞 Âge minimum : 18 ans</p>
              <p className="text-red-800 text-sm">
                Appyna est réservée aux personnes majeures (18 ans et plus). Nous ne collectons pas sciemment de données personnelles auprès de mineurs. Si vous avez connaissance qu'un mineur a créé un compte sur notre plateforme, merci de nous le signaler immédiatement à <a href="mailto:appyna.contact@gmail.com" className="underline">appyna.contact@gmail.com</a>. Nous supprimerons immédiatement ce compte.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Sécurité des données</h2>
            <p className="text-gray-700 mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou divulgation :
            </p>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li><strong>Chiffrement HTTPS</strong> : Toutes les communications entre votre navigateur et nos serveurs sont chiffrées (SSL/TLS)</li>
              <li><strong>Mots de passe hashés</strong> : Vos mots de passe sont chiffrés de manière irréversible (algorithme bcrypt)</li>
              <li><strong>Row Level Security (RLS)</strong> : Chaque utilisateur ne peut accéder qu'à ses propres données dans la base de données</li>
              <li><strong>Sauvegardes régulières</strong> : Vos données sont sauvegardées quotidiennement pour éviter toute perte</li>
              <li><strong>Audits de sécurité</strong> : Nous effectuons régulièrement des tests de sécurité et des mises à jour</li>
              <li><strong>Accès restreint</strong> : Seuls les employés autorisés ont accès aux données, dans le cadre strict de leurs fonctions</li>
            </ul>
            <p className="text-gray-700 mt-4 text-sm">
              Malgré ces mesures, aucun système n'est totalement infaillible. En cas de violation de données (data breach), nous vous en informerons dans les 72 heures conformément au RGPD.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Cookies et technologies similaires</h2>
            <p className="text-gray-700 mb-3">
              Nous utilisons des cookies et technologies similaires pour améliorer votre expérience sur la plateforme. Un cookie est un petit fichier texte stocké sur votre appareil.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Types de cookies utilisés :</strong>
            </p>
            <ul className="list-disc ml-5 text-gray-700 mb-4 space-y-1">
              <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site (session, authentification) - pas de consentement requis</li>
              <li><strong>Cookies analytiques</strong> (Google Analytics) : statistiques de fréquentation - consentement requis</li>
              <li><strong>Cookies publicitaires</strong> (Google AdMob) : publicités personnalisées - consentement requis</li>
            </ul>
            <p className="text-gray-700 mb-3">
              Pour plus d'informations sur les cookies que nous utilisons et comment les gérer, consultez notre <a href="/cookies" className="text-primary-600 hover:underline font-semibold">Politique de Cookies</a>.
            </p>
            <p className="text-gray-700">
              Vous pouvez refuser les cookies non essentiels en nous contactant à <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a> ou en configurant les paramètres de votre navigateur.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Notification de violation de données</h2>
            <p className="text-gray-700 mb-3">
              En cas de violation de données personnelles susceptible d'engendrer un risque élevé pour vos droits et libertés (vol de données, cyberattaque, fuite de données), nous nous engageons à :
            </p>
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li>Notifier l'autorité israélienne de protection des données dans un délai de <strong>72 heures</strong></li>
              <li>Vous informer directement par email dans les <strong>meilleurs délais</strong></li>
              <li>Vous indiquer les mesures prises pour limiter les conséquences de cette violation</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. Droit de déposer une plainte</h2>
            <p className="text-gray-700 mb-3">
              Si vous estimez que vos droits en matière de protection des données n'ont pas été respectés, vous avez le droit de déposer une plainte auprès de l'<strong>Autorité israélienne de protection des données</strong>.
            </p>
            <p className="text-gray-700">
              Toutefois, nous vous encourageons à nous contacter en priorité à <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a> afin que nous puissions résoudre le problème à l'amiable.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">13. Modifications de la Politique de Confidentialité</h2>
            <p className="text-gray-700 mb-3">
              Nous nous réservons le droit de modifier la présente Politique de Confidentialité à tout moment, notamment pour nous conformer à l'évolution de la législation ou de nos pratiques.
            </p>
            <p className="text-gray-700 mb-3">
              Toute modification substantielle vous sera notifiée par email au moins <strong>30 jours</strong> avant son entrée en vigueur.
            </p>
            <p className="text-gray-700">
              Nous vous recommandons de consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact - Délégué à la Protection des Données (DPO)</h2>
            <p className="text-gray-700 mb-2">
              Pour toute question relative à la protection de vos données personnelles ou pour exercer vos droits RGPD :
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email :</strong> <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline font-semibold">appyna.contact@gmail.com</a>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Adresse postale :</strong> Appyna, Jérusalem, Israël
            </p>
            <p className="text-gray-700 text-sm mt-4">
              Délai de réponse garanti : <strong>1 mois maximum</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
