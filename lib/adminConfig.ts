// Configuration du compte admin Appyna®
export const ADMIN_EMAIL = 'projet.lgsz@gmail.com';
export const ADMIN_DISPLAY_NAME = 'Appyna®';

// Cette fonction récupère l'ID du compte admin
export async function getAdminUserId() {
  const { supabase } = await import('./supabaseClient');
  
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', ADMIN_EMAIL)
    .single();

  if (error || !data) {
    console.error('Admin user not found:', error);
    return null;
  }

  return data.id;
}
