import FadeIn from './FadeIn';

const programs = [
  {
    icon: '🎓',
    title: 'The Hawza',
    subtitle: 'Islamic Seminary',
    desc: "Melbourne's premier religious education program, accredited and under the esteemed supervision of the Hawza of Najaf al-Ashraf (u/s Grand Ayatollah Sheikh Shamsuddin Vaezi). A structured seminary education rooted in the tradition of Najaf.",
    tag: 'Brothers & Sisters (Separate)',
  },
  {
    icon: '📖',
    title: 'Madarsa-e-Jafaria',
    subtitle: null,
    desc: 'Primary-level Islamic religious education for children aged 14 and under. A nurturing, structured environment for the next generation to learn and love their faith from a young age.',
    tag: 'Ages 14 & Under',
  },
  {
    icon: '📝',
    title: 'Academic Excellence & Tutoring',
    subtitle: null,
    desc: 'Comprehensive academic support for students in their school curriculum, ensuring professional and academic success alongside their religious development.',
    tag: 'All School Ages',
  },
  {
    icon: '🤝',
    title: 'Youth Discussion Sessions',
    subtitle: null,
    desc: 'Empowering our youth through open dialogue, faith-based guidance, and leadership development. Building the next generation of confident, grounded community members.',
    tag: 'Youth',
  },
  {
    icon: '🎙️',
    title: "Mastery in Quranic Qira'at",
    subtitle: null,
    desc: "Specialised classes focused on the beautiful and correct recitation of the Holy Quran, guided by experienced instructors in tajweed and the melodic traditions of Qira'at.",
    tag: 'All Levels',
  },
  {
    icon: '⚖️',
    title: 'Religious Consultation',
    subtitle: null,
    desc: 'Personal guidance on jurisprudential and spiritual matters. Our esteemed scholars are available to provide informed, compassionate answers to your religious questions.',
    tag: 'All Community',
  },
];

export default function Programs() {
  return (
    <section className="programs" id="programs">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">Our Programs</div>
            <h2>Featured Programs &amp; Services</h2>
            <div className="gold-line" />
            <p className="section-desc">
              Comprehensive spiritual and academic programs for all ages and levels
            </p>
          </div>
        </FadeIn>
        <div className="programs-grid">
          {programs.map((p, i) => (
            <FadeIn key={p.title} delay={i * 80}>
              <div className="program-card">
                <div className="card-icon">{p.icon}</div>
                <h3>
                  {p.title}
                  {p.subtitle && (
                    <small style={{ fontSize: '0.85em', fontWeight: 400, display: 'block' }}>
                      {p.subtitle}
                    </small>
                  )}
                </h3>
                <p>{p.desc}</p>
                <div className="card-tag">{p.tag}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
