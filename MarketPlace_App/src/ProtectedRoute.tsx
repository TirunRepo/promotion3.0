import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loading from "./common/Loading";

interface ProtectedRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles  }) => {
  const { user, isAuth, loading } = useAuth();

  if (loading) return <div><Loading/></div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
