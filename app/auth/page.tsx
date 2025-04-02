'use client';

import Link from 'next/link';
import './page.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/utils/translations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  // ✅ Automatski redirect ako postoji sesija + RememberMe flag
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const isRemembered = localStorage.getItem('rememberMe') === 'true';

      if (data.session && isRemembered) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

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

          {/* ✅ Remember Me opcija */}
          <div style={{ marginTop: '1rem' }}>
  <label
    htmlFor="rememberMe"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      gap: '0.5rem',
      lineHeight: '1.5rem',
      verticalAlign: 'middle',
    }}
  >
    <input
      id="rememberMe"
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      style={{
        width: '16px',
        height: '16px',
        accentColor: '#ff4309',
        verticalAlign: 'middle',
      }}
    />
    {language === 'sr' ? 'Zapamti me' : 'Remember me'}
  </label>
</div>


          <button type="submit">{t.login}</button>
        </form>

        <div className="footer" style={{ marginTop: '1.5rem' }}>
          <div>
            {t.no_account}{' '}
            <Link href="/auth/register" className="text-orange-600 font-semibold">
              {t.register}
            </Link>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Link href="/auth/reset-password" className="text-orange-400 font-medium">
              {language === 'sr' ? 'Zaboravili ste lozinku?' : 'Forgot your password?'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
