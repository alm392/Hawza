import Link from 'next/link';
import Image from 'next/image';
import FadeIn from './FadeIn';

const features = [
  {
    icon: '🕌',
    title: 'Daily Congregational Prayers',
    desc: 'All five daily prayers held in congregation (Baa-Jamat) at the centre',
  },
  {
    icon: '🎓',
    title: 'Najaf Accredited',
    desc: 'Formally accredited by the Hawza of Najaf al-Ashraf',
  },
  {
    icon: '🤝',
    title: 'Inclusive Programs',
    desc: 'Separate and suitable arrangements for brothers and sisters',
  },
  {
    icon: '📍',
    title: 'Karen Rd, Tarneit',
    desc: "Located in the heart of Melbourne's western community",
  },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">About Us</div>
            <h2>A New Chapter in Islamic Education</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="about-grid">
            <div className="about-text">
              <p>
                <strong>Idarah-e-Jafaria</strong> is honoured to announce
                the commencement of Islamic Markaz activities in <strong>Tarneit, Melbourne</strong>,
                beginning the first week of May.
              </p>
              <p>
                This initiative is dedicated to the spiritual and academic empowerment of our
                community, under the direct guidance of our esteemed scholars. Our seminary is
                fully accredited by the renowned <strong>Hawza of Najaf al-Ashraf</strong> —
                under the supervision of a distinguished Hawza in Najaf Ashraf, one of the most
                prestigious centres of Islamic learning in the world.
              </p>
              <p>
                We extend a warm invitation to all members of our community, brothers and
                sisters alike (with separate arrangements), to join us in this blessed
                endeavour of knowledge, faith, and community service for the sake of
                Imam-e-Zamana (ajtf).
              </p>
              <Link href="/signup" className="btn btn-primary mt-2">
                Register Today
              </Link>
            </div>
            <div className="about-features">
              {features.map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="ijaza-section">
            <div className="ijaza-header">
              <div className="section-tag" style={{ margin: '0 auto 0.75rem' }}>Official Accreditation</div>
              <h3>Letters of Authorization from Najaf al-Ashraf</h3>
              <p className="ijaza-subtitle">
                We are honoured to share the official letters of blessing and authorization
                issued by distinguished scholars of Najaf al-Ashraf, formally endorsing the
                establishment of our Islamic seminary in Melbourne, Victoria.
              </p>
            </div>
            <div className="ijaza-grid">
              <div className="ijaza-item">
                <div className="ijaza-frame">
                  <Image
                    src="/ijaza-najaf.jpeg"
                    alt="Official letter of authorization from Grand Ayatollah Sheikh Shamsuddin Vaezi"
                    width={600}
                    height={800}
                    className="ijaza-img"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="ijaza-credit">
                  <span className="ijaza-name">His Eminence Grand Ayatollah Sheikh Shamsuddin Vaezi</span>
                  <span className="ijaza-role">Marja al-Deeni — Najaf al-Ashraf</span>
                </div>
              </div>
              <div className="ijaza-item">
                <div className="ijaza-frame">
                  <Image
                    src="/ijaza-jabri.png"
                    alt="Official letter of authorization from Ayatollah Sayed Fazil Musawi Jabri"
                    width={600}
                    height={800}
                    className="ijaza-img"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="ijaza-credit">
                  <span className="ijaza-name">His Eminence Ayatollah Sayed Fazil Musawi Jabri</span>
                  <span className="ijaza-role">A Hawza in Najaf Ashraf</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
