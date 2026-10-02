import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Dashboard from "../pages/Dashboard";
import ProjectDetails from "../pages/ProjectDetails";
import NotFound from "../pages/NotFound";

export const AppRoutes = ({ onOpenCreateProject }) => {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* 2. Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      </Route>

      {/* 3. Verification Route */}
      <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />

      {/* 4. Protected Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout onOpenCreateProject={onOpenCreateProject} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Route>
      </Route>

      {/* 5. Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;