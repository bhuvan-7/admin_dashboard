import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import StudentSidebar from "./components/layout/StudentSidebar";
import TeacherSidebar from "./components/layout/TeacherSidebar";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentExams from "./pages/student/StudentExams";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherRequestStudent from "./pages/teacher/TeacherRequestStudent";
import api from "./lib/axios";
import { createAuthedWebSocket } from "./lib/ws";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
    },
  },
});

const ProtectedLayout = ({ children, onLogout, userRole, SidebarComponent = Sidebar }) => (
  <div className="min-h-screen bg-sidebar p-3">
    <div className="flex min-h-[calc(100vh-1.5rem)] bg-background rounded-xl overflow-hidden shadow-2xl">
      <SidebarComponent userRole={userRole} />
      <div className="flex-1 flex flex-col relative">
        <Topbar onLogout={onLogout} userRole={userRole} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  </div>
);

const getHomeRouteForRole = (roleId) => {
  if (roleId === "student") return "/student";
  if (roleId === "teacher") return "/teacher";
  return "/";
};

const AppShell = () => {
  const qc = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(() => localStorage.getItem("lms_user_role") || null);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lms_user_role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/auth/me");
        localStorage.setItem("lms_user_role", res.data.role);
        setUserRole(res.data.role);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("lms_user_role");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const ws = createAuthedWebSocket();
    if (!ws) return;

    ws.onmessage = (evt) => {
      try {
        JSON.parse(evt.data);
        qc.invalidateQueries({ queryKey: ["admin"] });
        qc.invalidateQueries({ queryKey: ["student"] });
        qc.invalidateQueries({ queryKey: ["teacher"] });
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [isAuthenticated, qc]);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to={getHomeRouteForRole(userRole)} replace /> : <Login onLogin={handleLogin} />
            }
          />

          {isAuthenticated ? (
            <>
              {userRole === "student" ? (
                <>
                  <Route path="/" element={<Navigate to="/student" replace />} />
                  <Route
                    path="/student"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentDashboard />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/subjects"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentSubjects />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/exams"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentExams />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/assignments"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentAssignments />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/attendance"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentAttendance />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/announcements"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentAnnouncements />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/results"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentResults />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/student/profile"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={StudentSidebar}>
                        <StudentProfile />
                      </ProtectedLayout>
                    }
                  />
                  <Route path="*" element={<Navigate to="/student" replace />} />
                </>
              ) : userRole === "teacher" ? (
                <>
                  <Route path="/" element={<Navigate to="/teacher" replace />} />
                  <Route
                    path="/teacher"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={TeacherSidebar}>
                        <TeacherDashboard />
                      </ProtectedLayout>
                    }
                  />
                  <Route
                    path="/teacher/request-student"
                    element={
                      <ProtectedLayout onLogout={handleLogout} userRole={userRole} SidebarComponent={TeacherSidebar}>
                        <TeacherRequestStudent />
                      </ProtectedLayout>
                    }
                  />
                  <Route path="*" element={<Navigate to="/teacher" replace />} />
                </>
              ) : (
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
              )}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppShell />
  </QueryClientProvider>
);

export default App;
