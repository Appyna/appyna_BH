-- ============================================
-- SCRIPT DE NETTOYAGE BASE DE DONNÉES
-- Supprime TOUTES les données SAUF le compte admin
-- Date: 3 décembre 2025
-- ============================================

-- ÉTAPE 1: Identifier l'admin (email: projet.lgsz@gmail.com)
-- Récupérer l'ID admin avant suppression (à noter manuellement)

-- ÉTAPE 2: Supprimer les messages
DELETE FROM messages
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE user1_id NOT IN (
    SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
  )
  OR user2_id NOT IN (
    SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
  )
);

-- ÉTAPE 3: Supprimer les conversations
DELETE FROM conversations
WHERE user1_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
)
OR user2_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 4: Supprimer les favoris
DELETE FROM favorites
WHERE user_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 5: Supprimer les rapports utilisateurs
DELETE FROM user_reports
WHERE reporter_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
)
OR reported_user_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 6: Supprimer les rapports d'annonces
DELETE FROM reports
WHERE reporter_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 7: Supprimer les paiements Stripe
DELETE FROM stripe_payments
WHERE user_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 8: Supprimer les annonces
DELETE FROM listings
WHERE user_id NOT IN (
  SELECT id FROM users WHERE email = 'projet.lgsz@gmail.com'
);

-- ÉTAPE 9: Supprimer les utilisateurs (SAUF ADMIN)
DELETE FROM users
WHERE email != 'projet.lgsz@gmail.com';

-- ============================================
-- VÉRIFICATIONS POST-NETTOYAGE
-- ============================================

-- Compter les utilisateurs restants (devrait être 1 = admin)
SELECT COUNT(*) as remaining_users FROM users;

-- Compter les annonces restantes (devrait être 0 ou celles de l'admin)
SELECT COUNT(*) as remaining_listings FROM listings;

-- Compter les conversations restantes (devrait être 0)
SELECT COUNT(*) as remaining_conversations FROM conversations;

-- Compter les messages restants (devrait être 0)
SELECT COUNT(*) as remaining_messages FROM messages;

-- Compter les favoris restants (devrait être 0)
SELECT COUNT(*) as remaining_favorites FROM favorites;

-- Afficher l'utilisateur admin restant
SELECT id, email, name, created_at FROM users;
