import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);

  const config = {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  };

  const fetchCourseAndLesson = async () => {
    try {
      const [courseRes, lessonRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/courses/${courseId}/`, config),
        axios.get(`http://localhost:8000/api/lessons/${lessonId}/`, config),
      ]);
      setCourse(courseRes.data);
      setLesson(lessonRes.data);
    } catch (error) {
      console.error('Error loading course or lesson:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/comments/?lesson=${lessonId}`, config);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/comments/',
        {
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
          text: reviewText,
        },
        config
      );
      setReviewText('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  useEffect(() => {
    if (authTokens) {
      setLoading(true);
      fetchCourseAndLesson()
        .then(fetchReviews)
        .finally(() => setLoading(false));
    }
  }, [authTokens, courseId, lessonId]);

  const getFullVideoUrl = () => lesson?.video_url || '';

  const convertYoutubeUrl = (url) => {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    const params = new URLSearchParams(new URL(url).search);
    return `https://www.youtube.com/embed/${params.get('v')}`;
  };

  const renderVideoContent = () => {
    if (!lesson?.video_url) {
      return <p style={{ textAlign: 'center' }}>Video not available.</p>;
    }

    if (lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be')) {
      return (
        <iframe
          width="100%"
          height="400"
          src={convertYoutubeUrl(lesson.video_url)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Lesson Video"
        />
      );
    }

    return (
      <video width="100%" height="auto" controls>
        <source src={getFullVideoUrl()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="course-detail-container">
        {loading ? (
          <p>Loading course and lesson details...</p>
        ) : course && lesson ? (
          <>
            <div className="video-banner">
              {renderVideoContent()}
            </div>

            <div className="video-meta">
              <h2>{lesson.title}</h2>
              <div className="stats-bar">
                <span>👥 {course.enrolled_users || '1,702'}</span>
                <span>👁️ {course.views || '1,503'}</span>
                <span>📅 {new Date(course.created_at).toLocaleDateString()}</span>
                <span>📚 Course: {course.title}</span>
              </div>
              <div className="course-description">
                <p>{course.description}</p>
              </div>
            </div>

            <div className="review-section">
              <h3>Leave a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your thoughts about this lesson..."
                  rows="4"
                  className="review-textarea"
                  required
                />
                <button type="submit" className="btn blue">Submit Review</button>
              </form>

              <h4 style={{ marginTop: '30px' }}>Reviews</h4>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <ul className="review-list">
                  {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                      <div className="review-user">
                        <div className="review-user-avatar">
                          {review.user?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="review-user-info">
                          <span className="username">{review.user?.username || 'Anonymous'}</span>
                          <span className="date">{new Date(review.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <p>{review.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p>Unable to load course and lesson details.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
