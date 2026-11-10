import React from 'react';

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import GuestRoute from './utils/GuestRoute';
import Forbidden from './pages/Forbidden';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import About1 from './pages/About1';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';
import DictionaryPage from './pages/DictonaryPage';
import CoursesPage from './pages/Courses';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonVideoPage from './pages/LessonVideoPage';
import ProgressPage from './pages/ProgressPage';
import HandSign from './pages/HandSign';  // Adjust path as needed
import HandSignStore from './pages/HandSignStore';
import Form from './pages/Form';
import NotFound from './pages/NotFound';
import CourseMoreInfoPage from './pages/CourseMoreInfoPage';
import Payment from './pages/Multipage/Payment';



// Protected Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AttendanceRecords from './pages/AttendanceRecords';
import LeaveApplication from './pages/LeaveApplication';
import All from './pages/All';
import Profile from './pages/Profile';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/about1" element={<About1 />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/handsign" element={<HandSign />} />
          <Route path="/handsignstore" element={<HandSignStore />} />
          <Route path="/form" element={<ProtectedRoute roles={['admin']}><Form /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/all" element={<ProtectedRoute roles={['admin']}><All /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><AttendanceRecords /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/course/:courseId/info" element={<CourseMoreInfoPage />} />
          <Route path="/lesson/:lessonId" element={<LessonVideoPage />} />


          <Route path="/forbidden" element={<ProtectedRoute><Forbidden /></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
