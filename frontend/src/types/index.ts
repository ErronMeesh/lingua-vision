export interface User {
  id: number;
  email: string;
  nickname: string;
  avatarUrl?: string;
}

export interface BaseCard {
  id: number;
  imageUrl: string;
  detectedObjects: Record<string, unknown>;
}

export interface UserCard {
  id: number;
  customWord: string;
  customTranslation: string;
  isPublic: boolean;
  isImported: boolean;
  baseCard: BaseCard;
  user?: User;
  progress?: {
    interval: number;
    repetition: number;
    ef: number;
    nextReviewDate: string;
  };
}

export interface QuizData {
  type: string;
  word: string;
  translation: string;
  imageUrl: string;
  isMatch: boolean;
}

export interface DetectedObject {
  label_en: string;
  label_ru: string;
  box: [number, number, number, number];
}

export interface AIResponse {
  imageUrl: string;
  objects: DetectedObject[];
}