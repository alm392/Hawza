'use client';
import { useState } from 'react';
import FadeIn from './FadeIn';
import Link from 'next/link';

const faqs = [
  {
    q: 'What is the Hawza and who can join?',
    a: 'The Hawza is a traditional Islamic seminary offering formal religious education in the classical tradition. It is open to both brothers and sisters (with separate arrangements) of all adult ages. The program is fully accredited by the Hawza of Najaf al-Ashraf under Grand Ayatollah Sheikh Shamsuddin Vaezi.',
  },
  {
    q: 'When does the program begin?',
    a: 'All programs commence in the first week of May at our centre on Karen Rd, Tarneit. Enrollment is currently open, so we encourage you to register early to secure your place.',
  },
  {
    q: 'Is the Hawza free?',
    a: 'Yes. The Hawza is completely free of charge. Knowledge is a trust, and we believe no sincere seeker should face a financial barrier. That said, if you feel moved to contribute, donations are always welcome and go directly toward sustaining and growing this blessed initiative for the benefit of our entire community.',
  },
  {
    q: 'When will the Hawza run?',
    a: 'Classes will commence in the first week of May, beginning Friday the 5th of May. Sessions will be held across Friday, Saturday, and Sunday each week. Class times will be confirmed upon enrollment and tailored to best suit our students.',
  },
  {
    q: 'Is the Madarsa only for specific age groups?',
    a: 'Madarsa-e-Jafaria is designed for children aged 14 and under, offering primary-level religious education. The Hawza (Islamic Seminary) program is available for older students and adults seeking formal seminary-level study.',
  },
  {
    q: 'Are there separate programs for brothers and sisters?',
    a: 'Yes. Appropriate and separate arrangements have been made for both brothers and sisters across all programs, ensuring a comfortable, focused, and Islamically sound learning environment for everyone.',
  },
  {
    q: 'What accreditation does the Hawza hold?',
    a: 'The Hawza is formally accredited and operates under the direct supervision of the Hawza of Najaf al-Ashraf, one of the oldest and most prestigious centres of Islamic scholarship in the world, under the esteemed authority of Grand Ayatollah Sheikh Shamsuddin Vaezi.',
  },
  {
    q: 'Are daily prayers open to the general community?',
    a: 'InshaAllah, all five daily prayers will be held in congregation (Baa-Jamat) at the centre. All community members are warmly welcomed to participate in the congregational prayers, regardless of whether they are enrolled in any program.',
  },
  {
    q: 'How can I volunteer or donate to support the initiative?',
    a: null,
  },
  {
    q: 'How do I enroll or register?',
    a: null,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <FadeIn>
          <div className="section-header">
            <div className="section-tag">FAQ</div>
            <h2>Frequently Asked Questions</h2>
            <div className="gold-line" />
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => toggle(i)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className={`faq-answer${open === i ? ' open' : ''}`}>
                  {faq.a ? (
                    <p>{faq.a}</p>
                  ) : i === faqs.length - 2 ? (
                    <p>
                      We warmly welcome contributions of time, skills, and donations to this noble
                      cause. Please reach out to any of our contact numbers or use the{' '}
                      <Link href="/signup">enrollment form</Link> to express your interest in
                      volunteering or contributing for the sake of Imam-e-Zamana (ajtf).
                    </p>
                  ) : (
                    <p>
                      You can enroll online via our <Link href="/signup">Registration page</Link>,
                      or contact our team directly: Maulana Syed Asghar (0489 157 296), Br Ayser
                      (0431 562 150), Br Sadiq (0468 463 242), or Br Tanvir (0430 910 092). Our
                      team will be in touch to confirm your enrollment within 48 hours.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
