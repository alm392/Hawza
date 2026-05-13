import { Cormorant_Garamond, Nunito, Amiri } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-nunito',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata = {
  title: "Melbourne's Najaf Al Ashraf Accredited Hawza",
  description:
    "Melbourne's Najaf Al-Ashraf accredited Islamic seminary. In-person classes in Tarneit with qualified scholars. Enroll now.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
