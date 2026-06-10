import { useAuthForm } from '../hooks/useAuthForm';

interface AuthProps {
  onLogin: () => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const {
    isLogin, setIsLogin,
    email, setEmail,
    password, setPassword,
    error, loading, handleSubmit
  } = useAuthForm(onLogin);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative z-10">
 
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-serif tracking-[0.3em] text-white drop-shadow-lg">
          LINGUA <span className="opacity-40">VISTA</span>
        </h1>
        <p className="text-white/40 tracking-widest uppercase text-xs mt-3">
          Elevate your vocabulary
        </p>
      </div>

      <div className="dark-matte-glass rounded-[40px] p-10 w-full max-w-sm border border-white/10 shadow-2xl relative">
        <h2 className="text-2xl font-serif tracking-widest uppercase text-white text-center mb-8">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="text-red-400 text-xs font-bold tracking-widest uppercase bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-center">
              {error}
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium tracking-wide"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium tracking-wide"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-4 mt-2 rounded-2xl font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
              loading 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-wait shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 text-white border border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p 
            className="text-white/40 hover:text-white transition-colors cursor-pointer text-xs font-bold tracking-[0.1em] uppercase" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'No account? Sign up' : 'Already have an account? Sign in'}
          </p>
        </div>
      </div>
    </div>
  );
};