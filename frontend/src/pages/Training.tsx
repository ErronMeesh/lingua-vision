import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, type PanInfo } from 'framer-motion';
import { Check, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTraining } from '../hooks/useTraining';

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;

  const base = "https://api.erronmeeshproject.nomorepartiessite.ru";
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${base}${cleanUrl}`;
};

export const Training = () => {
  const {
    loading, spellingInput, setSpellingInput,
    quizData, currentCard, currentIndex, total, isFinished,
    history, cards, needsMoreCardsPrompt, startExtraPractice,
    saveAndNext, processSpellingAnswer, process4DAnswer
  } = useTraining();

  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ x: 0, y: 0, rotate: 0, opacity: 1, borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", backgroundColor: "rgba(20, 20, 28, 0.3)" });
  }, [currentIndex, controls]);

  if (loading || (!quizData && !needsMoreCardsPrompt)) {
    return (
      <div className="p-5 flex justify-center items-center h-[50vh]">
        <p className="animate-pulse text-xl font-medium text-white/50 tracking-widest uppercase">⏳ Готовим стопку...</p>
      </div>
    );
  }

  if (needsMoreCardsPrompt) {
    return (
      <div className="p-5 flex flex-col justify-center items-center h-[70vh] text-center relative z-20">
        <div className="dark-matte-glass p-10 rounded-[40px] border border-white/10 shadow-2xl max-w-md w-full flex flex-col items-center">
          <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🎉</div>
          <h2 className="m-0 mb-3 font-serif text-2xl tracking-widest uppercase text-white">
            Excellent work!
          </h2>
          <p className="m-0 mb-8 text-sm text-white/50 tracking-wide leading-relaxed">
            All the words scheduled for today have been learned. Would you like to review the entire vocabulary outside the algorithm for extra practice?
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={startExtraPractice}
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-5 py-4 rounded-2xl font-bold tracking-[0.1em] uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Continue the lesson
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 px-5 py-4 rounded-2xl font-bold tracking-[0.1em] uppercase transition-all"
            >
              Return to main page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) return null;
  if (!quizData || !currentCard) return null;

  const triggerBinary = async (isRight: boolean) => {
    const userThinksCorrect = isRight; 
    const isActuallyCorrect = quizData.isMatch; 

    if (userThinksCorrect !== isActuallyCorrect) {
      controls.set({ 
        borderColor: "rgba(239, 68, 68, 0.6)", 
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)", 
        backgroundColor: "rgba(239, 68, 68, 0.05)" 
      });

      await controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 500, damping: 25 } });
      await controls.start({ x: [-15, 15, -15, 15, 0], transition: { duration: 0.4 } });
      const correctDirX = isActuallyCorrect ? 600 : -600;
      await controls.start({ x: correctDirX, opacity: 0, rotate: isActuallyCorrect ? 20 : -20, transition: { duration: 0.4 } });
      
      saveAndNext(0, isActuallyCorrect ? 'right' : 'left'); 
    } else {
      await controls.start({ x: isRight ? 600 : -600, opacity: 0, rotate: isRight ? 20 : -20, transition: { duration: 0.3 } });
      saveAndNext(4, isRight ? 'right' : 'left'); 
    }
  };

  const trigger4D = async (direction: 'up' | 'down' | 'left' | 'right') => {
    const { quality } = process4DAnswer(direction);
    
    let targetX = 0;
    let targetY = 0;
    if (direction === 'left') targetX = -600;
    if (direction === 'right') targetX = 600;
    if (direction === 'up') targetY = -600;
    if (direction === 'down') targetY = 600;

    await controls.start({ x: targetX, y: targetY, opacity: 0, transition: { duration: 0.3 } });
    saveAndNext(quality, direction === 'right' || direction === 'up' ? 'right' : 'left');
  };

  const handleDragEnd = async (_event: unknown, info: PanInfo) => {
    if (quizData.type === 'spelling') return;
    
    const { x, y } = info.offset;
    const threshold = 100;

    if (quizData.type === 'binary') {
      if (x > threshold) triggerBinary(true);
      else if (x < -threshold) triggerBinary(false);
      else controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    } 
    else if (quizData.type === '4d') {
      if (Math.abs(x) > Math.abs(y)) {
        if (x > threshold) trigger4D('right');
        else if (x < -threshold) trigger4D('left');
        else controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      } else {
        if (y < -threshold) trigger4D('up'); 
        else if (y > threshold) trigger4D('down'); 
        else controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      }
    }
  };

  const handleSpellingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isCorrect, quality, distance, targetWord } = processSpellingAnswer(spellingInput);
    
    if (isCorrect) {
      if (distance === 1) {
        toast(`Опечатка! Правильно: ${targetWord}`, { 
          icon: '👀', 
          duration: 7000, 
          style: { 
            background: 'rgba(30, 20, 22, 0.85)', 
            color: '#fff', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)', 
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)'
          }
        });
      }
      
      await controls.start({ x: 600, opacity: 0, rotate: 20, transition: { duration: 0.4 } });
      saveAndNext(quality, 'right');
    } else {
      controls.set({ 
        borderColor: "rgba(239, 68, 68, 0.6)", 
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)", 
        backgroundColor: "rgba(239, 68, 68, 0.05)" 
      });

      await controls.start({ x: [-15, 15, -15, 15, 0], transition: { duration: 0.4 } }); 
      await controls.start({ x: -600, opacity: 0, rotate: -20, transition: { duration: 0.4 } }); 
      saveAndNext(quality, 'left');
    }
  };

  const upcomingCards = cards.slice(currentIndex, currentIndex + 3); 
  const leftStack = history.filter(c => c.direction === 'left').slice(-2); 
  const rightStack = history.filter(c => c.direction === 'right').slice(-2); 

  return (
    <div className="p-5 flex flex-col relative overflow-hidden min-h-[85vh] max-w-7xl mx-auto w-full justify-center">
      
      <div className="flex flex-col items-center mb-8 w-full max-w-xs mx-auto relative z-20">
        <div className="w-full bg-white/10 h-1.5 rounded-full mb-3 overflow-hidden">
          <div className="h-full bg-white/80 transition-all duration-300" style={{ width: `${(currentIndex / total) * 100}%` }} />
        </div>
        <div className="text-gray-400 text-sm font-medium tracking-widest uppercase">
          Card {currentIndex + 1} / {total}
        </div>
      </div>

      <div className="flex-1 relative flex justify-center items-center w-full min-h-[500px]">
        
        {leftStack.map((card, i, arr) => {
          const depth = arr.length - 1 - i; 
          return (
            <motion.div
              key={`left-${card.id}-${i}`}
              initial={{ opacity: 0, x: 0, scale: 0.8 }}
              animate={{ opacity: depth === 0 ? 0.6 : 0.2, x: -280 - (depth * 220), y: 0, scale: 0.85 - (depth * 0.12), filter: `blur(${4 + depth * 6}px)` }}
              style={{ zIndex: 10 - depth }}
              className="absolute dark-matte-glass rounded-[32px] p-5 w-[310px] h-[420px] flex flex-col items-center justify-between hidden xl:flex pointer-events-none border border-white/5"
            >
              <div className="w-full flex-1 relative mb-4">
                {card.imageUrl && <img src={getImageUrl(card.imageUrl)} className="w-full h-full object-cover rounded-2xl opacity-60" alt="Left Context" />}
              </div>
              <h2 className="text-3xl font-serif text-white/40 tracking-wide m-0 uppercase">{card.word}</h2>
            </motion.div>
          );
        })}

        {rightStack.map((card, i, arr) => {
          const depth = arr.length - 1 - i; 
          return (
            <motion.div
              key={`right-${card.id}-${i}`}
              initial={{ opacity: 0, x: 0, scale: 0.8 }}
              animate={{ opacity: depth === 0 ? 0.6 : 0.2, x: 280 + (depth * 220), y: 0, scale: 0.85 - (depth * 0.12), filter: `blur(${4 + depth * 6}px)` }}
              style={{ zIndex: 10 - depth }}
              className="absolute dark-matte-glass rounded-[32px] p-5 w-[310px] h-[420px] flex flex-col items-center justify-between hidden xl:flex pointer-events-none border border-white/5"
            >
              <div className="w-full flex-1 relative mb-4">
                {card.imageUrl && <img src={getImageUrl(card.imageUrl)} className="w-full h-full object-cover rounded-2xl opacity-60" alt="Right Context" />}
              </div>
              <h2 className="text-3xl font-serif text-white/40 tracking-wide m-0 uppercase">{card.word}</h2>
            </motion.div>
          );
        })}

        <AnimatePresence mode="popLayout">
          {upcomingCards.map((cardItem, index) => {
            const isFront = index === 0;
            
            const depthScale = isFront ? 1 : 1 - (index * 0.06);
            const depthY = isFront ? 0 : index * -32;
            const depthBlur = isFront ? '0px' : `${index * 4}px`;
            const depthZIndex = 50 - index;

            return (
              <motion.div
                key={cardItem.id}
                animate={isFront ? controls : { scale: depthScale, y: depthY }}
                initial={isFront ? false : { opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                drag={isFront && quizData.type !== 'spelling' ? (quizData.type === '4d' ? true : "x") : false}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={isFront ? handleDragEnd : undefined}
                whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                style={{ zIndex: depthZIndex, filter: `blur(${depthBlur})` }}
                className={`group absolute dark-matte-glass rounded-[40px] p-8 w-full max-w-[340px] h-[460px] flex flex-col items-center justify-between ${isFront ? 'z-50' : ''}`}
              >
                
                {isFront && quizData.type === '4d' && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); trigger4D('up'); }} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 rounded-full dark-matte-glass border border-purple-500/40 text-purple-400 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-purple-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.3)] opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap flex items-center gap-1.5">
                      <ChevronUp size={16} strokeWidth={2.5} /> Идеально
                    </button>
                    
                    <button onClick={(e) => { e.stopPropagation(); trigger4D('down'); }} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-5 py-2.5 rounded-full dark-matte-glass border border-orange-500/40 text-orange-400 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-orange-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(249,115,22,0.3)] opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap flex items-center gap-1.5">
                      <ChevronDown size={16} strokeWidth={2.5} /> С трудом
                    </button>
                    
                    <button onClick={(e) => { e.stopPropagation(); trigger4D('left'); }} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full dark-matte-glass border border-red-500/40 text-red-500 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-red-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.3)] opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap flex items-center gap-1.5">
                      <ChevronLeft size={16} strokeWidth={2.5} /> Забыл
                    </button>
                    
                    <button onClick={(e) => { e.stopPropagation(); trigger4D('right'); }} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 px-5 py-2.5 rounded-full dark-matte-glass border border-green-500/40 text-green-400 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-green-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.3)] opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap flex items-center gap-1.5">
                      Нормально <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </>
                )}

                {isFront && quizData.type === 'binary' && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); triggerBinary(false); }} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full dark-matte-glass border border-red-500/40 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.3)] opacity-0 group-hover:opacity-100 z-50">
                      <X size={32} strokeWidth={2.5} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); triggerBinary(true); }} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-16 h-16 rounded-full dark-matte-glass border border-green-500/40 flex items-center justify-center text-green-500 hover:bg-green-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.3)] opacity-0 group-hover:opacity-100 z-50">
                      <Check size={32} strokeWidth={2.5} />
                    </button>
                  </>
                )}

                <div className="w-full flex-1 relative mb-6 group/img">
                  
                  {isFront && quizData.type === '4d' && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-max max-w-full z-10 pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
                        Как хорошо помнишь?
                      </div>
                    </div>
                  )}

                  {(isFront ? quizData.imageUrl : cardItem.baseCard?.imageUrl) ? (
                    <img 
                      src={getImageUrl(isFront ? quizData.imageUrl : cardItem.baseCard?.imageUrl)} 
                      className="w-full h-full object-cover rounded-3xl pointer-events-none shadow-inner opacity-80" 
                      alt="Word context"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 rounded-3xl flex items-center justify-center pointer-events-none">
                      <span className="text-white/20 text-4xl">📷</span>
                    </div>
                  )}
                </div>
                
                <div className="w-full text-center pb-2 pointer-events-none">
                  {isFront && quizData.type === 'spelling' ? (
                    <form onSubmit={handleSpellingSubmit} className="flex flex-col gap-3 pointer-events-auto">
                      <h3 className="m-0 text-gray-400 text-sm font-medium">{quizData.translation}</h3>
                      <input 
                        type="text" 
                        autoFocus
                        value={spellingInput}
                        onChange={(e) => setSpellingInput(e.target.value)}
                        placeholder="Type in English..."
                        className="w-full p-3 text-lg text-center rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
                      />
                    </form>
                  ) : (
                    <>
                      <h1 className="text-4xl font-serif text-white m-0 tracking-widest uppercase italic">
                        {isFront ? quizData.word : cardItem.customWord}
                      </h1>
                      <p className="mt-3 text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase">
                        {isFront ? quizData.translation : cardItem.customTranslation}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};