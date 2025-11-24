import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook pour compter les conversations avec messages NON LUS
 * Badge = nombre de conversations où le dernier message est reçu ET non encore vu
 * Synchronisé avec localStorage (lastSeen_)
 */
export const useMessagesBadge = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    const fetchCount = async () => {
      try {
        // Récupérer tous les lastSeen_ depuis localStorage
        const lastSeenData: { [key: string]: string } = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('lastSeen_')) {
            const convId = key.replace('lastSeen_', '');
            const messageId = localStorage.getItem(key);
            if (messageId) {
              lastSeenData[convId] = messageId;
            }
          }
        }

        const { data, error } = await supabase.rpc('count_conversations_with_received_messages', {
          p_user_id: user.id,
          p_last_seen_data: lastSeenData
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

    // Écouter les changements localStorage (quand MessagesPage marque comme lu)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('lastSeen_')) {
        // Un autre onglet ou la page a marqué une conversation comme lue
        fetchCount();
      }
    };

    // Écouter les changements localStorage dans le même onglet (custom event)
    const handleLocalUpdate = () => {
      fetchCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('messagesRead', handleLocalUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('messagesRead', handleLocalUpdate);
    };
  }, [user, forceRefresh]);

  return { count, hasBadge: count > 0 };
};
