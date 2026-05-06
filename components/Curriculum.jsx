import FadeIn from './FadeIn';

const hawzaDays = [
  {
    day: 'Friday',
    subjects: [
      {
        name: "Uloom e Qur'an",
        topics: ["Ilm e Tilawat", "Tajweed", "Qiraat", "Basic Qur'anic Arabic"],
      },
      {
        name: 'Aqaid (Beliefs)',
        topics: ['Tawheed', 'Nubuwwat', 'Imamat', 'Akhirah'],
      },
    ],
  },
  {
    day: 'Saturday',
    subjects: [
      {
        name: 'Fiqh / Ahkam',
        topics: ['Ibadat (Acts of Worship)', 'Muamlaat (Dealings)', 'Daily rulings: Namaz, Roza, Taharat'],
      },
      {
        name: 'Dars e Akhlaq',
        topics: ['Character Building', 'Islamic Manners', 'Practical Life Guidance'],
      },
    ],
  },
  {
    day: 'Sunday',
    subjects: [
      {
        name: 'Tarikh (History)',
        topics: ['History of the Prophets', 'Seerat of Ahlulbayt (ع)', 'Key Islamic Events'],
      },
      {
        name: 'Ilm e Hadees',
        topics: ['Selected Hadith', 'Understanding meanings', 'Practical application'],
      },
    ],
  },
];

const madarsaLevels = [
  { num: 1, title: 'Foundation' },
  { num: 2, title: 'Deepening Understanding' },
  { num: 3, title: 'Practical Application' },
  { num: 4, title: 'Advanced Knowledge' },
];

const outcomes = [
  { icon: '📖', text: "Read Qur'an with proper Tajweed" },
  { icon: '🧠', text: 'Understand core beliefs (Aqaid)' },
  { icon: '⚖️', text: 'Practice Islamic rulings in daily life' },
  { icon: '✨', text: 'Develop strong Islamic character' },
  { icon: '📜', text: 'Learn Islamic history & Seerat of Ahlulbayt (ع)' },
  { icon: '📚', text: 'Understand and apply Hadith' },
];

const quotes = [
  {
    text: 'Seeking knowledge is obligatory upon every Muslim.',
    source: 'The Prophet Muhammad (ﷺ)',
  },
  {
    text: "A person's value is according to their knowledge.",
    source: 'Imam Ali (عليه السلام)',
  },
  {
    text: 'One who does not understand religion is like an ignorant person.',
    source: 'Imam al-Sadiq (عليه السلام)',
  },
];

export default function Curriculum() {
  return (
    <section className="curriculum" id="curriculum">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">Curriculum &amp; Schedule</div>
            <h2>What You Will Learn</h2>
            <div className="gold-line" />
            <p className="section-desc">
              Classes taught in <strong>English, Urdu &amp; Arabic</strong>
            </p>
          </div>
        </FadeIn>

        {/* Hawza weekly schedule */}
        <FadeIn delay={80}>
          <div className="curr-block">
            <div className="curr-block-header">
              <span className="curr-block-emoji">🎓</span>
              <div>
                <h3>Hawza Classes — Ages 14+</h3>
                <p>After Maghrib &nbsp;·&nbsp; Friday, Saturday &amp; Sunday &nbsp;·&nbsp; 2 lessons per evening (~45 min each, ~2–3 hrs total)</p>
              </div>
              <div className="curr-block-tags">
                <span className="card-tag">Boys &amp; Girls</span>
                <span className="card-tag">6 Subjects</span>
              </div>
            </div>
            <div className="curr-days-grid">
              {hawzaDays.map((d) => (
                <div className="curr-day-card" key={d.day}>
                  <div className="curr-day-label">{d.day}</div>
                  {d.subjects.map((s) => (
                    <div className="curr-subject" key={s.name}>
                      <div className="curr-subject-name">{s.name}</div>
                      <ul>
                        {s.topics.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Daily Qur'an + Madarsa */}
        <FadeIn delay={120}>
          <div className="curr-two-col">
            <div className="curr-block">
              <div className="curr-block-emoji">📖</div>
              <h3>Daily Dars-e-Qur&apos;an</h3>
              <div className="curr-timing">
                <span className="curr-timing-pill">🗓 Monday – Friday</span>
                <span className="curr-timing-pill">🕔 5:00 PM</span>
              </div>
              <ul className="curr-check-list">
                <li>Tilawat</li>
                <li>Qiraat</li>
                <li>Tajweed</li>
                <li>Qur&apos;anic Arabic</li>
              </ul>
              <p className="curr-note">Please bring your own Qur&apos;an</p>
            </div>

            <div className="curr-block">
              <div className="curr-block-emoji">👶</div>
              <h3>Madarsa-e-Jafaria — Under 14</h3>
              <div className="curr-timing">
                <span className="curr-timing-pill">🗓 Every Sunday</span>
                <span className="curr-timing-pill">🕥 10:30 AM</span>
              </div>
              <div className="curr-levels">
                {madarsaLevels.map((l) => (
                  <div className="curr-level" key={l.num}>
                    <span className="curr-level-num">Level {l.num}</span>
                    <span className="curr-level-title">{l.title}</span>
                    <span className="curr-level-pill">3 months</span>
                  </div>
                ))}
              </div>
              <p className="curr-note">Certificate awarded after each level</p>
            </div>
          </div>
        </FadeIn>

        {/* Learning outcomes */}
        <FadeIn delay={150}>
          <div className="curr-outcomes">
            <h3 className="curr-outcomes-title">Learning Outcomes</h3>
            <div className="curr-outcomes-grid">
              {outcomes.map((o) => (
                <div className="curr-outcome-item" key={o.text}>
                  <span>{o.icon}</span>
                  <p>{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Knowledge quotes */}
        <FadeIn delay={180}>
          <div className="curr-quotes">
            {quotes.map((q) => (
              <div className="curr-quote" key={q.source}>
                <blockquote>&ldquo;{q.text}&rdquo;</blockquote>
                <cite>— {q.source}</cite>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
