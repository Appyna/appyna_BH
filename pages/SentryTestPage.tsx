import React from 'react';
import * as Sentry from '@sentry/react';
import { BackButton } from '../components/BackButton';

export const SentryTestPage: React.FC = () => {
  
  const testError = () => {
    throw new Error('🧪 Test Sentry : Cette erreur a été déclenchée volontairement pour tester la configuration de Sentry');
  };

  const testCaptureException = () => {
    try {
      throw new Error('🧪 Test capture manuelle : Exception capturée manuellement');
    } catch (error) {
      Sentry.captureException(error);
      alert('Erreur capturée manuellement et envoyée à Sentry !');
    }
  };

  const testCaptureMessage = () => {
    Sentry.captureMessage('🧪 Test message : Message de test envoyé à Sentry', 'info');
    alert('Message envoyé à Sentry !');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Sentry</h1>
          <p className="text-gray-600 mb-6">
            Cette page permet de tester l'intégration Sentry. Après avoir cliqué sur un bouton, vérifiez votre dashboard Sentry pour voir l'erreur capturée.
          </p>

          <div className="space-y-4">
            {/* Test 1 : Erreur non capturée */}
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Test 1 : Erreur non capturée (throw error)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Déclenche une erreur JavaScript qui crashe le composant. Sentry devrait capturer automatiquement cette erreur.
              </p>
              <button
                onClick={testError}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Déclencher une erreur
              </button>
            </div>

            {/* Test 2 : Capture manuelle */}
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Test 2 : Capture manuelle (captureException)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Capture une exception manuellement avec Sentry.captureException(). L'application ne crash pas.
              </p>
              <button
                onClick={testCaptureException}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Capturer une exception
              </button>
            </div>

            {/* Test 3 : Message */}
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Test 3 : Message simple (captureMessage)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Envoie un message simple à Sentry pour vérifier la connexion.
              </p>
              <button
                onClick={testCaptureMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Envoyer un message
              </button>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-900 font-semibold mb-1">⚠️ Page de test uniquement</p>
            <p className="text-yellow-800 text-sm">
              Cette page est accessible seulement en développement ou pour l'admin. Elle sera supprimée avant le lancement en production.
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-blue-900 font-semibold mb-2">📊 Vérifier les erreurs sur Sentry :</p>
            <ol className="text-blue-800 text-sm space-y-1 list-decimal ml-4">
              <li>Allez sur <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="underline">sentry.io</a></li>
              <li>Connectez-vous à votre compte</li>
              <li>Sélectionnez le projet "appyna"</li>
              <li>Allez dans "Issues" pour voir les erreurs capturées</li>
              <li>Vous devriez voir les erreurs de test avec le préfixe 🧪</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
