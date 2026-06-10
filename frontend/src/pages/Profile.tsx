import { Eye, EyeOff, Camera, User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { getImageUrl } from '../utils/image';

export const Profile = () => {
  const {
    user, nickname, setNickname, newPassword, setNewPassword,
    showPassword, setShowPassword, loading, saving, fileInputRef,
    previewUrl, handleFileChange, handleSave
  } = useProfile();

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-[50vh]">
        <p className="animate-pulse text-xl font-medium text-white/50 tracking-widest uppercase">
          ⏳ Загрузка профиля...
        </p>
      </div>
    );
  }

  const displayAvatar = previewUrl || (user?.avatarUrl ? getImageUrl(user.avatarUrl) : null);

  return (
    <div className="p-8 max-w-md mx-auto mt-12 dark-matte-glass rounded-[40px] shadow-2xl border border-white/10 relative z-10">
      <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-10 tracking-widest uppercase">
        PROFILE
      </h2>

      <div className="flex flex-col items-center mb-10">
        <div 
          className="w-32 h-32 rounded-full dark-matte-glass flex items-center justify-center overflow-hidden cursor-pointer border border-white/20 hover:border-white/40 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] relative group"
          onClick={() => fileInputRef.current?.click()}
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <User size={48} className="text-white/20" strokeWidth={1.5} />
          )}
          
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera size={24} className="text-white/80 mb-1" />
            <span className="text-white/80 font-bold tracking-widest uppercase text-[10px]">Изменить</span>
          </div>
        </div>
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">
            Email (нельзя изменить)
          </label>
          <input 
            type="text" 
            value={user?.email || ''} 
            disabled 
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 cursor-not-allowed font-medium tracking-wide" 
          />
        </div>

        <div>
          <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">
            Никнейм
          </label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Придумайте никнейм"
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium tracking-wide" 
          />
        </div>

        <div>
          <label className="block text-white/40 text-[10px] font-bold mb-2 uppercase tracking-[0.2em]">
            Новый пароль
          </label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Оставьте пустым, если не меняете"
              className="w-full p-4 pr-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-medium tracking-wide" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving}
          className={`w-full p-4 mt-4 rounded-2xl font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
            saving 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-wait shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-white/5 text-white border border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-95'
          }`}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
};