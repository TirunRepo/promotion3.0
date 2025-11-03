// AppRoutes.tsx
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { menuItems, type MenuItem } from "../menuConfig";
import Loading from "../common/Loading";
import ProtectedRoute from "../ProtectedRoute";
import Registration from "../components/Registration";
import Layout from "../Layout";
import Login from "../components/Login";
import { useAuth } from "../context/AuthContext";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  const currentRole :any= user?.role; // Assuming IAuthUser has a 'role' property

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {menuItems.map((item: MenuItem) => {
              if (!currentRole || !item.roles.includes(currentRole)) return null;

              if (item.children && item.children.length > 0) {
                return item.children.map((child) => {
                  if (!child.roles.includes(currentRole)) return null;
                  return <Route key={child.to} path={child.to} element={child.element} />;
                });
              }

              return <Route key={item.to} path={item.to} element={item.element} />;
            })}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
