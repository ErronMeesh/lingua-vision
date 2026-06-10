export type MasteryLevel = {
  stars: number;
  label: string;
};

export const calculateMastery = (intervalDays: number): MasteryLevel => {
  if (intervalDays === 0) return { stars: 0, label: "Знакомство" };
  if (intervalDays <= 1)  return { stars: 1, label: "Краткосрочная память" };
  if (intervalDays <= 3)  return { stars: 2, label: "Этап закрепления" };
  if (intervalDays <= 7)  return { stars: 3, label: "Переходная память" };
  if (intervalDays <= 14) return { stars: 4, label: "Долгосрочная память" };
  
  return { stars: 5, label: "Впечатано в мозг" };
};