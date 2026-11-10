import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';

export default function useLearningData() {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ courses: [], lessons: [], lessonProgress: [] });

  useEffect(() => {
    let active = true;
    if (!user) return undefined;
    const load = async () => {
      try {
        const [courses, lessons, progress] = await Promise.all([
          api.get('courses/'), api.get('lessons/'), api.get('lesson-progress/'),
        ]);
        if (active) setData({ courses: courses.data, lessons: lessons.data, lessonProgress: progress.data });
      } catch (error) {
        if (active) console.error('Error loading learning data:', error);
      }
    };
    load();
    return () => { active = false; };
  }, [api, user]);

  return data;
}
