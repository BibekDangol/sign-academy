import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children, roles}) => {
    const {user, loading} = useContext(AuthContext)
    const location = useLocation();

    if (loading) return null;

    if (!user){
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (roles && !roles.includes(user.role || 'student')) return <Navigate to="/forbidden" replace />;

    return children
}

export default ProtectedRoute
