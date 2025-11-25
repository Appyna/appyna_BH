import React from 'react';
import { BackButton } from '../components/BackButton';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 25 novembre 2025</p>

          {/* Article 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 1 - Objet et champ d'application</h2>
            <p className="text-gray-700 mb-3">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation de la plateforme Appyna, accessible à l'adresse <a href="https://appyna.com" className="text-primary-600 hover:underline">https://appyna.com</a> (ci-après "la Plateforme").
            </p>
            <p className="text-gray-700 mb-3">
              Appyna est une plateforme en ligne permettant aux utilisateurs de publier des annonces de biens et services, de consulter les annonces d'autres utilisateurs, et de communiquer entre eux via un système de messagerie intégré.
            </p>
            <p className="text-gray-700">
              L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez vous abstenir d'utiliser la Plateforme.
            </p>
          </section>

          {/* Article 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 2 - Accès à la plateforme</h2>
            <p className="text-gray-700 mb-3">
              <strong>Âge minimum :</strong> L'accès à la Plateforme est réservé aux personnes âgées d'au moins 18 ans. En vous inscrivant, vous déclarez et garantissez avoir au moins 18 ans.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Inscription obligatoire :</strong> La création d'un compte utilisateur est nécessaire pour publier des annonces, envoyer des messages et accéder à certaines fonctionnalités de la Plateforme.
            </p>
            <p className="text-gray-700">
              <strong>Vérification email :</strong> Lors de votre inscription, un email de confirmation vous sera envoyé. Vous devez cliquer sur le lien de validation pour activer votre compte.
            </p>
          </section>

          {/* Article 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 3 - Création et gestion de compte</h2>
            <p className="text-gray-700 mb-3">
              <strong>Informations exactes :</strong> Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription. Toute fausse information peut entraîner la suspension ou la suppression de votre compte.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Sécurité du compte :</strong> Vous êtes seul responsable de la confidentialité de votre mot de passe et de toute activité effectuée sous votre compte. En cas d'utilisation non autorisée de votre compte, vous devez immédiatement nous en informer à l'adresse <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a>.
            </p>
            <p className="text-gray-700">
              <strong>Compte unique :</strong> Chaque utilisateur ne peut créer qu'un seul compte. La création de comptes multiples dans le but d'abuser du système est strictement interdite et peut entraîner le bannissement définitif de tous vos comptes.
            </p>
          </section>

          {/* Article 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 4 - Publication d'annonces</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="font-bold text-red-800 mb-2">⚠️ CONTENUS STRICTEMENT INTERDITS</p>
              <p className="text-red-700 text-sm">
                La publication des contenus suivants est formellement interdite et entraînera la suppression immédiate de votre annonce et le bannissement de votre compte, sans préavis :
              </p>
              <ul className="list-disc ml-5 mt-2 text-red-700 text-sm space-y-1">
                <li>Armes, munitions, explosifs ou matériel militaire</li>
                <li>Drogues, stupéfiants ou substances illicites</li>
                <li>Contrefaçons ou produits piratés</li>
                <li>Contenus à caractère pornographique, pédopornographique ou sexuellement explicites</li>
                <li>Animaux protégés ou issus du trafic</li>
                <li>Services illégaux (piratage, blanchiment, prostitution, etc.)</li>
                <li>Documents officiels falsifiés (passeports, permis, diplômes, etc.)</li>
                <li>Contenus incitant à la haine, au racisme, à l'antisémitisme ou à la discrimination</li>
                <li>Contenus à des fins terroristes ou incitant à la violence</li>
                <li>Organes humains ou parties du corps</li>
                <li>Médicaments sur ordonnance sans prescription</li>
                <li>Produits dangereux ou rappelés par les autorités</li>
              </ul>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>Obligation de véracité :</strong> Vous vous engagez à publier des annonces véridiques, exactes et non trompeuses. Toute fausse déclaration, omission volontaire ou tentative de fraude est strictement interdite.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Propriété intellectuelle :</strong> Vous garantissez être titulaire des droits sur les photos et textes que vous publiez, ou disposer des autorisations nécessaires. Toute violation des droits d'auteur ou de la propriété intellectuelle d'un tiers engage votre seule responsabilité.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Limites techniques :</strong> Chaque annonce peut contenir un maximum de 6 images. Vous ne pouvez publier plus de 15 annonces par jour.
            </p>
            <p className="text-gray-700">
              <strong>Langue :</strong> Les annonces doivent être rédigées en français. Les annonces dans d'autres langues pourront être supprimées.
            </p>
          </section>

          {/* Article 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 5 - Responsabilité des utilisateurs</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="font-bold text-yellow-900 mb-2">⚠️ AVERTISSEMENT IMPORTANT</p>
              <p className="text-yellow-800 text-sm mb-2">
                <strong>Appyna n'est qu'un intermédiaire technique.</strong> Nous mettons uniquement en relation des utilisateurs. Nous ne sommes PAS partie aux transactions conclues entre utilisateurs.
              </p>
              <p className="text-yellow-800 text-sm mb-2">
                <strong>Aucune vérification :</strong> Appyna ne vérifie pas l'identité des utilisateurs, la véracité des annonces, ni la qualité des biens et services proposés.
              </p>
              <p className="text-yellow-800 text-sm font-bold">
                ⚠️ VIGILANCE : Les utilisateurs peuvent mentir, utiliser de fausses identités ou publier des annonces frauduleuses. Soyez prudent, vérifiez l'identité de vos interlocuteurs et privilégiez les rencontres dans des lieux publics.
              </p>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>Responsabilité exclusive :</strong> Vous êtes seul responsable de vos annonces, de vos messages et de toute transaction conclue avec d'autres utilisateurs. Appyna décline toute responsabilité en cas de litige, arnaque, vol, agression ou tout autre dommage résultant d'une transaction entre utilisateurs.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Respect des lois :</strong> Vous vous engagez à respecter l'ensemble des lois et règlements applicables en Israël, notamment en matière de commerce, de protection des consommateurs et de respect de la vie privée.
            </p>
            <p className="text-gray-700">
              <strong>Interdiction d'usurpation d'identité :</strong> Il est strictement interdit de se faire passer pour une autre personne, une entreprise ou une entité. L'usurpation d'identité entraînera le bannissement immédiat et pourra donner lieu à des poursuites judiciaires.
            </p>
          </section>

          {/* Article 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 6 - Modération et signalement</h2>
            <p className="text-gray-700 mb-3">
              <strong>Droit de modération :</strong> Appyna se réserve le droit, sans préavis ni justification, de supprimer ou masquer toute annonce, message ou contenu qui contreviendrait aux présentes CGU ou qui serait jugé inapproprié.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Bannissement :</strong> En cas de violation grave ou répétée des CGU, Appyna peut suspendre ou supprimer définitivement votre compte, sans possibilité de recours ni remboursement.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Système de signalement :</strong> Tout utilisateur peut signaler une annonce ou un utilisateur suspect via le bouton "Signaler". Les signalements sont traités manuellement par notre équipe de modération.
            </p>
            <p className="text-gray-700">
              <strong>Délai de traitement :</strong> Nous nous engageons à traiter les signalements dans un délai maximum de 72 heures. Toutefois, ce délai n'est donné qu'à titre indicatif et ne constitue pas une obligation contractuelle.
            </p>
          </section>

          {/* Article 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 7 - Service de boost payant</h2>
            <p className="text-gray-700 mb-3">
              <strong>Description du service :</strong> Appyna propose un service optionnel de "boost" permettant de mettre en avant votre annonce en haut des résultats de recherche pendant une durée déterminée (1, 3 ou 7 jours).
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Tarifs :</strong> Les tarifs des boosts sont les suivants (en Shekels israéliens) :
            </p>
            <ul className="list-disc ml-5 text-gray-700 mb-3 space-y-1">
              <li>Boost 1 jour : 9,90 ₪</li>
              <li>Boost 3 jours : 24,90 ₪</li>
              <li>Boost 7 jours : 39,90 ₪</li>
            </ul>
            <p className="text-gray-700 mb-3">
              <strong>Paiement :</strong> Le paiement s'effectue via la plateforme Stripe. Les moyens de paiement acceptés sont les cartes bancaires (Visa, Mastercard, American Express).
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-3">
              <p className="font-bold text-red-800 mb-1">❌ AUCUN REMBOURSEMENT</p>
              <p className="text-red-700 text-sm">
                Les boosts sont <strong>strictement non remboursables</strong>, même en cas de bug technique, de suppression de l'annonce ou de bannissement du compte. En cas de dysfonctionnement grave et avéré de notre service, Appyna pourra, à sa seule discrétion, offrir un crédit pour un futur boost, mais aucun remboursement en argent ne sera effectué.
              </p>
            </div>
            <p className="text-gray-700">
              <strong>Aucune garantie de résultat :</strong> Le boost ne garantit en aucun cas la vente de votre bien ou service. Il s'agit uniquement d'un service de mise en avant temporaire. Appyna ne peut être tenu responsable de l'absence de résultats commerciaux.
            </p>
          </section>

          {/* Article 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 8 - Messagerie</h2>
            <p className="text-gray-700 mb-3">
              <strong>Fonctionnalité :</strong> La Plateforme propose un système de messagerie privée permettant aux utilisateurs de communiquer entre eux directement sur Appyna.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Limite technique :</strong> Chaque message est limité à 5 000 caractères.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Interdictions :</strong> Il est strictement interdit d'utiliser la messagerie pour :
            </p>
            <ul className="list-disc ml-5 text-gray-700 mb-3 space-y-1">
              <li>Envoyer du spam ou des messages commerciaux non sollicités</li>
              <li>Tenir des propos insultants, diffamatoires, racistes ou discriminatoires</li>
              <li>Partager des contenus pornographiques, violents ou illégaux</li>
              <li>Harceler ou menacer d'autres utilisateurs</li>
            </ul>
            <p className="text-gray-700">
              <strong>Conservation :</strong> Les messages sont conservés pendant toute la durée de votre compte. En cas de suppression de votre compte, vos messages seront définitivement supprimés après un délai de 30 jours.
            </p>
          </section>

          {/* Article 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 9 - Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-3">
              <strong>Vos contenus :</strong> Vous conservez l'entière propriété des photos, textes et autres contenus que vous publiez sur la Plateforme.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Licence d'utilisation accordée à Appyna :</strong> En publiant un contenu sur Appyna, vous accordez à Appyna une licence mondiale, non exclusive, gratuite et transférable pour utiliser, reproduire, modifier, adapter, publier et afficher ce contenu dans le cadre de l'exploitation de la Plateforme et de sa promotion (réseaux sociaux, publicités, etc.).
            </p>
            <p className="text-gray-700">
              <strong>Retrait :</strong> Cette licence prend fin lorsque vous supprimez votre annonce ou votre compte. Toutefois, les contenus déjà partagés sur les réseaux sociaux ou dans des supports promotionnels peuvent rester visibles.
            </p>
          </section>

          {/* Article 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 10 - Données personnelles</h2>
            <p className="text-gray-700 mb-3">
              La collecte, le traitement et la protection de vos données personnelles sont régis par notre <a href="/privacy" className="text-primary-600 hover:underline font-semibold">Politique de Confidentialité</a>.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Données collectées :</strong> Lors de votre inscription, nous collectons les informations suivantes :
            </p>
            <ul className="list-disc ml-5 text-gray-700 mb-3 space-y-1">
              <li>Adresse email (obligatoire)</li>
              <li>Nom et prénom (obligatoire)</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Photo de profil (optionnelle)</li>
            </ul>
            <p className="text-gray-700">
              Pour plus d'informations sur vos droits et la gestion de vos données, consultez notre <a href="/privacy" className="text-primary-600 hover:underline font-semibold">Politique de Confidentialité</a>.
            </p>
          </section>

          {/* Article 11 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 11 - Limitation de responsabilité d'Appyna</h2>
            <div className="bg-gray-100 border-l-4 border-gray-500 p-4 mb-4">
              <p className="font-bold text-gray-900 mb-2">📋 CLAUSES DE NON-RESPONSABILITÉ</p>
              <p className="text-gray-800 text-sm">
                Appyna met en œuvre tous les moyens raisonnables pour assurer le bon fonctionnement de la Plateforme, mais ne peut garantir :
              </p>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>Disponibilité :</strong> Appyna ne garantit pas une disponibilité 24h/24 et 7j/7 de la Plateforme. Des interruptions peuvent survenir en raison de maintenances, mises à jour, pannes techniques ou problèmes indépendants de notre volonté.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Véracité des annonces :</strong> Appyna ne vérifie pas et ne garantit pas la véracité, l'exactitude ou la légalité des annonces publiées par les utilisateurs.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Transactions entre utilisateurs :</strong> Appyna n'est pas partie aux transactions conclues entre utilisateurs. En cas de litige, d'arnaque, de vol, de dommage ou de préjudice résultant d'une transaction, vous devez vous retourner directement contre l'utilisateur concerné. Appyna ne peut être tenu responsable.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Force majeure :</strong> Appyna ne pourra être tenu responsable en cas d'événements échappant à son contrôle raisonnable, tels que catastrophes naturelles, pannes de réseau, cyberattaques, décisions gouvernementales, grèves, guerres ou tout autre cas de force majeure.
            </p>
            <p className="text-gray-700">
              <strong>Limitation des dommages :</strong> Dans toute la mesure permise par la loi, la responsabilité d'Appyna envers vous, quelle qu'en soit la cause, sera limitée aux montants que vous avez payés à Appyna au cours des 12 derniers mois précédant l'événement donnant lieu à responsabilité.
            </p>
          </section>

          {/* Article 12 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 12 - Suspension et résiliation de compte</h2>
            <p className="text-gray-700 mb-3">
              <strong>Suspension temporaire :</strong> Appyna peut suspendre temporairement votre compte en cas de violation des CGU, de signalement par d'autres utilisateurs ou de comportement suspect. Pendant cette suspension, vous ne pourrez ni publier d'annonces ni envoyer de messages.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Bannissement définitif :</strong> En cas de violation grave ou répétée des CGU (contenus illégaux, arnaques, usurpation d'identité, harcèlement, etc.), Appyna peut supprimer définitivement votre compte sans préavis.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Aucun recours :</strong> Les décisions de suspension ou de bannissement sont définitives et sans appel. Aucune contestation ne sera prise en compte.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Suppression volontaire :</strong> Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. Cette action est irréversible.
            </p>
            <p className="text-gray-700">
              <strong>Conservation après suppression :</strong> Vos données seront conservées pendant 30 jours après la suppression de votre compte (sauvegarde de sécurité), puis définitivement supprimées. Les données fiscales (factures de boosts) seront conservées 7 ans conformément aux obligations légales.
            </p>
          </section>

          {/* Article 13 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 13 - Litiges et réclamations</h2>
            <p className="text-gray-700 mb-3">
              <strong>Contact :</strong> Pour toute réclamation ou question relative aux présentes CGU ou à l'utilisation de la Plateforme, vous pouvez nous contacter à l'adresse : <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a>.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Médiation :</strong> En cas de litige entre vous et Appyna, nous vous encourageons à rechercher une solution amiable avant toute action en justice.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Loi applicable :</strong> Les présentes CGU sont régies par le droit israélien.
            </p>
            <p className="text-gray-700">
              <strong>Tribunal compétent :</strong> En cas de litige n'ayant pu être résolu à l'amiable, les tribunaux de Jérusalem (Israël) seront seuls compétents.
            </p>
          </section>

          {/* Article 14 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 14 - Modification des CGU</h2>
            <p className="text-gray-700 mb-3">
              <strong>Droit de modification :</strong> Appyna se réserve le droit de modifier les présentes CGU à tout moment, afin de les adapter aux évolutions de la Plateforme, de la législation ou de nos pratiques commerciales.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Notification :</strong> Toute modification des CGU vous sera notifiée par email au moins 30 jours avant son entrée en vigueur.
            </p>
            <p className="text-gray-700">
              <strong>Acceptation tacite :</strong> Si vous continuez à utiliser la Plateforme après l'entrée en vigueur des nouvelles CGU, vous serez réputé avoir accepté ces modifications. Si vous n'acceptez pas les nouvelles CGU, vous devez cesser d'utiliser la Plateforme et supprimer votre compte.
            </p>
          </section>

          {/* Article 15 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Article 15 - Dispositions diverses</h2>
            <p className="text-gray-700 mb-3">
              <strong>Clause de divisibilité :</strong> Si une disposition des présentes CGU est jugée invalide, illégale ou inapplicable par un tribunal compétent, cette disposition sera réputée supprimée, mais les autres dispositions resteront pleinement en vigueur.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Intégralité de l'accord :</strong> Les présentes CGU constituent l'intégralité de l'accord entre vous et Appyna concernant l'utilisation de la Plateforme.
            </p>
            <p className="text-gray-700">
              <strong>Langue :</strong> Les présentes CGU sont rédigées en français. En cas de traduction dans une autre langue, seule la version française fera foi.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 mb-2">
              <strong>Appyna</strong>
            </p>
            <p className="text-gray-700 mb-2">
              Siège social : Jérusalem, Israël
            </p>
            <p className="text-gray-700 mb-2">
              Numéro d'immatriculation : En cours d'immatriculation
            </p>
            <p className="text-gray-700">
              Email : <a href="mailto:appyna.contact@gmail.com" className="text-primary-600 hover:underline">appyna.contact@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
