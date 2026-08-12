import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Navbar from "../pages/Navbar"; // ✅ Adjust path as needed
import Footer from "../pages/footer1"; // ✅ Adjust path as needed
import "./pageStyles.css";

const ProgressPage = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonProgress, setLessonProgress] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    };

    const fetchData = async () => {
      try {
        const [coursesRes, lessonsRes, progressRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/courses/", config),
          axios.get("http://127.0.0.1:8000/api/lessons/", config),
          axios.get("http://127.0.0.1:8000/api/lesson-progress/", config),
        ]);

        setCourses(coursesRes.data);
        setLessons(lessonsRes.data);
        setLessonProgress(progressRes.data);
      } catch (error) {
        console.error("Error loading progress data:", error);
      }
    };

    if (authTokens) {
      fetchData();
    }
  }, [authTokens]);

  const calculateProgress = (courseId) => {
    const courseLessons = lessons.filter((lesson) => lesson.course === courseId);
    const total = courseLessons.length;
    const completed = courseLessons.filter((lesson) =>
      lessonProgress.find(
        (progress) => progress.lesson === lesson.id && progress.completed
      )
    ).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <>
      <Navbar /> {/* ✅ Added navbar */}
      <div className="container">
        <h1>User Progress</h1>
        {courses.map((course) => {
          const progressPercent = calculateProgress(course.id);
          return (
            <div key={course.id} className="progress-card">
              <h3>{course.title}</h3>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p>Progress: {progressPercent}%</p>
            </div>
          );
        })}
      </div>
      <Footer /> 
    </>
  );
};

export default ProgressPage;
