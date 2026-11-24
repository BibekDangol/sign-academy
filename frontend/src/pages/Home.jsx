import PageLayout from '../components/layout/PageLayout';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import heroImage from './img/sign-language-online-hero.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import './Home.css';

const learnerStories = [
  {
    topic: 'A confident beginning',
    quote: 'Starting with the alphabet made sign language feel approachable. Being able to pause and replay each lesson helped me practise at my own pace.',
    initials: 'AS',
    learner: 'Aarav Sharma',
    course: 'Sign Language 101',
  },
  {
    topic: 'More everyday connections',
    quote: 'Practising greetings and simple questions gave me a place to start. Now I feel more comfortable introducing myself and keeping a short conversation going.',
    initials: 'ST',
    learner: 'Sujata Thapa',
    course: 'Everyday Conversations',
  },
  {
    topic: 'Understanding beyond the signs',
    quote: 'Learning about Deaf culture reminded me that communication is about more than hand movements. I pay more attention to eye contact, expression, and respect.',
    initials: 'RK',
    learner: 'Rohan Karki',
    course: 'Deaf Advocacy',
  },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(user ? '/courses' : '/login');
  };

  return (
    // <div className="[font-family:'Segoe_UI',sans-serif] text-[#222] bg-[#eeebeb]">
    <div>
      <PageLayout>

      {/* Hero Section */}
      <section className="bg-slate-900 bg-cover bg-center h-[90vh] flex items-center justify-center relative text-center text-white" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.5)), url("${heroImage}")` }}>
        <div className="w-[calc(100%-2rem)] max-w-[700px] p-4 md:p-12 rounded-[10px]">
          <h1 className="text-[3rem] mb-4 max-md:text-[2.5rem]" style={{ color: "white" }}>SIGN Academy</h1>
          <p className="text-[1.5rem] mb-8 max-md:text-[1.2rem]">Your path to mastering new skills starts here.</p>
          <Button size="lg" className="text-base hover:bg-brand-dark" onClick={handleStartLearning}>Start Learning</Button>
        </div>
      </section>

      {/* Main Content */}
      <main className="home-content">
        {/* Courses Section */}
        <section className="home-section courses-section" id="courses">
          <header className="home-section-heading">
            <p className="home-section-eyebrow">Build your confidence</p>
            <h2>Popular Courses</h2>
            <p>Learn your first signs, practise everyday conversations, and discover Deaf culture.</p>
          </header>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-center gap-8 p-8">
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://www.odro.co.uk/wp-content/uploads/2021/07/video-content-blog-header-.jpg" alt="Course 1" />
                <h3>Sign Language 101</h3>
                <p>Start with the alphabet, numbers, and simple greetings through visual lessons you can revisit.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://wp3-fatsomasites.imgix.net/uploads/sites/1156/2022/03/Two-people-using-sign-language.jpg?auto=format%2Ccompress" alt="Two people communicating through sign language" />
                <h3>Everyday Conversations</h3>
                <p>Put your signs into practice with introductions, simple questions, and useful everyday exchanges.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <img className="w-full rounded-lg mb-4" src="https://images.squarespace-cdn.com/content/v1/6310f29116612f02890aeae7/a401c9bf-a356-463e-b2b4-571621f8d44f/advocacy.jpg?format=1000w" alt="Course 3" />
                <h3>Deaf Advocacy</h3>
                <p>Explore Deaf identity, communication etiquette, and the role of advocacy in creating inclusive communities.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <hr></hr>
        {/* Categories Section */}
        <section className="home-section categories-section">
          <header className="home-section-heading">
            <p className="home-section-eyebrow">Find your starting point</p>
            <h2>Explore by category</h2>
            <p>Choose what you want to learn and take your next step toward more meaningful connections.</p>
          </header>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] justify-center gap-8 p-8">
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Sign Language Basics</h3>
                <p>Build a foundation with fingerspelling, numbers, and the first signs you can use every day.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Everyday Communication</h3>
                <p>Bring signs together to introduce yourself, ask questions, and connect with others.</p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] text-center transition-transform duration-300 hover:-translate-y-[5px]">
              <CardContent className="p-6">
                <h3>Deaf Culture & Community</h3>
                <p>Understand Deaf perspectives, respectful communication, and the importance of inclusion.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <hr></hr>
        {/* Testimonials Section */}
        <section className="home-section testimonials-section" aria-labelledby="testimonials-title">
          <header className="testimonials-heading">
            <p className="testimonials-eyebrow">Sample learner stories</p>
            <h2 id="testimonials-title">Small steps. Meaningful connections.</h2>
            <p>From your first signs to everyday conversations, every step opens a new way to connect.</p>
          </header>
          <div className="grid testimonials-grid">
            {learnerStories.map(story => (
              <Card className="testimonial-card" key={story.course}>
                <CardContent>
                  <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                  <h3>{story.topic}</h3>
                  <figure className="testimonial-story">
                    <blockquote><p>{story.quote}</p></blockquote>
                    <figcaption className="testimonial-author">
                      <span className="testimonial-avatar" aria-hidden="true">{story.initials}</span>
                      <div>
                        <p className="testimonial-name">{story.learner}</p>
                        <p className="testimonial-course">{story.course}</p>
                      </div>
                    </figcaption>
                  </figure>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <hr></hr>
      {/* Contact Us Section */}
      <section className="home-content home-section help-section" id="contact" aria-labelledby="help-title">
        <div className="help-content">
          <div>
            <h2 id="help-title">Need help?</h2>
            <p>Have a question about a course or need a hand getting started? Get in touch with us.</p>
          </div>
          <Button asChild className="help-link"><Link to="/contacts">Contact Us</Link></Button>
        </div>
      </section>

      </PageLayout>
    </div>
  );
};

export default Home;
