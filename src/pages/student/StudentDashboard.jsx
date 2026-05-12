import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, ClipboardList, CalendarDays, UserCheck, Award, Megaphone, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

const quickLinks = [
  { label: "Subjects", to: "/student/subjects", icon: BookOpen },
  { label: "Exams", to: "/student/exams", icon: CalendarDays },
  { label: "Assignments", to: "/student/assignments", icon: ClipboardList },
  { label: "Attendance", to: "/student/attendance", icon: UserCheck },
  { label: "Announcements", to: "/student/announcements", icon: Megaphone },
  { label: "Results", to: "/student/results", icon: Award },
];

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(0) : "0");

const StudentDashboard = () => {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [at, as, ex] = await Promise.all([
          api.get("/student/attendance"),
          api.get("/student/assignments"),
          api.get("/student/exams"),
        ]);
        if (cancelled) return;
        setAttendanceRows(at.data || []);
        setAssignments(as.data || []);
        setExams(ex.data || []);
      } catch {
        if (!cancelled) {
          setAttendanceRows([]);
          setAssignments([]);
          setExams([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const overallAttendance = useMemo(() => {
    const total = attendanceRows.reduce((s, r) => s + (r.total || 0), 0);
    const present = attendanceRows.reduce((s, r) => s + (r.present || 0), 0);
    return pct(present, total);
  }, [attendanceRows]);

  const pendingAssignments = useMemo(
    () => assignments.filter((a) => (a.submission_status || "").toLowerCase() === "pending").length,
    [assignments],
  );

  const nextExamLabel = useMemo(() => {
    if (!exams.length) return "—";
    const sorted = [...exams].sort((a, b) => String(a.exam_date).localeCompare(String(b.exam_date)));
    const d = sorted[0]?.exam_date;
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return String(d);
    }
  }, [exams]);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground">Snapshot from the same API as your detail pages.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold text-foreground">{overallAttendance}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Assignments</p>
              <p className="text-3xl font-bold text-foreground">{pendingAssignments}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next Exam</p>
              <p className="text-3xl font-bold text-foreground">{nextExamLabel}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Quick Access</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="block">
                <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">Open {item.label.toLowerCase()}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
