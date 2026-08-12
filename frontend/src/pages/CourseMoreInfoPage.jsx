import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import bgi from './img/image4.png';
import './CourseMoreInfoPage.css'; // Create this CSS file

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
  

  if (loading) return <p className="loading">Loading course details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="course-more-info-page" style={{ backgroundImage: `url(${bgi})` }}>
      <Navbar />

      <div className="content-wrapper">
        <Typography variant="h3" className="course-title">
          More Info: {course.title}
        </Typography>

        <Box className="video-container">
          <ReactPlayer 
            url={course.video_url}
            controls
            width="100%"
            height="500px"
          />
        </Box>

        <div className="comment-section">
          <Typography variant="h5" className="comment-heading">
            Recent Comments
          </Typography>

          {/* Comment List */}
          {comments.length === 0 ? (
            <Typography className="no-comments">No comments yet. Be the first to comment!</Typography>
          ) : (
            comments.map((comment, index) => (
              <Card key={index} className="comment-card">
                <CardContent>
                  <Typography variant="body1" className="comment-text">
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
            className="comment-input"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddComment}
            className="post-button"
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
