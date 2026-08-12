import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Navbar from './Navbar';

const LessonVideoPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/lessons/${lessonId}/`)
      .then(response => setLesson(response.data))
      .catch(err => console.error("Failed to load lesson", err));
  }, [lessonId]);

  if (!lesson) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <h2>{lesson.title}</h2>
      <ReactPlayer url={lesson.video_url} controls width="100%" height="500px" />
    </>
  );
};

export default LessonVideoPage;
