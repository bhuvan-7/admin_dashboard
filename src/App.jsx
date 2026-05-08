import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import AddTeacher from "./pages/AddTeacher";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Parents from "./pages/Parents";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import Announcements from "./pages/Announcements";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children, onLogout, userRole }) => (
  <div className="min-h-screen bg-sidebar p-3">
    <div className="flex min-h-[calc(100vh-1.5rem)] bg-background rounded-xl overflow-hidden shadow-2xl">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar onLogout={onLogout} userRole={userRole} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("lms_user_role");
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("lms_user_role") || null;
  });

  const handleLogin = (role) => {
    localStorage.setItem("lms_user_role", role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("lms_user_role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login Route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Dashboard />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/requests"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Requests />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/add-teacher"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <AddTeacher />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Teachers />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/students"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Students />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/parents"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Parents />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/subjects"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Subjects />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Attendance />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Results />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/announcements"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <Announcements />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="*"
                  element={
                    <ProtectedLayout onLogout={handleLogout} userRole={userRole}>
                      <div className="text-center p-6">Page not found</div>
                    </ProtectedLayout>
                  }
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
