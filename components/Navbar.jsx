'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ alwaysScrolled = false }) {
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const pathname = usePathname();

  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysScrolled]);

  const anchor = (id) => (pathname === '/' ? `#${id}` : `/#${id}`);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="logo-arabic">إدارة جعفرية</span>
          <span className="logo-text">Idarah-e-Jafaria</span>
        </Link>
        <ul className="nav-links">
          <li><a href={anchor('about')}>About</a></li>
          <li><a href={anchor('programs')}>Programs</a></li>
          <li><a href={anchor('mentors')}>Mentors</a></li>
          <li><a href={anchor('contact')}>Contact</a></li>
          <li><a href={anchor('faq')}>FAQ</a></li>
          <li><Link href="/signup" className="nav-cta">Enroll Now</Link></li>
        </ul>
      </div>
    </nav>
  );
}
