'use client';

import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/utils/translations';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://afinex-to-do-app.vercel.app/auth/update-password',
    });
    setLoading(false);

    if (error) {
      toast.error(language === 'sr' ? 'Greška prilikom slanja mejla' : 'Error sending reset email');
    } else {
      toast.success(
        language === 'sr'
          ? 'Link za reset lozinke je poslat!'
          : 'Password reset link has been sent!'
      );
    }
  };

  return (
    <div className="login-wrapper">
      <LanguageSwitcher />
      <div className="login-card">
        <img src="/logo.png" alt="Logo" className="app-logo" />
        <h2 className="animated-title">
          {language === 'sr' ? (
            <>
              Resetuj <span className="highlight">lozinku</span>
            </>
          ) : (
            <>
              Reset <span className="highlight">Password</span>
            </>
          )}
        </h2>

        <form onSubmit={handleReset}>
          <div>
            <label>{t.email_label}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email_placeholder}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading
              ? language === 'sr'
                ? 'Slanje...'
                : 'Sending...'
              : language === 'sr'
              ? 'Pošalji link za reset'
              : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
