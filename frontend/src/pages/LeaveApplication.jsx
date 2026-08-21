import React, { useState, useContext } from 'react';
import swal from 'sweetalert2';
import AuthContext from '../context/AuthContext'; // Importing AuthContext
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
    <div className="min-h-screen pt-[100px] bg-[url('./pages/img/image4.png')]">
      <div className="mx-auto w-full max-w-[1000px] px-4">
        <h2 style={{textAlign:'center'}}>Apply for Leave</h2><br /><br />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>User Id:</Label>
            <Input type="text" name="user" value={formData.user} onChange={handleInputChange} required className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>Start Date:</Label>
            <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>End Date:</Label>
            <Input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>Reason:</Label>
            <Textarea name="reason" className="w-full max-w-[930px] h-[80px]" value={formData.reason} onChange={handleInputChange} required />
          </div>
          <center><Button type="submit" className="bg-[#0fb400] hover:bg-[#0bbf3a] text-white">Apply</Button></center>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplication;
