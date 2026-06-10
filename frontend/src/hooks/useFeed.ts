import { useEffect, useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';
import type { UserCard } from '../types/index';

export const useFeed = () => {
  const [feedCards, setFeedCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [importedIds, setImportedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.getFeed()
      .then(setFeedCards)
      .catch((error) => console.error('Ошибка загрузки ленты:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleImport = async (cardId: number) => {
    const toastId = toast.loading('Копируем...');
    try {
      await api.importCard(cardId);
      setImportedIds((prev) => new Set([...prev, cardId]));
      toast.success('Добавлено в твой словарь!', { id: toastId });
      window.dispatchEvent(new Event('dictionaryUpdated'));
    } catch (error: unknown) { 
      console.error(error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Не удалось импортировать', { id: toastId });
    }
  };

  return {
    feedCards,
    loading,
    importedIds,
    handleImport
  };
};