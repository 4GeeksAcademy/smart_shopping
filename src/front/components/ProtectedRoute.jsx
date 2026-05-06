import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, roleRequired }) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) return <Navigate to="/login" />;

    if (roleRequired && role !== roleRequired) {
        return <Navigate to="/" />;
    }

    return children;
};