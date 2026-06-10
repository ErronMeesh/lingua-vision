import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { Zap, Brain, Flame, CheckCircle2, Camera, Globe } from 'lucide-react';

export const Home = () => {
  const { cardsToReview, loading } = useDashboard();
  const hasCards = cardsToReview.length > 0;

  return (
    <div className="p-5 max-w-5xl mx-auto min-h-[90vh] flex flex-col items-center justify-center gap-12 mt-4 relative z-10">
      
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif tracking-[0.3em] text-white drop-shadow-lg uppercase mb-3 m-0">
          Welcome Back
        </h1>
        <p className="text-white/40 tracking-widest uppercase text-xs">
          Select your training mode or discover tools
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        
        <Link 
          to="/training?mode=fast"
          className="dark-matte-glass rounded-[40px] p-8 border border-white/5 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 active:scale-95 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300">
            <Zap size={40} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          
          <h3 className="text-2xl font-serif text-white tracking-widest uppercase mb-4 m-0">
            Quick Workout
          </h3>
          
          <p className="text-white/50 text-[11px] font-bold tracking-[0.1em] uppercase leading-relaxed max-w-[250px] m-0">
            SWIPE LEFT OR RIGHT. Perfect for a rapid memory refresh and daily vocabulary review.
          </p>
        </Link>

        <Link 
          to="/training?mode=deep" 
          className="dark-matte-glass rounded-[40px] p-8 border border-white/5 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 active:scale-95 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
        >
          <div className="w-20 h-20 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:bg-purple-500/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
            <Brain size={40} className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>
          
          <h3 className="text-2xl font-serif text-white tracking-widest uppercase mb-4 m-0">
            Deep Dive
          </h3>
          
          <p className="text-white/50 text-[11px] font-bold tracking-[0.1em] uppercase leading-relaxed max-w-[250px] m-0">
            FOUR-WAY ASSESMENT DIVE. Use detailed memory ratings for advanced vocabulary retention.
          </p>
        </Link>
      </div>

      <div 
        className={`w-full max-w-sm dark-matte-glass rounded-[32px] p-6 flex items-center justify-between border border-white/5 relative overflow-hidden group transition-all duration-500
          ${hasCards 
            ? 'shadow-[0_0_20px_rgba(248,113,113,0.1)]' 
            : 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
          }
          hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]`
        }
      >
         <div className="flex flex-col gap-1 z-10">
            <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">
              Daily Goal
            </span>
            
            {loading ? (
              <div className="h-8 w-24 bg-white/5 rounded animate-pulse mt-1"></div>
            ) : hasCards ? (
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)] leading-none transition-colors group-hover:text-white">
                  {cardsToReview.length}
                </span>
                <span className="text-white/50 text-sm font-medium pb-1 tracking-wide transition-colors group-hover:text-white/80">
                  words to review
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1 text-emerald-400 group-hover:text-white transition-colors">
                <CheckCircle2 size={24} className="drop-shadow-[0_0_10px_rgba(52,211,153,0.4)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all" />
                <span className="font-serif tracking-widest uppercase text-sm">
                  All done for today!
                </span>
              </div>
            )}
         </div>
         
         <div className={`absolute -right-6 -top-6 opacity-30 rotate-12 group-hover:rotate-0 group-hover:opacity-50 transition-all duration-700 ${hasCards ? 'text-red-500/10 group-hover:text-white/5' : 'text-white/5'}`}>
           <Flame size={120} strokeWidth={1} />
         </div>
      </div>

      <div className="w-full max-w-2xl mt-4 pt-10 border-t border-white/5 flex flex-col items-center gap-6 relative">
        <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase m-0">
          Additional Tools
        </p>
        
        <div className="grid grid-cols-2 gap-5 w-full">
          <Link 
            to="/camera" 
            className="flex items-center justify-between p-5 rounded-2xl dark-matte-glass border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 group transition-colors shadow-lg shadow-black/20"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase m-0">Add Words</span>
              <span className="text-emerald-400/80 text-[10px] font-bold tracking-[0.1em] uppercase">Use CameraUpload</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 transition-all group-hover:scale-105 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Camera size={22} />
            </div>
          </Link>

          <Link 
            to="/feed" 
            className="flex items-center justify-between p-5 rounded-2xl dark-matte-glass border border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-500/5 group transition-colors shadow-lg shadow-black/20"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase m-0">View Feed</span>
              <span className="text-blue-400/80 text-[10px] font-bold tracking-[0.1em] uppercase">Public Cards</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 transition-all group-hover:scale-105 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Globe size={22} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};