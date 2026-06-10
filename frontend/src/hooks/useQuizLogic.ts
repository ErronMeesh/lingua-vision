import { useState, useCallback, useEffect } from 'react';
import { getEditDistance } from '../utils/stringUtils';
import type { UserCard } from '../types/index';

export type QuizMode = 'fast' | 'deep';
export type ExerciseType = 'binary' | 'spelling' | '4d';

export interface QuizData {
  type: ExerciseType;
  word: string;
  translation: string;
  imageUrl: string;
  isMatch: boolean;
}

export const useQuizLogic = (cards: UserCard[], mode: QuizMode) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  useEffect(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return;
    const currentCard = cards[currentIndex];

    let type: ExerciseType = 'binary';
    if (mode === 'deep') {
      const types: ExerciseType[] = ['binary', 'spelling', '4d'];
      type = types[Math.floor(Math.random() * types.length)];
    }

    if (type === 'binary') {
      const shouldBeFake = Math.random() > 0.5 && cards.length > 1;
      if (shouldBeFake) {
        let randomIndex = Math.floor(Math.random() * cards.length);
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * cards.length);
        }
        const fakeCard = cards[randomIndex];
        setQuizData({ type, word: currentCard.customWord, translation: currentCard.customTranslation, imageUrl: fakeCard.baseCard?.imageUrl || '', isMatch: false });
      } else {
        setQuizData({ type, word: currentCard.customWord, translation: currentCard.customTranslation, imageUrl: currentCard.baseCard?.imageUrl || '', isMatch: true });
      }
    } else {
      setQuizData({ type, word: currentCard.customWord, translation: currentCard.customTranslation, imageUrl: currentCard.baseCard?.imageUrl || '', isMatch: true });
    }
  }, [currentIndex, cards, mode]);

  const processBinaryAnswer = useCallback((swipedRight: boolean) => {
    if (!quizData) return { isCorrect: false, quality: 0 };
    const isCorrect = (swipedRight && quizData.isMatch) || (!swipedRight && !quizData.isMatch);
    return { isCorrect, quality: isCorrect ? 4 : 0 };
  }, [quizData]);

  const process4DAnswer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    let q = 0;
    if (direction === 'up') q = 5; 
    if (direction === 'right') q = 4; 
    if (direction === 'down') q = 3; 
    if (direction === 'left') q = 0; 
    return { isCorrect: q > 0, quality: q };
  }, []);

  const processSpellingAnswer = useCallback((input: string) => {
    if (!quizData) return { isCorrect: false, quality: 0, distance: 0 };
    const target = quizData.word.toLowerCase().trim();
    const typed = input.toLowerCase().trim();
    const dist = getEditDistance(target, typed);

    let q = 0;
    if (dist === 0) q = 5; 
    else if (dist === 1) q = 3; 


    return { isCorrect: q > 0, quality: q, distance: dist, targetWord: quizData.word };
  }, [quizData]);

  const nextCard = useCallback(() => setCurrentIndex(prev => prev + 1), []);

  return {
    currentCard: cards[currentIndex], 
    quizData, 
    isFinished: currentIndex >= cards.length && cards.length > 0,
    processBinaryAnswer, 
    process4DAnswer, 
    processSpellingAnswer, 
    nextCard, 
    currentIndex, 
    total: cards.length
  };
};