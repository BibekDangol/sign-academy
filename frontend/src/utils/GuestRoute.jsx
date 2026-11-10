import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { safeReturnPath } from './authRedirect';

export default function GuestRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return null;
  return user ? <Navigate to={safeReturnPath(location.state?.from)} replace /> : children;
}
