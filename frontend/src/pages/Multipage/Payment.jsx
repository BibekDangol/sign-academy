import React, { useState, useEffect } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Paper,
  Box, Grid, Typography, Modal, Radio, RadioGroup, FormControl, FormLabel,
  InputLabel, MenuItem, Select
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import '../Multipage/Payment.css'; // Make sure this exists

const defaultTheme = createTheme();

export default function PaymentForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [mode, setMode] = useState('');
  const [location, setLocation] = useState('');
  const [examDate, setExamDate] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [courses, setCourses] = useState([]);
  const [isRequiredEmpty, setIsRequiredEmpty] = useState(false);

  const paymentAmount = 1000;

  useEffect(() => {
    fetch('http://localhost:8000/api/courses/')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    const selectedCourse = courses.find(c => c.id === selectedId);
    setCourseId(selectedId);
    setSelectedCourseTitle(selectedCourse?.title || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !courseId || !mode || (mode === 'Onsite' && !location) || !examDate) {
      setIsRequiredEmpty(true);
      return;
    }
    setIsRequiredEmpty(false);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handlePayNow = () => {
    toast.success('Payment successful');
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    let content = `
    COURSE REGISTRATION SYSTEM

    Name: ${name}
    Course: ${selectedCourseTitle}
    Payment Mode: ${mode}
    ${mode === 'Onsite' ? `Location: ${location}` : ''}
    Exam Date: ${examDate}
    Payment Amount: ${paymentAmount}
    Account Number: ${accountNumber}
    Phone Number: ${phoneNumber}

    Thank you for registering!
    Good luck with your assessment.

    Assessment Rules:
    - One attempt only
    - Duration: 180 minutes
    - Maximum Marks: 100
    - Pass Mark: 40
    - Certificate on passing
    `;
    doc.text(content, 10, 10);
    doc.save('receipt.pdf');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" className="payment-form-container">
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} className="form-box">
          <Box className="form-inner">
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registration and Payment
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField fullWidth required label="Name" value={name} onChange={(e) => setName(e.target.value)} error={isRequiredEmpty && !name} />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={courseId}
                  onChange={handleCourseChange}
                  error={isRequiredEmpty && !courseId}
                >
                  <MenuItem value="" disabled>Select Course</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Mode</InputLabel>
                <Select value={mode} onChange={(e) => setMode(e.target.value)} error={isRequiredEmpty && !mode}>
                  <MenuItem value="" disabled>Select Mode</MenuItem>
                  <MenuItem value="Onsite">Onsite</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                </Select>
              </FormControl>

              {mode === 'Onsite' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Location</InputLabel>
                  <Select value={location} onChange={(e) => setLocation(e.target.value)} error={isRequiredEmpty && !location}>
                    <MenuItem value="" disabled>Select Location</MenuItem>
                    <MenuItem value="Kathmandu">Kathmandu</MenuItem>
                    <MenuItem value="Dang">Dang</MenuItem>
                    <MenuItem value="Butwal">Butwal</MenuItem>
                    <MenuItem value="Sarlahi">Sarlahi</MenuItem>
                    <MenuItem value="Chitwan">Chitwan</MenuItem>
                    <MenuItem value="Pokhara">Pokhara</MenuItem>
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth required type="date"
                label="Exam Date" InputLabelProps={{ shrink: true }}
                value={examDate} onChange={(e) => setExamDate(e.target.value)}
                error={isRequiredEmpty && !examDate}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth label="Payment Amount" value={paymentAmount}
                InputProps={{ readOnly: true }} sx={{ mt: 2 }}
              />

              <FormControlLabel control={<Checkbox value="acceptTerms" color="primary" />} label="I agree to the terms and conditions" sx={{ mt: 2 }} />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Select Payment Method
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box className="payment-modal">
          <Typography variant="h6" gutterBottom>Payment Details</Typography>
          <Typography>Name: {name}</Typography>
          <Typography>Course: {selectedCourseTitle}</Typography>
          {mode === 'Onsite' && <Typography>Location: {location}</Typography>}
          <Typography>Exam Date: {examDate}</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel>Payment Method</FormLabel>
            <RadioGroup value={mode} onChange={(e) => setMode(e.target.value)}>
              <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
              <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
              <FormControlLabel value="Bank Transfer" control={<Radio />} label="Bank Transfer" />
            </RadioGroup>
          </FormControl>

          <TextField fullWidth required label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} sx={{ mt: 2 }} />
          <TextField fullWidth required label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} sx={{ mt: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={handlePayNow} variant="contained">Pay Now</Button>
            <Button onClick={generateReceipt} variant="outlined">Generate Receipt</Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </ThemeProvider>
  );
}
