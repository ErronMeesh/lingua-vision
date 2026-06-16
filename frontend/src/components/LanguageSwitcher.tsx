import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ru') ? 'en' : 'ru';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-full dark-matte-glass border border-white/10 hover:bg-white/10 transition-all text-white/70 hover:text-white group shadow-lg shadow-black/20"
      title="Switch language"
    >
      <Globe size={16} className="group-hover:rotate-180 transition-transform duration-500" />
      <span className="text-xs font-bold tracking-widest uppercase">
        {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
      </span>
    </button>
  );
};