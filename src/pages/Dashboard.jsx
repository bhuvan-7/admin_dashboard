import { useQuery } from "@tanstack/react-query";
import LmsOverviewCard from "@/components/dashboard/FeesCard";
import ActiveUsersChart from "@/components/dashboard/ActiveUsersChart";
import NotificationPopup from "@/components/dashboard/NotificationPopup";
import { Card } from "@/components/ui/card";
import { Users, GraduationCap, UserCircle } from "lucide-react";
import api from "@/lib/axios";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const { data: d } = await api.get("/admin/dashboard/stats");
      return d;
    },
  });

  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Could not load dashboard stats." : null;

  const stats = [
    { label: "Total Students", value: data ? String(data.total_students) : "—", icon: GraduationCap, color: "text-primary" },
    { label: "Total Teachers", value: data ? String(data.total_teachers) : "—", icon: Users, color: "text-secondary" },
    { label: "Total Parents", value: data ? String(data.total_parents) : "—", icon: UserCircle, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <NotificationPopup
        pendingStudent={data?.pending_student_requests ?? 0}
        pendingTeacher={data?.pending_teacher_requests ?? 0}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Live snapshot from the API. Updates when you receive realtime events.</p>
        {errMsg && <p className="text-sm text-destructive mt-2">{errMsg}</p>}
        {isLoading && <p className="text-sm text-muted-foreground mt-2">Loading stats…</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <LmsOverviewCard stats={data} loading={isLoading} error={errMsg} />
        <ActiveUsersChart stats={data} loading={isLoading} error={errMsg} />
      </div>
    </div>
  );
};

export default Dashboard;
