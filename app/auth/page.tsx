'use client';

import Link from 'next/link';
import './page.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/utils/translations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      toast.success('✅ ' + (language === 'sr' ? 'Ulogovani ste!' : 'You are logged in!'));
      router.push('/dashboard');
    } else {
      toast.error(
        (language === 'sr' ? 'Greška pri logovanju: ' : 'Login error: ') + error.message
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
      Dobrodošli na <span className="highlight">To-do-list</span> aplikaciju!
    </>
  ) : (
    <>
      Welcome to the <span className="highlight">To-do-list</span> app!
    </>
  )}
</h2>
        <form onSubmit={handleLogin}>
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
          <div style={{ marginTop: '1rem' }}>
            <label>{t.password_label}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password_placeholder}
            />
          </div>
          <button type="submit">{t.login}</button>
        </form>

        <div className="footer">
          {t.no_account} <Link href="/auth/register">{t.register}</Link>
        </div>
      </div>
    </div>
  );
}
