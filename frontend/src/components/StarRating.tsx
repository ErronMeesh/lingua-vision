import { Star } from 'lucide-react';
import { calculateMastery } from '../utils/srsMetrics';

export const StarRating = ({ interval = 0 }: { interval?: number }) => {

  const { stars, label } = calculateMastery(interval);

  return (
    <div className="flex gap-1.5 cursor-help" title={`Интервал: ${interval} дн. (${label})`}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <Star
          key={starIndex}
          size={14}
          strokeWidth={2.5}
          className={
            starIndex <= stars
              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] transition-all duration-500" 
              : "fill-white/5 text-white/10 transition-all duration-500" 
          }
        />
      ))}
    </div>
  );
};