import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import type { UserCard } from '../types/index';

export const useDictionary = () => {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = await api.getDictionary();
      setCards(data);
    } catch (error) {
      console.error(error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();

    const handleDictionaryUpdate = () => {
      loadCards(true);
    };

    window.addEventListener('dictionaryUpdated', handleDictionaryUpdate);

    return () => {
      window.removeEventListener('dictionaryUpdated', handleDictionaryUpdate);
    };
  }, [loadCards]);

  const removeCard = async (cardId: number) => {
    await api.deleteCard(cardId);
    setCards((prevCards) => prevCards.filter(card => card.id !== cardId));
  };

  return { cards, loading, removeCard };
};