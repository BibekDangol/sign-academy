import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Navbar from "../pages/Navbar"; // ✅ Adjust path as needed
import Footer from "../pages/footer1"; // ✅ Adjust path as needed

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
      <div className="max-w-[900px] mx-auto text-center p-5">
        <h1 className="text-2xl md:text-[2rem] mb-5">User Progress</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {courses.map((course) => {
            const progressPercent = calculateProgress(course.id);
            return (
              <div key={course.id} className="bg-[#f9f9f9] p-[15px] rounded-[10px] w-full max-w-[300px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                <h3>{course.title}</h3>
                <div className="h-[6px] bg-[#e0e0e0] rounded-[3px] overflow-hidden mb-2">
                  <div className="h-[6px] bg-[#00acc1] rounded-[3px] transition-[width] duration-[400ms] ease-in-out" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p>Progress: {progressPercent}%</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer /> 
    </>
  );
};

export default ProgressPage;
