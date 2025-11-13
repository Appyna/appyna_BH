-- Migration: Ajouter policies UPDATE/DELETE pour listings

-- Policy pour permettre aux users de modifier leurs propres annonces
CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux users de supprimer leurs propres annonces
CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);
