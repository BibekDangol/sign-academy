import PageLayout from '../components/layout/PageLayout';
import useLearningData from '../hooks/useLearningData';
import React, { useEffect, useState } from "react";
import useAxios from '../utils/useAxios';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaArrowRight, FaBookOpen, FaCheck, FaRegCalendarCheck } from 'react-icons/fa';
import './Courses.css';

const CoursesPage = () => {
  const { courses, lessons, lessonProgress } = useLearningData();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const progressMap = {};
    lessonProgress.forEach(record => {
      if (record.completed) progressMap[record.lesson] = { completed: true, id: record.id };
    });
    setCompletedLessons(progressMap);
  }, [lessonProgress]);

  const toggleCompletion = async (lessonId) => {
    const isCompleted = completedLessons[lessonId]?.completed;
    const progressId = completedLessons[lessonId]?.id;

    try {
      const res = progressId
        ? await api.patch(
          `lesson-progress/${progressId}/`,
          {
            completed: !isCompleted,
          },
        )
        : await api.post(
          "lesson-progress/",
          {
            lesson: lessonId,
            completed: true,
          },
        );

      setCompletedLessons((prev) => ({
        ...prev,
        [lessonId]: {
          completed: res.data.completed,
          id: res.data.id || progressId,
        },
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleAttendance = async (courseId) => {
    try {
      const response = await api.post(
        "course-attendance/",
        { course: courseId },
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Attendance error:", error);
      alert("Failed to record attendance.");
    }
  };

  const getLessonCount = (courseId) =>
    lessons.filter((lesson) => lesson.course === courseId).length;

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedLessons = lessons.filter((l) => l.course === selectedCourseId);
  const completedCount = selectedLessons.filter(
    (l) => completedLessons[l.id]?.completed,
  ).length;

  const totalCompleted = lessons.filter(lesson => completedLessons[lesson.id]?.completed).length;
  const overallProgress = lessons.length ? Math.round(totalCompleted / lessons.length * 100) : 0;

  return <PageLayout>
    <main className="learning-page">
      <div className="learning-container">
        {selectedCourseId === null ? <>
          <header className="learning-welcome">
            <div className="learning-welcome-copy">
              <p className="learning-eyebrow">Your learning space</p>
              <h1>A little practice.<br />A world of connection.</h1>
              <p>Find your next lesson and keep building your confidence, one sign at a time.</p>
            </div>
            <div className="learning-overview">
              <div className="learning-ring" style={{ '--progress': `${overallProgress}%` }}>
                <span>{overallProgress}%</span>
              </div>
              <div><strong>Your progress</strong><p>{totalCompleted} of {lessons.length} lessons completed</p></div>
            </div>
          </header>

          <div className="learning-section-heading">
            <div><p className="learning-eyebrow">Keep exploring</p><h2>Your courses</h2></div>
            <span className="learning-count">{courses.length} {courses.length === 1 ? 'course' : 'courses'} available</span>
          </div>
          <div className="learning-course-grid">
            {courses.map((course, index) => {
              const lessonCount = getLessonCount(course.id);
              const done = lessons.filter(lesson => lesson.course === course.id && completedLessons[lesson.id]?.completed).length;
              const percent = lessonCount ? Math.round(done / lessonCount * 100) : 0;
              return <Card className={`learning-course learning-tone-${index % 3}`} key={course.id}>
                <div className="learning-course-cover">
                  <div className="learning-cover-meta">
                    <span className="learning-cover-label"><FaBookOpen aria-hidden="true" /> Course {String(index + 1).padStart(2, '0')}</span>
                    <span className="learning-status">{lessonCount > 0 && done === lessonCount ? 'Completed' : done ? 'In progress' : 'Ready to explore'}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} · Learn at your pace</p>
                  <span className="learning-cover-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="learning-course-body">
                  <p className="learning-description">{course.description}</p>
                  <div className="learning-progress-label"><span>{done} of {lessonCount} lessons completed</span><strong>{percent}%</strong></div>
                  <div className="learning-progress" role="progressbar" aria-label={`${course.title} progress`}
                    aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                    <div style={{ width: `${percent}%` }} />
                  </div>
                  <div className="learning-course-actions">
                    <Button variant="ghost" className="learning-attendance" onClick={() => handleAttendance(course.id)}>
                      <FaRegCalendarCheck aria-hidden="true" /> Attendance
                    </Button>
                    <Button className="learning-primary" onClick={() => setSelectedCourseId(course.id)}>
                      {done ? 'Continue learning' : 'Explore lessons'} <FaArrowRight aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>;
            })}
          </div>
        </> : <>
          <nav className="learning-breadcrumb" aria-label="Course navigation">
            <button type="button" onClick={() => setSelectedCourseId(null)}>All courses</button>
            <span aria-hidden="true">/</span><span aria-current="page">{selectedCourse?.title}</span>
          </nav>
          <header className="learning-welcome learning-lesson-welcome">
            <div className="learning-welcome-copy">
              <p className="learning-eyebrow">One step at a time</p>
              <h1>{selectedCourse?.title}</h1>
              <p>{selectedCourse?.description}</p>
            </div>
            <div className="learning-lesson-count"><strong>{completedCount}<span> / {selectedLessons.length}</span></strong><p>lessons completed</p></div>
          </header>
          <div className="learning-section-heading"><div><p className="learning-eyebrow">Your next steps</p><h2>Course lessons</h2></div></div>
          <div className="learning-lessons">
            {selectedLessons.length === 0 && <p className="learning-empty">Lessons will appear here when they are added to this course.</p>}
            {selectedLessons.map((lesson, index) => {
              const completed = Boolean(completedLessons[lesson.id]?.completed);
              return <Card className={`learning-lesson ${completed ? 'is-complete' : ''}`} key={lesson.id}>
                <span className="learning-lesson-number" aria-hidden="true">{completed ? <FaCheck /> : String(index + 1).padStart(2, '0')}</span>
                <div className="learning-lesson-details">
                  <p className="learning-eyebrow">Lesson {index + 1} <span>· {completed ? 'Completed' : 'Not completed'}</span></p>
                  <h3>{lesson.title}</h3>
                </div>
                <div className="learning-lesson-actions">
                  <Button variant="ghost" className="learning-completion" aria-pressed={completed} onClick={() => toggleCompletion(lesson.id)}>
                    {completed ? 'Mark incomplete' : 'Mark as done'}
                  </Button>
                  <Button className="learning-primary" onClick={() => navigate(`/course/${selectedCourse.id}/lesson/${lesson.id}`)}>
                    {completed ? 'Review' : 'Start lesson'} <FaArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </Card>;
            })}
          </div>
        </>}
      </div>
    </main>
  </PageLayout>;
};

export default CoursesPage;
