import { useState, useEffect } from 'react';
import { useAuth } from '@/template';
import { fetchConversations, sendMessage } from '../services/readitService';
import { DirectMessage } from '../types/readit';

export function useMessages(recipientId?: string) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    const messages = await fetchConversations(user.id);
    setConversations(messages);
    setLoading(false);
  };

  const send = async (content: string) => {
    if (!user || !recipientId) return { error: 'Missing user or recipient' };

    setSending(true);
    const { data, error } = await sendMessage(user.id, recipientId, content);
    setSending(false);

    if (!error && data) {
      setConversations([data, ...conversations]);
    }

    return { data, error };
  };

  return {
    conversations,
    loading,
    sending,
    send,
    refresh: loadConversations,
  };
}
