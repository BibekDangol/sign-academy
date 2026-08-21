import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import AuthContext from '../context/AuthContext'; // Default import



import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';

const AttendanceRecords = () => {
  const { authTokens } = useContext(AuthContext); // Access authTokens from the context
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(''); // State for selected email filter
  const [filters, setFilters] = useState({}); // State for filters
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [recordsPerPage] = useState(5); // Number of records per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/attendance-records/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        }
      });
      // Remove duplicates
      const uniqueRecords = removeDuplicates(response.data);
      setRecords(uniqueRecords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to remove duplicates
  const removeDuplicates = (data) => {
    const threshold = 60 * 1000; // 1 minute in milliseconds
    const uniqueRecords = data.filter((record, index, self) => {
      const currentIndexTime = new Date(record.login_time).getTime();
      const duplicateIndex = self.findIndex((r) =>
        Math.abs(new Date(r.login_time).getTime() - currentIndexTime) <= threshold
      );
      return duplicateIndex === index;
    });
    return uniqueRecords;
  };

  const handleEmailChange = (e) => {
    setSelectedEmail(e.target.value);
    setCurrentPage(1); // Reset current page when changing the filter
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1); // Reset current page when applying filters
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  const filteredRecords = currentRecords.filter((record) => {
    // Apply email filter
    if (selectedEmail && record.user_email !== selectedEmail) {
      return false;
    }
    // Apply other filters
    for (let key in filters) {
      if (filters[key] && record[key] !== parseInt(filters[key])) {
        return false;
      }
    }
    return true;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total number of pages
  const totalPages = Math.ceil(records.length / recordsPerPage);

  // Extract unique email addresses from records for dropdown options
  const uniqueEmails = Array.from(new Set(records.map(record => record.user_email)));

  return (
    <div className="bg-[url('./pages/img/image4.png')] min-h-screen pt-[100px] p-5" ><br />
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 style={{ textAlign: "center", marginLeft:"20px"}}>Attendance Records</h2><br />
        {/* Render filter options */}
        <div style={{ marginBottom: '20px', marginLeft: '20px' }}>
          <label style={{marginRight: '10px'}}>Filter by Email:</label>
          <Select value={selectedEmail} onChange={handleEmailChange}>
            <MenuItem value="">All</MenuItem>
            {uniqueEmails.map((email, index) => (
              <MenuItem key={index} value={email}>{email}</MenuItem>
            ))}
          </Select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <TableContainer component={Paper} style={{ margin: '0 auto', width: '100%' }}>
                <Table aria-label="attendance records table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold', border: '1px solid black' }}>User Id</TableCell>
                      <TableCell style={{ fontWeight: 'bold', border: '1px solid black' }}>Full Name</TableCell>
                      <TableCell style={{ fontWeight: 'bold', border: '1px solid black' }}>Email</TableCell>
                      <TableCell style={{ fontWeight: 'bold', border: '1px solid black' }}>Login Date</TableCell>
                      <TableCell style={{ fontWeight: 'bold', border: '1px solid black' }}>Login Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell style={{ border: '1px solid black' }}>{record.user}</TableCell>
                        <TableCell style={{ border: '1px solid black' }}>{record.user_full_name}</TableCell>
                        <TableCell style={{ border: '1px solid black' }}>{record.user_email}</TableCell>
                        <TableCell style={{ border: '1px solid black' }}>{record.login_time.split(' ')[0]}</TableCell>
                        <TableCell style={{ border: '1px solid black' }}>{record.login_time.split(' ')[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}><br />
                <Button variant="contained" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                <span style={{ margin: '0 20px', fontSize: '16px' }}>Page {currentPage} of {totalPages}</span>
                <Button variant="contained" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
