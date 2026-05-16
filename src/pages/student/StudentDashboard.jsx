import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ClipboardList,
  CalendarDays,
  UserCheck,
  Award,
  Megaphone,
  TrendingUp,
  CalendarCheck2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

const quickLinks = [
  { label: "Subjects", to: "/student/subjects", icon: BookOpen, key: "subject_count" },
  { label: "Exams", to: "/student/exams", icon: CalendarDays, key: "upcoming_exam_count" },
  { label: "Assignments", to: "/student/assignments", icon: ClipboardList, key: "pending_assignment_count" },
  { label: "Attendance", to: "/student/attendance", icon: UserCheck, key: "attendance_percentage" },
  { label: "Announcements", to: "/student/announcements", icon: Megaphone, key: "announcement_count" },
  { label: "Results", to: "/student/results", icon: Award, key: "overall_result_percentage" },
];

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return String(d);
  }
};

const statusBadge = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "submitted") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  if (s === "graded") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const examStatusBadge = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  if (status === "Ongoing") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const labelStatus = (s) => {
  const x = (s || "pending").toLowerCase();
  return x.charAt(0).toUpperCase() + x.slice(1);
};

const formatCount = (key, data) => {
  if (!data) return "—";
  if (key === "attendance_percentage") return `${data.attendance_percentage}%`;
  if (key === "overall_result_percentage") {
    return data.overall_result_percentage != null ? `${data.overall_result_percentage}%` : "—";
  }
  return String(data[key] ?? "—");
};

const StudentDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "dashboard", "summary"],
    queryFn: async () => {
      const { data: d } = await api.get("/student/dashboard/summary");
      return d;
    },
  });

  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Could not load dashboard." : null;
  const profile = data?.profile;
  const nextExam = data?.recent_upcoming_exams?.[0];

  const statCards = data
    ? [
        { label: "Overall Attendance", value: `${data.attendance_percentage}%`, icon: TrendingUp },
        { label: "Pending Assignments", value: String(data.pending_assignment_count), icon: ClipboardList },
        { label: "Enrolled Subjects", value: String(data.subject_count), icon: BookOpen },
        {
          label: "Next Exam",
          value: nextExam ? formatDate(nextExam.exam_date) : "—",
          icon: CalendarDays,
          small: true,
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile
              ? `Welcome back, ${profile.full_name} — Class ${profile.class_name}, Roll ${profile.roll_no}.`
              : "Your academic overview from the LMS."}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/student/profile">My profile</Link>
        </Button>
      </div>

      {errMsg && (
        <Card className="p-4 border-destructive/50">
          <p className="text-sm text-destructive">{String(errMsg)}</p>
        </Card>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading dashboard…</p>}

      {data && !errMsg && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`font-bold text-foreground truncate ${stat.small ? "text-xl" : "text-3xl"}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted text-primary shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {data.overall_result_percentage != null && (
            <Card className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">Overall academic performance</p>
                <p className="text-sm text-muted-foreground mt-1">Published results across your subjects.</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground">{data.overall_result_percentage}%</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/student/results">
                    View results
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Pending assignments</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student/assignments">View all</Link>
                </Button>
              </div>
              {data.recent_pending_assignments?.length === 0 ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">No pending assignments.</Card>
              ) : (
                <div className="space-y-3">
                  {data.recent_pending_assignments.map((a) => (
                    <Card key={a.id} className="p-4 hover:shadow-md transition-all hover:border-primary">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{a.title}</p>
                          {a.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Due {a.due_date}
                          </p>
                        </div>
                        <Badge className={statusBadge(a.submission_status)} variant="secondary">
                          {labelStatus(a.submission_status)}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Upcoming exams</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student/exams">View all</Link>
                </Button>
              </div>
              {data.recent_upcoming_exams?.length === 0 ? (
                <Card className="p-6 text-center text-sm text-muted-foreground">No upcoming exams scheduled.</Card>
              ) : (
                <div className="space-y-3">
                  {data.recent_upcoming_exams.map((exam) => (
                    <Card key={exam.id} className="p-4 hover:shadow-md transition-all hover:border-primary">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">{exam.subject_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(exam.exam_date)} · {exam.venue}
                          </p>
                        </div>
                        <Badge className={examStatusBadge(exam.status)} variant="secondary">
                          {exam.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {data.recent_announcements?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Latest announcements</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student/announcements">View all</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {data.recent_announcements.map((a) => (
                  <Card key={a.id} className="p-4 hover:shadow-md transition-all hover:border-primary">
                    <p className="font-semibold text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Quick access</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} className="block">
                    <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground">{item.label}</p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {formatCount(item.key, data)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">Open {item.label.toLowerCase()}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {data.subject_count === 0 && (
            <Card className="p-6 border-dashed">
              <p className="text-sm text-muted-foreground">
                You are not enrolled in any subjects yet. Ask an admin to enroll you.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
