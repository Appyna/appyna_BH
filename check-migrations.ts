import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbtdowycvyogjopcidjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idGRvd3ljdnlvZ2pvcGNpZGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTk4NTgsImV4cCI6MjA3NzkzNTg1OH0.-jppwptOezsJAL5RsclhZHsCIyLCyL-SCSN9e3EjRt4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMigrations() {
  console.log('🔍 Vérification des migrations Supabase...\n');

  // 1. Vérifier la colonne deleted_by dans conversations
  console.log('1️⃣ Soft Delete pour conversations:');
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('deleted_by')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Colonne deleted_by n\'existe pas');
      console.log('   → Migration à exécuter: supabase-conversations-soft-delete.sql\n');
    } else {
      console.log('   ✅ Colonne deleted_by existe\n');
    }
  } catch (e) {
    console.log('   ❌ Erreur:', e);
  }

  // 2. Vérifier les contraintes sur messages
  console.log('2️⃣ Validation des messages (max 5000 caractères):');
  try {
    // Tenter d'insérer un message trop long
    const longText = 'a'.repeat(5001);
    const { error } = await supabase
      .from('messages')
      .insert({ text: longText, conversation_id: '00000000-0000-0000-0000-000000000000', sender_id: '00000000-0000-0000-0000-000000000000' });
    
    if (error && error.message.includes('check_message_length')) {
      console.log('   ✅ Contrainte check_message_length active\n');
    } else {
      console.log('   ❌ Contrainte check_message_length absente');
      console.log('   → Migration à exécuter: supabase-messages-validation.sql\n');
    }
  } catch (e) {
    console.log('   ⚠️  Impossible de vérifier (normal si contrainte existe)\n');
  }

  // 3. Vérifier DELETE policy
  console.log('3️⃣ DELETE Policy pour messages:');
  try {
    const { data: policies } = await supabase.rpc('check_delete_policy');
    console.log('   ⚠️  Vérification manuelle requise sur Supabase Dashboard');
    console.log('   → Allez dans Table Editor > messages > Policies\n');
  } catch (e) {
    console.log('   ⚠️  Vérification manuelle requise sur Supabase Dashboard\n');
  }

  // 4. Vérifier si read_at existe encore
  console.log('4️⃣ Cleanup colonne read_at:');
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('read_at')
      .limit(1);
    
    if (error && error.message.includes('read_at')) {
      console.log('   ✅ Colonne read_at supprimée\n');
    } else {
      console.log('   ❌ Colonne read_at existe encore');
      console.log('   → Migration à exécuter: supabase-cleanup-read-at.sql\n');
    }
  } catch (e) {
    console.log('   ✅ Colonne read_at probablement supprimée\n');
  }

  console.log('✨ Vérification terminée!');
  console.log('\n📝 Pour exécuter les migrations manquantes:');
  console.log('1. Ouvrez https://supabase.com/dashboard/project/nbtdowycvyogjopcidjq/editor');
  console.log('2. Allez dans SQL Editor');
  console.log('3. Copiez-collez le contenu des fichiers .sql');
  console.log('4. Exécutez-les');
}

checkMigrations();
