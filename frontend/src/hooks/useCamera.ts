import { useState, useCallback } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';
import type { AIResponse, DetectedObject } from '../types/index';

export const useCamera = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);
    setSavedWords(new Set());

    try {
      const data = await api.analyzeImage(file);
      setResult(data);
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      toast.error('Не удалось распознать изображение');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgDimensions({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  }, []);

  const handleSaveCard = async (obj: DetectedObject) => {
    if (savedWords.has(obj.label_en)) return;

    const toastId = toast.loading('Сохраняем...');
    try {
      const response = await api.saveCard({
        imageUrl: result?.imageUrl || '', 
        wordEn: obj.label_en,
        wordRu: obj.label_ru,
        rawData: obj as unknown as Record<string, unknown>,
        isPublic: isPublic
      });
      
      setSavedWords(prev => new Set(prev).add(obj.label_en));
      toast.success(response.message, { id: toastId });
      window.dispatchEvent(new Event('dictionaryUpdated'));
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при сохранении', { id: toastId });
    }
  };

  const handleReset = useCallback(() => {
    setResult(null);
    setPreview(null);
    setSavedWords(new Set());
  }, []);

  return {
    loading,
    result,
    preview,
    isPublic,
    imgDimensions,
    savedWords,
    setIsPublic,
    handleFileChange,
    handleImageLoad,
    handleSaveCard,
    handleReset,
  };
};