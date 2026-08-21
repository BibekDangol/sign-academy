import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "../pages/footer1";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
          axios.get("http://localhost:8000/api/courses/", config),
          axios.get("http://localhost:8000/api/lessons/", config),
          axios.get("http://localhost:8000/api/lesson-progress/", config),
        ]);

        setCourses(courseRes.data);
        setLessons(lessonRes.data);

        const progressMap = {};
        progressRes.data.forEach((record) => {
          if (record.completed) {
            progressMap[record.lesson] = { completed: true, id: record.id };
          }
        });
        setCompletedLessons(progressMap);
      } catch (error) {
        console.error("Error loading data:", error);
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
        ? await axios.patch(
            `http://localhost:8000/api/lesson-progress/${progressId}/`,
            {
              completed: !isCompleted,
            },
            config,
          )
        : await axios.post(
            "http://localhost:8000/api/lesson-progress/",
            {
              lesson: lessonId,
              completed: true,
            },
            config,
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
      const response = await axios.post(
        "http://localhost:8000/api/course-attendance/",
        { course: courseId },
        config,
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

  return (
    <div>
      <Navbar />
      <main className="py-5 bg-[#f4f4f4] min-h-[calc(100vh-200px)]">
        {selectedCourseId === null ? (
          courses.map((course) => {
            const lessonCount = getLessonCount(course.id);
            const courseCompletedCount = lessons.filter(
              (l) =>
                l.course === course.id && completedLessons[l.id]?.completed,
            ).length;

            return (
              <Card
                className="flex flex-col md:flex-row bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden my-6 mx-auto max-w-[95%] [font-family:'Segoe_UI',sans-serif] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.15)]"
                key={course.id}
              >
                <div className="bg-[#00acc1] p-4 md:p-[30px] w-full md:w-[30%] text-white flex flex-col justify-center text-left">
                  <p className="font-semibold text-sm tracking-[1px] uppercase mb-3">
                    COURSE
                  </p>
                  <h2 className="text-xl md:text-[26px] leading-[1.2] mb-2">
                    {course.title}
                  </h2>
                  <p className="text-base font-light">Chapters</p>
                </div>
                <div className="bg-white p-4 md:p-[30px] w-full md:w-[70%] flex flex-col justify-between">
                  <p className="text-[#00acc1] font-bold text-sm mb-[5px]">
                    CHAPTERS: {lessonCount}
                  </p>
                  <h3 className="text-lg text-[#333333] leading-[1.5] mb-5">
                    {course.description}
                  </h3>
                  <div className="h-1.5 bg-[#e0e0e0] rounded-[3px] overflow-hidden mb-2">
                    <div
                      className="h-1.5 bg-[#00acc1] rounded-[3px] transition-[width] duration-[400ms] ease-in-out"
                      style={{
                        width: `${(courseCompletedCount / lessonCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#666] self-end">
                    {courseCompletedCount}/{lessonCount} Lessons Completed
                  </p>
                  <Button
                    className="bg-[#00acc1] text-white py-2.5 px-6 text-base font-medium rounded-[30px] cursor-pointer transition-colors duration-300 self-end mt-2.5 hover:bg-[#008ba3]"
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    Continue
                  </Button>
                  <Button
                    className="mt-2.5 bg-[#f0ad4e] text-white py-2.5 px-[15px] cursor-pointer rounded-[5px] font-bold hover:bg-[#ec971f]"
                    onClick={() => handleAttendance(course.id)}
                  >
                    Course Attendance
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 md:p-[30px] my-5 mx-auto max-w-[90%] [font-family:'Segoe_UI',sans-serif] transition-all duration-300">
            <h2 className="text-xl md:text-[26px] mb-5 text-[#00acc1]">
              {selectedCourse.title} – Lessons
            </h2>
            <Button
              className="bg-[#00acc1] text-white py-2.5 px-[18px] text-sm rounded-[20px] cursor-pointer mb-5 transition-colors duration-300 hover:bg-[#008ba3]"
              onClick={() => setSelectedCourseId(null)}
            >
              ← Back to Courses
            </Button>
            {selectedLessons.map((lesson, index) => (
              <Card
                className="flex flex-col md:flex-row rounded-xl overflow-hidden my-5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] [font-family:'Segoe_UI',sans-serif]"
                key={lesson.id}
              >
                <div className="bg-[#4dd0e1] text-white p-5 w-full md:w-[35%] flex flex-col justify-center">
                  <p className="text-sm uppercase mb-2">LESSON</p>
                  <h3 className="text-lg md:text-[22px] leading-[1.2]">
                    {lesson.title}
                  </h3>
                </div>
                <div className="p-5 w-full md:w-[65%] relative">
                  <p className="text-sm text-[#4dd0e1] font-bold mb-2">
                    LESSON {index + 1}
                  </p>
                  <p className="text-base mb-5">
                    {completedLessons[lesson.id]?.completed
                      ? "You have completed this lesson."
                      : "This lesson is not completed yet."}
                  </p>
                  <div className="flex gap-2.5 mb-2.5">
                    <Button
                      className="bg-[#66bb6a] text-white py-2.5 px-[18px] rounded-[20px] text-sm cursor-pointer mb-5 transition-colors duration-300 hover:bg-[#43a047]"
                      onClick={() => toggleCompletion(lesson.id)}
                    >
                      {completedLessons[lesson.id]?.completed
                        ? "Mark as Incomplete"
                        : "Mark as Done"}
                    </Button>
                    <Button
                      className="bg-[#4dd0e1] text-white py-2.5 px-[18px] rounded-[20px] text-sm cursor-pointer mb-5 transition-colors duration-300 hover:bg-[#00acc1]"
                      onClick={() =>
                        navigate(
                          `/course/${selectedCourse.id}/lesson/${lesson.id}`,
                        )
                      }
                    >
                      Start
                    </Button>
                  </div>
                  {/* <span className="lesson-time">4 min</span> */}
                  {completedLessons[lesson.id]?.completed && (
                    <span className="absolute top-[14px] right-5 text-[#4caf50] text-2xl">
                      ✔
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
