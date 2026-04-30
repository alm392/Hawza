import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      {/* Islamic geometric pattern */}
      <div className="hero-pattern" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-star" width="80" height="80" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.75">
                {/* Central diamond */}
                <polygon points="40,10 70,40 40,70 10,40" />
                {/* Lines from each corner to the diamond — creates 4-pointed stars at junctions */}
                <line x1="0" y1="0" x2="10" y2="40" />
                <line x1="0" y1="0" x2="40" y2="10" />
                <line x1="80" y1="0" x2="70" y2="40" />
                <line x1="80" y1="0" x2="40" y2="10" />
                <line x1="0" y1="80" x2="10" y2="40" />
                <line x1="0" y1="80" x2="40" y2="70" />
                <line x1="80" y1="80" x2="70" y2="40" />
                <line x1="80" y1="80" x2="40" y2="70" />
                {/* Small diamond accent at center */}
                <polygon points="40,34 46,40 40,46 34,40" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-star)" />
        </svg>
      </div>

      <div className="hero-content">
        <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div className="hero-divider" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          In-Person Classes &nbsp;·&nbsp; Karen Rd, Tarneit, Melbourne
        </div>

        <h1 className="hero-title">
          Melbourne&apos;s<br />
          Najaf Al-Ashraf<br />
          <span>Accredited Hawza</span>
        </h1>

        <p className="hero-subtitle">
          Face-to-face learning with qualified scholars. Real classes, real community, right here in Melbourne.
        </p>

        <div className="hero-dua">
          &ldquo;O Allah, be for Your representative, al-Hujjah bin al-Hasan&hellip; a leader,
          a helper, and a guide.&rdquo;
        </div>

        <div className="hero-buttons">
          <Link href="/signup" className="btn btn-primary">Enroll Now</Link>
          <a href="#about" className="btn btn-secondary">Learn More</a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
