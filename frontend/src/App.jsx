import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes onOpenCreateProject={() => setIsProjectModalOpen(true)} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}