import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import SignupForm from '@/components/SignupForm';

export const metadata = {
  title: 'Enrollment Registration | Idarah-e-Jafaria Melbourne',
  description:
    'Register for Hawza or Madarsa programs at Idarah-e-Jafaria Melbourne. Najaf Al-Ashraf Accredited Islamic Seminary.',
};

export default function SignupPage() {
  return (
    <>
      <Navbar alwaysScrolled />

      <section className="page-hero">
        <div className="hero-pattern" />
        <div className="page-hero-content">
          <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
          <h1>Enrollment Registration</h1>
          <p>Begin your journey of knowledge and faith</p>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          <FadeIn>
            <div className="form-wrapper">
              <div className="form-header">
                <div className="gold-line" style={{ marginLeft: 0 }} />
                <h2>Registration Form</h2>
                <p>
                  Please complete all required fields. A member of our team will contact you within
                  48 hours to confirm your enrollment. May Allah bless this journey for you.
                </p>
              </div>

              <div className="form-info-bar">
                <span>🗓</span>
                <p style={{ margin: 0 }}>
                  Classes are held at Karen Rd, Tarneit. All sessions are <strong>in-person</strong> with separate arrangements
                  for brothers and sisters.
                </p>
              </div>

              <SignupForm />
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Prefer to register by phone? Contact us directly:
              </p>
              <p style={{ marginTop: '10px', fontSize: '0.95rem', color: 'var(--text-mid)' }}>
                <strong>Maulana Syed Asghar:</strong>{' '}
                <a href="tel:0489157296" style={{ color: 'var(--green-400)', fontWeight: 600 }}>0489 157 296</a>
                {' · '}
                <strong>Br Ayser:</strong>{' '}
                <a href="tel:0431562150" style={{ color: 'var(--green-400)', fontWeight: 600 }}>0431 562 150</a>
                {' · '}
                <strong>Br Sadiq:</strong>{' '}
                <a href="tel:0468463242" style={{ color: 'var(--green-400)', fontWeight: 600 }}>0468 463 242</a>
                {' · '}
                <strong>Br Tanvir:</strong>{' '}
                <a href="tel:0430910092" style={{ color: 'var(--green-400)', fontWeight: 600 }}>0430 910 092</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
