import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from '../pages/footer1';
import AuthContext from '../context/AuthContext';
import './CoursePage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Added

  const config = {
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonRes, progressRes] = await Promise.all([
          axios.get('http://localhost:8000/api/courses/', config),
          axios.get('http://localhost:8000/api/lessons/', config),
          axios.get('http://localhost:8000/api/lesson-progress/', config),
        ]);

        setCourses(courseRes.data);
        setLessons(lessonRes.data);

        const progressMap = {};
        progressRes.data.forEach(record => {
          if (record.completed) {
            progressMap[record.lesson] = { completed: true, id: record.id };
          }
        });
        setCompletedLessons(progressMap);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (authTokens) {
      fetchData();
    }
  }, [authTokens]);

  const toggleCompletion = async (lessonId) => {
    const isCompleted = completedLessons[lessonId]?.completed;
    const progressId = completedLessons[lessonId]?.id;

    try {
      const res = progressId
        ? await axios.patch(`http://localhost:8000/api/lesson-progress/${progressId}/`, {
            completed: !isCompleted,
          }, config)
        : await axios.post('http://localhost:8000/api/lesson-progress/', {
            lesson: lessonId,
            completed: true,
          }, config);

      setCompletedLessons((prev) => ({
        ...prev,
        [lessonId]: {
          completed: res.data.completed,
          id: res.data.id || progressId,
        },
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleAttendance = async (courseId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/course-attendance/',
        { course: courseId },
        config
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Attendance error:', error);
      alert('Failed to record attendance.');
    }
  };

  const getLessonCount = (courseId) =>
    lessons.filter((lesson) => lesson.course === courseId).length;

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedLessons = lessons.filter((l) => l.course === selectedCourseId);
  const completedCount = selectedLessons.filter((l) => completedLessons[l.id]?.completed).length;

  return (
    <div>
      <Navbar />
      <main className="main-wrapper">
        {selectedCourseId === null ? (
          courses.map((course) => {
            const lessonCount = getLessonCount(course.id);
            const courseCompletedCount = lessons.filter(
              (l) => l.course === course.id && completedLessons[l.id]?.completed
            ).length;

            return (
              <div className="course-card" key={course.id}>
                <div className="course-left">
                  <p className="course-label">COURSE</p>
                  <h2>{course.title}</h2>
                  <p className="chapters">Chapters</p>
                </div>
                <div className="course-right">
                  <p className="chapter-label">CHAPTERS: {lessonCount}</p>
                  <h3 className="course-description">{course.description}</h3>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${(courseCompletedCount / lessonCount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {courseCompletedCount}/{lessonCount} Lessons Completed
                  </p>
                  <button
                    className="continue-button"
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    Continue
                  </button>
                  <button
                    className="attendance-button"
                    onClick={() => handleAttendance(course.id)}
                  >
                    Course Attendance
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="course-detail">
            <h2>{selectedCourse.title} – Lessons</h2>
            <button onClick={() => setSelectedCourseId(null)}>← Back to Courses</button>
            {selectedLessons.map((lesson, index) => (
              <div className="lesson-card" key={lesson.id}>
                <div className="lesson-left">
                  <p className="lesson-label">LESSON</p>
                  <h3>{lesson.title}</h3>
                </div>
                <div className="lesson-right">
                  <p className="lesson-number">LESSON {index + 1}</p>
                  <p className="lesson-status">
                    {completedLessons[lesson.id]?.completed
                      ? 'You have completed this lesson.'
                      : 'This lesson is not completed yet.'}
                  </p>
                  <div className="lesson-actions">
                    <button
                      className="btn green"
                      onClick={() => toggleCompletion(lesson.id)}
                    >
                      {completedLessons[lesson.id]?.completed
                        ? 'Mark as Incomplete'
                        : 'Mark as Done'}
                    </button>
                    <button
                      className="btn blue"
                      onClick={() => navigate(`/course/${selectedCourse.id}/lesson/${lesson.id}`)}
                    >
                      Start
                    </button>
                  </div>
                  {/* <span className="lesson-time">4 min</span> */}
                  {completedLessons[lesson.id]?.completed && (
                    <span className="lesson-check">✔</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
