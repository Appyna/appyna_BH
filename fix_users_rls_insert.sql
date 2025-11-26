-- ====================================
-- FIX CRITIQUE: Politique RLS pour inscription
-- Problème: auth.uid() pas disponible immédiatement après signUp
-- Solution: Fonction SECURITY DEFINER pour bypasser RLS
-- ====================================

-- 1. Supprimer l'ancienne politique INSERT restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON public.users;

-- 2. Créer une fonction SECURITY DEFINER pour créer le profil
-- Cette fonction s'exécute avec les privilèges du propriétaire (bypass RLS)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id uuid,
  user_email text,
  user_name text,
  user_bio text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, bio)
  VALUES (user_id, user_email, user_name, user_bio);
END;
$$;

-- 3. Donner les permissions d'exécution à tous les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- 4. Créer une politique INSERT minimale (backup si jamais on appelle directement)
CREATE POLICY "Allow authenticated users to insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. Vérifier que tout est en place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
