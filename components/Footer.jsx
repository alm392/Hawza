import Link from 'next/link';

const navLinks = ['About', 'Programs', 'Mentors', 'Contact', 'FAQ'];
const programList = [
  'The Hawza',
  'Madarsa-e-Jafaria',
  'Academic Tutoring',
  'Youth Sessions',
  "Qira'at Classes",
  'Religious Consultation',
];
const contacts = [
  { name: 'Maulana Syed Asghar', phone: '0489 157 296', tel: '0489157296' },
  { name: 'Br Ayser',            phone: '0431 562 150', tel: '0431562150' },
  { name: 'Br Sadiq',            phone: '0468 463 242', tel: '0468463242' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-pattern" />
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-arabic">إدارة جعفرية</div>
            <h3>Idarah-e-Jafaria</h3>
            <p>
              Momineen E Karen Rd<br />
              Tarneit, Melbourne, VIC<br />
              Australia
            </p>
            <div className="footer-dua">Iltemas-e-Dua</div>
          </div>
          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              {navLinks.map((l) => (
                <li key={l}>
                  <a href={`/#${l.toLowerCase()}`}>{l}</a>
                </li>
              ))}
              <li><Link href="/signup">Enroll</Link></li>
            </ul>
          </div>
          <div className="footer-programs">
            <h4>Programs</h4>
            <ul>
              {programList.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Register</h4>
            {contacts.map((c) => (
              <p key={c.tel}>
                {c.name}<br />
                <a href={`tel:${c.tel}`}>{c.phone}</a>
              </p>
            ))}
            <Link href="/signup" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
              Enroll Now
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Idarah-e-Jafaria &nbsp;|&nbsp; Melbourne Islamic Centre &nbsp;|&nbsp; Karen Rd, Tarneit</p>
          <Link href="/admin" className="footer-admin-link">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
