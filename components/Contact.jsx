import Link from 'next/link';
import FadeIn from './FadeIn';

const contacts = [
  { name: 'Maulana Syed Asghar', phone: '0489 157 296', tel: '0489157296' },
  { name: 'Br Ayser',            phone: '0431 562 150', tel: '0431562150' },
  { name: 'Br Sadiq',            phone: '0468 463 242', tel: '0468463242' },
  { name: 'Br Tanvir',           phone: '0430 910 092', tel: '0430910092' },
];

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">Location &amp; Contact</div>
            <h2>Find Us &amp; Get in Touch</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Location</h4>
                  <p>Karen Rd, Tarneit, Melbourne, VIC</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🗓</span>
                <div>
                  <h4>Commencing</h4>
                  <p>First Week of May. Enrollments Now Open.</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕌</span>
                <div>
                  <h4>Daily Prayers</h4>
                  <p>All five daily prayers in congregation. Community welcome.</p>
                </div>
              </div>
              <div className="contact-divider" />
              <h4 className="contact-subtitle">Contact to Register</h4>
              {contacts.map((c) => (
                <div className="contact-person" key={c.tel}>
                  <span>{c.name}</span>
                  <a href={`tel:${c.tel}`}>{c.phone}</a>
                </div>
              ))}
              <Link href="/signup" className="btn btn-primary mt-3">
                Enroll Online
              </Link>
            </div>

            <div className="contact-cta-box">
              <div className="cta-ornament">بسم الله الرحمن الرحيم</div>
              <h3>Begin Your Journey of Knowledge</h3>
              <p>
                We invite all members of our community to join us in this blessed initiative,
                whether as students, volunteers, or supporters of this noble cause.
              </p>
              <p>
                All are welcome to contribute your time, skills, or donations for the sake of
                Imam-e-Zamana (ajtf).
              </p>
              <Link href="/signup" className="btn btn-primary">
                Register Now
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
