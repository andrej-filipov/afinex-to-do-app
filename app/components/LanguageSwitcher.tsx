'use client';
import { useLanguage } from '@/context/LanguageContext';
import './languageSwitcher.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'sr' ? 'en' : 'sr');
  };

  const flagSrc = language === 'sr' ? '/flags/serbia-flag.svg' : '/flags/us-flag.svg';
  const label = language === 'sr' ? 'Srpski' : 'English';

  return (
    <div className="languageWrapper">
      <button onClick={toggleLanguage} className="languageBtn">
        <img src={flagSrc} alt={`${label} flag`} className="flagIcon" />
        <span>{label}</span>
      </button>
    </div>
  );
}
