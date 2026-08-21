import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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
      <video className="w-full rounded-md" width="100%" height="auto" controls>
        <source src={getFullVideoUrl()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[1000px] mx-auto p-5">
        {loading ? (
          <p>Loading course and lesson details...</p>
        ) : course && lesson ? (
          <>
            <div>
              {renderVideoContent()}
            </div>

            <div className="mt-5">
              <h2>{lesson.title}</h2>
              <div className="flex flex-wrap gap-5 my-2.5 text-sm text-[#555]">
                <span>👥 {course.enrolled_users || '1,702'}</span>
                <span>👁️ {course.views || '1,503'}</span>
                <span>📅 {new Date(course.created_at).toLocaleDateString()}</span>
                <span>📚 Course: {course.title}</span>
              </div>
              <div className="mt-5 text-base leading-[1.6]">
                <p>{course.description}</p>
              </div>
            </div>

            <div className="mt-[50px] pt-5 border-t border-[#ccc]">
              <h3 className="mb-2.5">Leave a Review</h3>
              <form className="mb-[30px]" onSubmit={handleReviewSubmit}>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your thoughts about this lesson..."
                  rows="4"
                  className="w-full p-3 text-sm rounded border border-[#ccc] resize-y mb-2.5"
                  required
                />
                <Button type="submit" className="bg-[#007bff] text-white py-2 px-4 rounded cursor-pointer transition-colors duration-300 hover:bg-[#0056b3]">Submit Review</Button>
              </form>

              <h4 style={{ marginTop: '30px' }}>Reviews</h4>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <ul className="list-none pl-0 mt-5 flex flex-col gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="bg-white border border-[#e0e0e0] rounded-lg py-[15px] px-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-3 mb-2.5">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#007bff] text-white font-bold text-base">
                            {review.user?.username?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#222]">{review.user?.username || 'Anonymous'}</span>
                          <span className="text-xs text-[#777]">{new Date(review.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="m-0 text-[15px] leading-[1.6] text-[#444]">{review.text}</p>
                    </Card>
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
