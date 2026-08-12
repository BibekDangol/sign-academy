import React, { useState, useContext } from 'react';
import swal from 'sweetalert2';
import AuthContext from '../context/AuthContext'; // Importing AuthContext
import './New.css';

const LeaveApplication = () => {
  const { authTokens } = useContext(AuthContext); // Accessing authTokens from AuthContext
  const [formData, setFormData] = useState({
    user: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/apply-leave/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}` 
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        swal.fire({
          title: 'Leave Applied Successfully',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        const data = await response.json();
        console.error('Error:', data);
        swal.fire({
          title: 'Failed to Apply Leave',
          text: data.detail,
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      swal.fire({
        title: 'Failed to Apply Leave',
        text: 'An error occurred',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className='hlo'>
      <h2 style={{paddingLeft:'650px'}}>Apply for Leave</h2><br /><br />
      <form onSubmit={handleSubmit} style={{paddingLeft:'300px', paddingRight:'300px'}}>
        <div>
          <label>User Id:</label>
          <input type="text" name="user" value={formData.user} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Reason:</label>
          <textarea name="reason" class="custom-textarea" value={formData.reason} onChange={handleInputChange} required></textarea>
        </div><br />
        <center><button type="submit">Apply</button></center>
      </form>
    </div>
  );
};

export default LeaveApplication;
