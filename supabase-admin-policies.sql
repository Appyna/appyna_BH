-- Policies pour permettre aux admins de modifier les listings et users

-- 1. Policy pour que les admins puissent UPDATE les listings (is_hidden)
CREATE POLICY "Admins can update listings"
  ON listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- 2. Policy pour que les admins puissent UPDATE les users (is_banned)
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.is_admin = TRUE
    )
  );

-- 3. Vérifier que les policies existantes ne bloquent pas les admins
-- Si nécessaire, modifier la policy "Users can update own listings" pour ne pas entrer en conflit
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );
