import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

import { Login } from "@/pages/Auth/Login";
import { Register } from "@/pages/Auth/Register";
import { Dashboard } from "@/pages/Dashboard";
import { CreateEntry } from "@/pages/DiaryEntry/CreateEntry";
import { ViewEntry } from "@/pages/DiaryEntry/ViewEntry";
import { EditEntry } from "@/pages/DiaryEntry/EditEntry";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { initAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/create"
          element={
            <ProtectedRoute>
              <CreateEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/:id"
          element={
            <ProtectedRoute>
              <ViewEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/edit/:id"
          element={
            <ProtectedRoute>
              <EditEntry />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
