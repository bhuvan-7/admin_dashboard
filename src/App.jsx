import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-sidebar p-3">
          <div className="flex min-h-[calc(100vh-1.5rem)] bg-background rounded-xl overflow-hidden shadow-2xl">
            <Sidebar />
            <div className="flex-1 flex flex-col relative">
              <Topbar />
              <main className="flex-1 p-6 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/add-teacher" element={<AddTeacher />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/parents" element={<Parents />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

