import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'AFINEX 📝To-do-app',
  description: 'Organizuj se kao boss by Andrej Filipov',
  icons: {
    icon: '/favicon.ico', // ✅ Dodato ovde
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body className="bg-black text-white">
        <LanguageProvider>
          <Toaster position="top-right" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

