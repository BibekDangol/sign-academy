// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CommentsPage = () => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Replace with the actual token

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/comments/", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => setComments(response.data))
//       .catch(() => console.error("Error loading comments"));
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post(
//         "http://127.0.0.1:8000/api/comments/",
//         { text: newComment },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((response) => setComments([...comments, response.data]))
//       .catch(() => console.error("Error adding comment"));

//     setNewComment("");
//   };

//   return (
//     <div className="container">
//       <h1>Comments</h1>
//       {comments.map((comment) => (
//         <div key={comment.id} className="comment-card">
//           <p>{comment.text}</p>
//         </div>
//       ))}
//       <form onSubmit={handleSubmit} className="comment-form">
//         <input
//           type="text"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//         />
//         <button type="submit" className="btn">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default CommentsPage;
