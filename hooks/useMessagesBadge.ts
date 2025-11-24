import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook SIMPLE pour compter les conversations avec messages reçus
 * Badge = nombre de conversations où le dernier message est reçu (pas envoyé par moi)
 */
export const useMessagesBadge = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    const fetchCount = async () => {
      try {
        const { data, error } = await supabase.rpc('count_conversations_with_received_messages', {
          p_user_id: user.id
        });

        if (error) {
          console.error('Error counting conversations:', error);
          setCount(0);
          return;
        }

        setCount(data || 0);
      } catch (err) {
        console.error('Error in useMessagesBadge:', err);
        setCount(0);
      }
    };

    // Fetch initial
    fetchCount();

    // Refresh toutes les 30 secondes
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  return { count, hasBadge: count > 0 };
};
