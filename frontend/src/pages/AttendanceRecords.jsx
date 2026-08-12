import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./footer1";

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  CircularProgress, TablePagination, Alert, Box, Divider,
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AttendanceRecords = () => {
  const { authTokens } = useContext(AuthContext);
  const [loginRecords, setLoginRecords] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (authTokens) {
      const decoded = jwtDecode(authTokens.access);
      setUser(decoded);
      fetchLoginAttendance(decoded.user_id);
      fetchCourseAttendance();
    }
  }, [authTokens]);

  const fetchLoginAttendance = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/attendance/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setLoginRecords(response.data || []);
    } catch (err) {
      console.error("Error fetching login attendance:", err);
      setError("Failed to fetch login attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/course-attendance/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setCourseAttendance(response.data || []);
    } catch (err) {
      console.error("Error fetching course attendance:", err);
    }
  };

  const formatDuration = (login, logout) => {
    if (!logout) return "Active";
    const diff = new Date(logout) - new Date(login);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: "95%", margin: "auto" }}>
        <Typography variant="h4" gutterBottom align="center">
          Your Attendance Records
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Login Attendance Records Table */}
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Login Attendance Records
            </Typography>
            {loginRecords.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Login Time</TableCell>
                        <TableCell>Logout Time</TableCell>
                        <TableCell>Duration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loginRecords
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{new Date(record.login_time).toLocaleString()}</TableCell>
                            <TableCell>
                              {record.logout_time
                                ? new Date(record.logout_time).toLocaleString()
                                : <span style={{ color: "green", fontWeight: "bold" }}>Active</span>}
                            </TableCell>
                            <TableCell>
                              {formatDuration(record.login_time, record.logout_time)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={loginRecords.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </>
            ) : (
              <Typography align="center" sx={{ mt: 2 }}>
                No login attendance records found.
              </Typography>
            )}

            <Divider sx={{ my: 5 }} />

          {/* Course Attendance Records Grouped by Course */}
<Typography variant="h5" gutterBottom align="center">
  Course Attendance Records
</Typography>

{courseAttendance.length > 0 ? (
  <TableContainer component={Paper}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Course Title</TableCell>
          <TableCell>Attendance Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {courseAttendance.map((record, index) => (
          <TableRow key={index}>
            <TableCell>{record.course_title}</TableCell>
            <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <Typography align="center" sx={{ mt: 2 }}>
    No course attendance records found.
  </Typography>
)}

          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default AttendanceRecords;
