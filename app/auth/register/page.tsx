'use client';

import '../../page.css';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/utils/translations';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error((language === 'sr' ? 'Greška: ' : 'Error: ') + error.message);
    } else {
      toast.success(
        language === 'sr'
          ? 'Proveri mejl za potvrdu naloga 📬'
          : 'Check your email to confirm your account 📬'
      );
      router.push('/auth');
    }
  };

  return (
    <div className="login-wrapper">
      <LanguageSwitcher />
      <div className="login-card">
      <img src="/logo.png" alt="Logo" className="app-logo" />
        <h2>{t.register}</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>{t.name_label}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name_placeholder}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
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
          <button type="submit" disabled={loading}>
            {loading ? t.registering : t.register}
          </button>
        </form>
        <div className="footer">
          {t.have_account} <Link href="/auth">{t.login}</Link>
        </div>
      </div>
    </div>
  );
}
