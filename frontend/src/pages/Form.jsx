import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import swal from 'sweetalert2';
import './New.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';

const LeaveList = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/leave/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLeaveList(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch leave list');
          showErrorAlert();
        }
      } catch (error) {
        console.error('Error:', error);
        showErrorAlert();
      }
    };
    if (authTokens) {
      fetchLeaveList();
    }
  }, [authTokens]);

  const showErrorAlert = () => {
    swal.fire({
      title: 'Failed to Fetch Leave List',
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/leave/${leaveId}/action/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Update the status in the leaveList state
        const updatedLeaveList = leaveList.map(leave => {
          if (leave.id === leaveId) {
            return { ...leave, status };
          }
          return leave;
        });
        setLeaveList(updatedLeaveList);
        swal.fire({
          title: 'Leave Status Updated Successfully',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        console.error('Failed to update leave status');
        swal.fire({
          title: 'Failed to Update Leave Status',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      swal.fire({
        title: 'Failed to Update Leave Status',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  return (
    <div style={{ padding: '20px', marginLeft: '-600px', width: "80%" }} className='new2'><br /><br /><br />
      <h2 style={{ textAlign: "center", fontSize: '24px' }}>Leave List</h2><br /><br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '0px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="leave list table">
            <TableHead style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>
              <TableRow>
                <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px', fontWeight:"bold" }}>Start Date</TableCell>
                <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px', fontWeight:"bold"}}>End Date</TableCell>
                <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px', fontWeight:"bold" }}>Reason</TableCell>
                <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px', fontWeight:"bold" }}>Status</TableCell>
                {user.email === 'admin@gmail.com' && <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveList.map((leave) => (
                <TableRow key={leave.id} style={{ backgroundColor: leave.status === 'PENDING' ? '#ede65c' : leave.status === 'APPROVED' ? '#7eeb44' : '#eb5a44' }}>
                  <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>{leave.start_date}</TableCell>
                  <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>{leave.end_date}</TableCell>
                  <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>{leave.reason}</TableCell>
                  <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>{leave.status}</TableCell>
                  {user.email === 'admin@gmail.com' && (
                    <TableCell style={{ textAlign: 'center', border: '1px solid #000', padding: '12px' }}>
                      <Select
                        value={leave.status}
                        onChange={(e) => handleUpdateStatus(leave.id, e.target.value)}
                        style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default LeaveList;
