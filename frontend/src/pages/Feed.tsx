import { useState } from 'react';
import { useFeed } from '../hooks/useFeed';
import { Search, Download, CheckCircle2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export const Feed = () => {
  const { feedCards, loading, importedIds, handleImport } = useFeed();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = feedCards.filter(card => 
    card.customWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.customTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (card.user?.nickname && card.user.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-[50vh]">
        <p className="animate-pulse text-xl font-medium text-white/50 tracking-widest uppercase">
          ⏳ Загрузка ленты...
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto min-h-[85vh] flex flex-col gap-8 mt-4">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase m-0">
            GLOBAL FEED
          </h2>
          <p className="text-white/40 text-sm tracking-wide mt-1">Слова, которыми поделились другие пользователи.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search feed..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full dark-matte-glass border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        </div>
      </div>

      {feedCards.length === 0 ? (
        <div className="dark-matte-glass border border-dashed border-white/20 rounded-[32px] p-12 text-center mt-10">
          <p className="text-white/50 text-lg font-serif tracking-widest uppercase">
            В ленте пока пусто. Стань первым, кто опубликует слово в Камере!
          </p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-white/40 text-lg tracking-wide">По запросу «{searchQuery}» ничего не найдено.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => {
            const isImported = importedIds.has(card.id);

            return (
              <div 
                key={card.id} 
                className="dark-matte-glass border border-white/5 rounded-[32px] overflow-hidden flex flex-col relative group transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
              >
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {card.user?.avatarUrl ? (
                    <img 
                      src={`${BACKEND_URL}${card.user.avatarUrl}`}
                      alt="avatar" 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-[10px]">
                      👤
                    </div>
                  )}
                  <span className="text-white/80 text-xs font-bold tracking-wide truncate max-w-[80px]" title={card.user?.nickname || card.user?.email}>
                    {card.user?.nickname || card.user?.email?.split('@')[0]}
                  </span>
                </div>

                <button 
                  onClick={() => handleImport(card.id)}
                  disabled={isImported}
                  className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    isImported 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default' 
                      : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/20 hover:text-white hover:border-white/40'
                  }`}
                  title={isImported ? "Уже в словаре" : "Забрать в свой словарь"}
                >
                  {isImported ? <CheckCircle2 size={20} /> : <Download size={18} />}
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
                  <div className="text-center mb-2">
                    <h3 className="text-2xl font-serif text-white tracking-widest uppercase m-0 drop-shadow-md">
                      {card.customWord}
                    </h3>
                    <p className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase mt-2">
                      {card.customTranslation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};