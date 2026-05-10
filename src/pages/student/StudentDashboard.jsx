import { Card } from "@/components/ui/card";
import { BookOpen, ClipboardList, CalendarCheck2, Award, Megaphone, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Subjects", to: "/student/subjects", icon: BookOpen },
  { label: "Exams", to: "/student/exams", icon: CalendarCheck2 },
  { label: "Assignments", to: "/student/assignments", icon: ClipboardList },
  { label: "Attendance", to: "/student/attendance", icon: CalendarCheck2 },
  { label: "Announcements", to: "/student/announcements", icon: Megaphone },
  { label: "Results", to: "/student/results", icon: Award },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground">Welcome back. Here’s your academic snapshot.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold text-foreground">87%</p>
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
              <p className="text-3xl font-bold text-foreground">3</p>
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
              <p className="text-3xl font-bold text-foreground">May 18</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <CalendarCheck2 className="w-6 h-6" />
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

