import { useState, useEffect } from "react";
import FeesCard from "@/components/dashboard/FeesCard";
import ActiveUsersChart from "@/components/dashboard/ActiveUsersChart";
import NotificationPopup from "@/components/dashboard/NotificationPopup";
import { Card } from "@/components/ui/card";
import { Users, GraduationCap, UserCircle } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Students", value: "245", icon: GraduationCap, color: "text-primary" },
    { label: "Total Teachers", value: "32", icon: Users, color: "text-secondary" },
    { label: "Total Parents", value: "198", icon: UserCircle, color: "text-accent" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with axios call
    // Example:
    // const fetchDashboardStats = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get('/api/dashboard/stats');
    //     setStats(response.data);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <NotificationPopup />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome! Here's a snapshot of your LMS.</p>
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
        <FeesCard />
        <ActiveUsersChart />
      </div>
    </div>
  );
};

export default Dashboard;
