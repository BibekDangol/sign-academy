import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from './Footer';

const Article = () => {
  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 });

  return (
    <animated.div style={{ 
      ...fade, 
      position: 'absolute', /* or use 'fixed' */
      top: '100px', /* Adjust based on your navbar height */
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%', /* Adjust as needed */
      maxWidth: '1000px',
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
    
      <div style={{ textAlign: 'center', marginBottom: '50px' }}><br /><br /><br /><br />
        <h1 style={{ fontSize: '6rem', marginBottom: '20px', color: '#333' }}>Accessible Learning for the Deaf</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#555' }}>
          Welcome to our Learning Management System designed for the Deaf community! 
          Enhance your knowledge through sign language-based courses and interactive resources.
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#555' }}>
          Unlock the power of accessible education. Learn sign language, improve communication skills, 
          and access inclusive learning materials tailored for the Deaf and hard-of-hearing.
        </p>
        <Button asChild className="h-auto rounded-full bg-[#0fb400] hover:bg-[#0bbf3a] px-[30px] py-5 text-lg text-white">
          <Link to="/dashboard">
            Get Started
          </Link>
        </Button>
      </div>

      <div style={{ padding: '0 40px', textAlign: 'center' }}>
        <animated.div style={{ ...fade, marginBottom: '50px' }}>
          <Card className="border-black bg-white shadow-none">
            <CardContent className="p-5">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>Why Inclusive Learning?</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
                Learning should be accessible to everyone. Our platform empowers Deaf learners 
                by providing visual learning experiences, sign language courses, and interactive content 
                that enhances understanding without relying on spoken language.
              </p>
            </CardContent>
          </Card>
        </animated.div>

        <animated.div style={{ ...fade, marginBottom: '50px' }}>
          <Card className="border-black bg-white shadow-none">
            <CardContent className="p-5">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>Can Deaf learners benefit from online education?</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
                Absolutely! With visual-based lessons, video courses in sign language, and interactive quizzes, 
                Deaf students can access knowledge without barriers. Our platform supports self-paced learning 
                tailored to individual needs.
              </p>
            </CardContent>
          </Card>
        </animated.div>

        <animated.div style={{ ...fade }}>
          <Card className="border-black bg-white shadow-none">
            <CardContent className="p-5">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>How is this different from traditional learning?</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
                Traditional learning methods often rely on spoken instruction, making them inaccessible to many Deaf learners. 
                Our LMS is built with inclusivity in mind, featuring sign language videos, subtitles, and interactive exercises 
                to ensure effective learning for everyone.
              </p>
            </CardContent>
          </Card>
        </animated.div>
      </div><br /><br /><br /><br />

      <Footer style={{ marginBottom: '-600px' }} />
    </animated.div>
  );
};

export default Article;
