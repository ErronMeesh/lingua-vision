import { useState } from 'react';
import { useDictionary } from '../hooks/useDictionary';
import { StarRating } from '../components/StarRating';
import { Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export const Dictionary = () => {
  const { cards, loading, removeCard } = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCards = cards.filter(card => 
    card.customWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.customTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (cardId: number) => {
    toast((t) => (
      <div className="text-center">
        <p className="m-0 mb-5 font-serif text-lg tracking-wide text-white">Точно удалить это слово?</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Удаляем...', {
                style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
              });
              try {
                await removeCard(cardId); 
                toast.success('Слово удалено', { id: loadingToast });
              } catch (error) {
                console.error('Ошибка при удалении:', error);
                toast.error('Не удалось удалить карточку', { id: loadingToast });
              }
            }}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-5 py-2 rounded-xl font-bold tracking-wide transition-colors"
          >
            Удалить
          </button>
          
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-5 py-2 rounded-xl font-bold tracking-wide transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity,
      style: { 
        minWidth: '320px',
        background: 'rgba(20, 20, 28, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff'
      }
    });
  };

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-[50vh]">
        <p className="animate-pulse text-xl font-medium text-white/50 tracking-widest uppercase">
          ⏳ Загрузка словаря...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto min-h-[85vh] flex flex-col gap-8 mt-4">

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase m-0">
          MY DICTIONARY
        </h2>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search your words..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full dark-matte-glass border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        </div>
      </div>
      
      {cards.length === 0 ? (
        <div className="dark-matte-glass border border-dashed border-white/20 rounded-[32px] p-12 text-center mt-10">
          <p className="text-white/50 text-lg font-serif tracking-widest uppercase">
            Словарь пока пуст. Зайди в Камеру и добавь новые слова!
          </p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-white/40 text-lg tracking-wide">По запросу «{searchQuery}» ничего не найдено.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div 
              key={card.id} 
              className="dark-matte-glass border border-white/5 rounded-[32px] overflow-hidden flex flex-col relative group transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
            >
              <button 
                onClick={() => handleDeleteClick(card.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                title="Удалить слово"
              >
                <Trash2 size={18} />
              </button>

              <div className="w-full h-48 bg-white/5 relative">
                {card.baseCard?.imageUrl ? (
                  <img 
                    src={`${BACKEND_URL}${card.baseCard.imageUrl}`} 
                    alt={card.customWord} 
                    className="w-full h-full object-cover opacity-80" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 text-3xl">📷</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] to-transparent opacity-80"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between relative -mt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif text-white tracking-widest uppercase m-0 drop-shadow-md">
                    {card.customWord}
                  </h3>
                  <p className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase mt-2">
                    {card.customTranslation}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {card.progress && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] text-white/30 tracking-widest uppercase font-bold">
                        <span>Streak: {card.progress.repetition}</span>
                        <span>{new Date(card.progress.nextReviewDate).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400/60 rounded-full" 
                          style={{ width: `${Math.min((card.progress?.interval || 0) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Mastery Level</span>
                      <span className="text-[8px] text-white/20 uppercase tracking-widest mt-0.5">Spaced Repetition</span>
                    </div>
                    <StarRating interval={card.progress?.interval || 0} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};