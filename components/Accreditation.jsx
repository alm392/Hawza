'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import FadeIn from './FadeIn';

const letters = [
  {
    name: 'His Eminence Grand Ayatollah Sheikh Shamsuddin Vaezi',
    role: 'Marja al-Deeni — Najaf al-Ashraf',
    src: '/ijaza-najaf.jpeg',
  },
  {
    name: 'His Eminence Ayatollah Sayed Fazil Musawi Jabri',
    role: 'Head of Hawza Ilmiya, Najaf al-Ashraf — Madarsa Imam Hussain (a.s)',
    src: '/ijaza-jabri.png',
  },
  { name: 'His Eminence Ayatollah Sayed Nabil Shakir Talaqani',       src: '/certs/ayatollah-sayed-nabil-shakir-talaqani.jpg' },
  { name: 'His Eminence Ayatollah Sayed Saeed AlFayaz Hussaini',      src: '/certs/ayatollah-sayed-saeed-alfayaz-hussaini.jpg' },
  { name: 'His Eminence Ayatollah Sheikh Ahmad Moballighi',           src: '/certs/ayatollah-sheikh-ahmad-moballighi.jpeg' },
  { name: 'His Eminence Ayatollah Sheikh Faisal AlAsadi',             src: '/certs/ayatollah-sheikh-faisal-alasadi.jpg' },
  { name: 'His Eminence Ayatollah Sheikh Sakhawat Hussain Sandralvi', src: '/certs/ayatollah-sheikh-sakhawat-hussain-sandralvi.jpg' },
  { name: 'His Eminence Grand Ayatollah Sayed Abul Qasim Khoei (r.a)',      src: '/certs/grand-ayatollah-sayed-abul-qasim-khoei.jpg' },
  { name: 'His Eminence Grand Ayatollah Sayed Mahmood Shahroudi (r.a)',      src: '/certs/grand-ayatollah-sayed-mahmood-shahroudi.jpg' },
  { name: 'His Eminence Grand Ayatollah Sayed Mohammad Reza Gulpaygani',     src: '/certs/grand-ayatollah-sayed-mohammad-reza-gulpaygani.jpg' },
  { name: 'His Eminence Grand Ayatollah Yousuf Kanj Fatemi',                 src: '/certs/grand-ayatollah-yousuf-kanj-fatemi.jpg' },
];

export default function Accreditation() {
  const [active, setActive] = useState(null);
  const touchStartX = useRef(null);

  const close = useCallback(() => setActive(null), []);
  const prev  = useCallback(() => setActive(i => (i - 1 + letters.length) % letters.length), []);
  const next  = useCallback(() => setActive(i => (i + 1) % letters.length), []);

  useEffect(() => {
    if (active === null) return;
    function onKey(e) {
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, prev, next]);

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  }

  const letter = active !== null ? letters[active] : null;

  return (
    <>
      <section className="accreditation" id="accreditation">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <h2>Letters of Accreditation</h2>
              <div className="gold-line" />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="accredi-grid">
              {letters.map((l, i) => (
                <button
                  key={l.src}
                  className="accredi-card"
                  onClick={() => setActive(i)}
                  aria-label={`View letter from ${l.name}`}
                >
                  <div className="accredi-card-img-wrap">
                    <Image
                      src={l.src}
                      alt={l.name}
                      width={400}
                      height={560}
                      className="accredi-card-img"
                      style={{ width: '100%', height: 'auto' }}
                    />
                    <div className="accredi-card-overlay">
                      <div className="accredi-card-zoom" />
                    </div>
                  </div>
                  <div className="accredi-card-info">
                    <span className="accredi-card-name">{l.name}</span>
                    {l.role && <span className="accredi-card-role">{l.role}</span>}
                  </div>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {letter && (
        <div
          className="accredi-lb"
          role="dialog"
          aria-modal="true"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="accredi-lb-bg" onClick={close} />
          <button className="accredi-lb-close" onClick={close} aria-label="Close">✕</button>

          <button className="accredi-lb-side accredi-lb-prev" onClick={prev} aria-label="Previous">‹</button>

          <div className="accredi-lb-center">
            <div className="accredi-lb-frame">
              <Image
                src={letter.src}
                alt={letter.name}
                width={700}
                height={980}
                className="accredi-lb-img"
                style={{ width: '100%', height: 'auto' }}
                priority
              />
            </div>
            <div className="accredi-lb-info">
              <span className="accredi-lb-name">{letter.name}</span>
              {letter.role && <span className="accredi-lb-role">{letter.role}</span>}
              <div className="accredi-lb-mobile-nav">
                <button className="accredi-lb-nav-sm" onClick={prev} aria-label="Previous">‹</button>
                <span className="accredi-lb-count">{active + 1} / {letters.length}</span>
                <button className="accredi-lb-nav-sm" onClick={next} aria-label="Next">›</button>
              </div>
              <span className="accredi-lb-count accredi-lb-count-desk">{active + 1} / {letters.length}</span>
            </div>
          </div>

          <button className="accredi-lb-side accredi-lb-next" onClick={next} aria-label="Next">›</button>
        </div>
      )}
    </>
  );
}
