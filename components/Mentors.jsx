import FadeIn from './FadeIn';

const mentors = [
  {
    name: 'His Eminence Ayatollah\nSyed Muhammad Mehdi Tabatabai',
    desc: 'Esteemed scholar and spiritual mentor providing overarching guidance, wisdom, and religious authority to the Hawza and all its programs.',
    featured: false,
  },
  {
    name: 'Grand Ayatollah Sheikh\nShamsuddin Vaezi',
    desc: "Under whose esteemed authority the Hawza of Najaf al-Ashraf confers full accreditation to our Melbourne seminary, a testament to our program's authenticity and academic rigour.",
    featured: true,
    badge: 'Grand Supervisor',
  },
  {
    name: 'H.I. Maulana Dr.\nSyed Asghar Mahmood Naqvi',
    desc: 'Academic director and scholar providing direct educational leadership, curriculum oversight, and personal mentorship to students.',
    featured: false,
  },
];

export default function Mentors() {
  return (
    <section className="mentors" id="mentors">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">Leadership</div>
            <h2>Distinguished Mentorship &amp; Supervision</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="mentors-grid">
            {mentors.map((m) => (
              <div key={m.name} className={`mentor-card${m.featured ? ' featured' : ''}`}>
                {m.badge && <div className="mentor-badge">{m.badge}</div>}
                <span className="mentor-icon">☪</span>
                <h3>{m.name.replace('\n', '\n')}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
