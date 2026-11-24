import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { publicApi } from '../utils/api';
import useSubmission from '../hooks/useSubmission';
import './Home.css';

const emptyForm = { name: '', email: '', message: '' };

export default function Contacts() {
  const [contactData, setContactData] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const { submitting, run } = useSubmission();

  const handleChange = event => {
    setContactData(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setStatus(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    if (!contactData.name.trim() || !contactData.message.trim()) {
      setStatus({ ok: false, message: 'Please enter your name and message.' });
      return;
    }
    setStatus(null);
    await run(async () => {
      try {
        await publicApi.post('contact/', {
          name: contactData.name.trim(),
          email: contactData.email.trim(),
          message: contactData.message.trim(),
        });
        setStatus({ ok: true, message: 'Your message has been sent. Thank you for getting in touch!' });
        setContactData(emptyForm);
      } catch {
        setStatus({ ok: false, message: 'Your message could not be sent. Please try again.' });
      }
    });
  };

  return <PageLayout>
    <main className="home-content home-section contact contact-page">
      <header className="home-section-heading">
        <p className="home-section-eyebrow">We're here to help</p>
        <h1>Contact Us</h1>
        <p>Ask about our courses, get help getting started, or share your feedback.</p>
      </header>
      <form onSubmit={handleSubmit} aria-label="Contact us" aria-busy={submitting}>
        <div className="contact-field">
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" name="name" autoComplete="name" placeholder="Enter your name"
            value={contactData.name} onChange={handleChange} disabled={submitting} required />
        </div>
        <div className="contact-field">
          <Label htmlFor="contact-email">Email address</Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={contactData.email} onChange={handleChange} disabled={submitting} required />
        </div>
        <div className="contact-field">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea id="contact-message" name="message" placeholder="How can we help?" rows={5}
            value={contactData.message} onChange={handleChange} disabled={submitting} required />
        </div>
        <Button type="submit" disabled={submitting} className="contact-submit">
          {submitting ? 'Sending...' : 'Send message'}
        </Button>
        {status && <p role={status.ok ? 'status' : 'alert'} className={status.ok ? 'text-green-700' : 'text-red-700'}>{status.message}</p>}
      </form>
    </main>
  </PageLayout>;
}
