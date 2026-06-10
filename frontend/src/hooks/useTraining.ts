import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useQuizLogic, type QuizMode } from './useQuizLogic';
import type { UserCard } from '../types/index';

export type SwipedCard = {
  id: number;
  word: string;
  imageUrl: string;
  direction: 'left' | 'right';
};

export const useTraining = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as QuizMode) || 'fast';

  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<SwipedCard[]>([]);
  const [spellingInput, setSpellingInput] = useState('');
  const [needsMoreCardsPrompt, setNeedsMoreCardsPrompt] = useState(false);

  const { 
    currentCard, quizData, isFinished, processBinaryAnswer, 
    process4DAnswer, processSpellingAnswer, nextCard, currentIndex, total 
  } = useQuizLogic(cards, mode);

  useEffect(() => {
    api.getCardsToReview()
      .then(data => {
        if (data.length === 0) {
          setNeedsMoreCardsPrompt(true);
        } else {
          setCards(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (isFinished && cards.length > 0) {
      toast.success('Тренировка завершена! 🎉', { 
        duration: 4000,
        style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      navigate('/');
    }
  }, [isFinished, navigate, cards.length]);

  const startExtraPractice = async () => {
    setLoading(true);
    setNeedsMoreCardsPrompt(false);
    try {
      const allCards = await api.getDictionary();
      if (allCards.length === 0) {
        toast.error('Ваш словарь пока пуст!', { 
          style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
        });
        navigate('/');
      } else {
        setCards(allCards.sort(() => 0.5 - Math.random()));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveAndNext = async (quality: number, direction: 'left' | 'right') => {
    if (quizData && currentCard) {
      setHistory(prev => [...prev, {
        id: currentCard.id,
        word: quizData.word,
        imageUrl: quizData.imageUrl,
        direction
      }]);

      try { 
        await api.reviewCard(currentCard.id, quality); 
      } catch (e) { 
        console.error(e); 
      }
    }
    
    setSpellingInput('');
    nextCard();
  };

  return {
    mode, loading, spellingInput, setSpellingInput,
    quizData, currentCard, currentIndex, total, isFinished,
    history, cards, needsMoreCardsPrompt, startExtraPractice,
    processBinaryAnswer, process4DAnswer, processSpellingAnswer, saveAndNext
  };
};