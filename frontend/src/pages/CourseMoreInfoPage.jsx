import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import bgi from './img/image4.png';

const CourseMoreInfoPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`)
      .then(response => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details');
        setLoading(false);
      });
  
    axios.get(`http://127.0.0.1:8000/api/comments/?course_id=${courseId}`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [courseId]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
  
    const accessToken = JSON.parse(localStorage.getItem('authTokens'))?.access;
    if (!accessToken) {
      alert("Please log in to post a comment.");
      return;
    }
  
    axios.post(`http://127.0.0.1:8000/api/comments/`, {
      course: courseId,
      text: newComment
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setComments([response.data, ...comments]);
      setNewComment('');
    })
    .catch(error => {
      if (error.response?.status === 401) {
        alert('You must be logged in to post a comment.');
      } else {
        console.error('Error adding comment:', error);
      }
    });
  };
  

  if (loading) return <p className="text-center text-[1.3rem] text-white mt-[100px]">Loading course details...</p>;
  if (error) return <p className="text-center text-[1.3rem] text-white mt-[100px]">{error}</p>;

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col" style={{ backgroundImage: `url(${bgi})` }}>
      <Navbar />

      <div className="pt-[100px] px-5 pb-10 max-w-[1000px] mx-auto flex-1">
        <Typography variant="h3" className="text-center text-white text-2xl md:text-[2.5rem] font-bold mb-10 [text-shadow:2px_2px_6px_rgba(0,0,0,0.4)]">
          More Info: {course.title}
        </Typography>

        <Box className="mb-10">
          <ReactPlayer 
            url={course.video_url}
            controls
            width="100%"
            height="500px"
          />
        </Box>

        <div className="bg-white/90 p-4 md:p-[30px] rounded-[10px] shadow-[0px_4px_15px_rgba(0,0,0,0.1)]">
          <Typography variant="h5" className="font-bold mb-5 text-[#333] text-center">
            Recent Comments
          </Typography>

          {/* Comment List */}
          {comments.length === 0 ? (
            <Typography className="text-center text-[#777] mb-5">No comments yet. Be the first to comment!</Typography>
          ) : (
            comments.map((comment, index) => (
              <Card key={index} className="mb-[15px] bg-white/95">
                <CardContent>
                  <Typography variant="body1" className="text-[#444] text-base">
                    {comment.text}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}

          {/* Comment Form */}
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mt-5 mb-2.5"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            className="block ml-auto"
          >
            Post Comment
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseMoreInfoPage;
