import { useEffect, useState } from 'react';
import { api } from '../api';
import type { UserCard } from '../types/index';

export const useDashboard = () => {
  const [cardsToReview, setCardsToReview] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCardsToReview()
      .then(setCardsToReview)
      .catch((error) => {
        console.error('Ошибка при загрузке карточек:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    cardsToReview,
    loading
  };
};