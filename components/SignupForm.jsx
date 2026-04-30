'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupForm() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    const body = {
      first_name: fd.get('first_name'),
      last_name:  fd.get('last_name'),
      email:      fd.get('email'),
      phone:      fd.get('phone'),
      age:        fd.get('age'),
      gender:     fd.get('gender'),
      message:    fd.get('message'),
    };
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        alert('There was a problem submitting the form. Please call us directly or try again.');
        setSubmitting(false);
      }
    } catch {
      alert('Network error. Please call us directly or try again.');
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="form-success visible">
        <div className="success-icon">🌿</div>
        <h3>Registration Received</h3>
        <p>
          Jazakallah Khair for registering. A member of our team will be in touch within 48 hours
          to confirm your enrollment. May Allah bless your journey of knowledge.
        </p>
        <Link href="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <p className="form-section-title">Personal Details</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="first_name">First Name *</label>
          <input type="text" id="first_name" name="first_name" required placeholder="Your first name" />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name *</label>
          <input type="text" id="last_name" name="last_name" required placeholder="Your last name" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input type="number" id="age" name="age" required min="5" max="80" />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select id="gender" name="gender" required defaultValue="">
            <option value="" disabled>Select…</option>
            <option value="Brother (Male)">Brother (Male)</option>
            <option value="Sister (Female)">Sister (Female)</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="message">Additional Message or Questions</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Any questions, special requirements, or additional information…"
        />
      </div>

      <div className="form-submit">
        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit Registration'}
        </button>
        <p className="form-note">
          Our team will contact you within 48 hours to confirm your place. Jazakallah Khair.
        </p>
      </div>
    </form>
  );
}
