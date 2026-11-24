import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import AuthContext from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import './About.css';

const highlights = [
  {
    label: 'See it. Practise it.',
    title: 'Visual learning',
    description: 'Follow video demonstrations, pause to study a sign, and revisit lessons as you build confidence at your own pace.',
  },
  {
    label: 'Make it part of your day.',
    title: 'Everyday communication',
    description: 'Start with greetings and introductions, then practise questions and useful signs for the conversations that matter to you.',
  },
  {
    label: 'Connect with understanding.',
    title: 'Deaf culture',
    description: 'Explore Deaf perspectives, communication etiquette, and the importance of respect and inclusion alongside your signing skills.',
  },
];

export default function About() {
  const { user } = useContext(AuthContext);

  return <PageLayout>
    <main className="about-page">
      <div className="about-container">
        <header className="about-intro">
          <p className="about-eyebrow">About Sign Academy</p>
          <h1>Learn to sign.<br />Connect with confidence.</h1>
          <p className="about-description">
            Sign Academy helps learners build sign language skills through visual lessons and everyday practice.
            Our aim is to make learning approachable and encourage respectful connections with the Deaf community.
          </p>
        </header>

        <section className="about-learning" aria-labelledby="about-learning-title">
          <div className="about-section-heading">
            <h2 id="about-learning-title">More than learning a new skill</h2>
            <p>Build a foundation in signing, put it into practice, and understand the community behind the language.</p>
          </div>
          <div className="about-highlights">
            {highlights.map(highlight => (
              <Card className="about-highlight" key={highlight.title}>
                <CardContent>
                  <p className="about-highlight-label">{highlight.label}</p>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="about-next-step" aria-labelledby="about-next-title">
          <div>
            <h2 id="about-next-title">Your first signs are a start.</h2>
            <p>Take the next step toward clearer communication and meaningful connections.</p>
          </div>
          <div className="about-actions">
            <Button asChild className="about-course-link">
              <Link to={user ? '/courses' : '/login'} state={user ? undefined : { from: '/courses' }}>Explore Courses</Link>
            </Button>
            <p>Have questions? <Link to="/contacts">Contact Us</Link></p>
          </div>
        </section>
      </div>
    </main>
  </PageLayout>;
}
