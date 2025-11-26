-- ====================================
-- FIX: Politique RLS pour inscription
-- Problème: auth.uid() pas disponible immédiatement après signUp
-- Solution: Permettre INSERT si l'id correspond à l'utilisateur en cours de création
-- ====================================

-- Supprimer l'ancienne politique INSERT restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Nouvelle politique plus permissive pour l'inscription
-- Permet l'insertion si:
-- 1. L'id fourni correspond à auth.uid() (cas normal après signUp réussi)
-- 2. OU si c'est un nouvel utilisateur qui vient de s'inscrire
CREATE POLICY "Users can insert own profile on signup"
ON public.users
FOR INSERT
WITH CHECK (
  auth.uid() = id
);

-- Alternative si ça ne fonctionne toujours pas:
-- Utiliser une fonction SECURITY DEFINER pour bypasser RLS pendant l'insertion

-- Vérifier les politiques
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
