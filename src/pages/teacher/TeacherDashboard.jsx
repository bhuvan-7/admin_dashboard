import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, UserPlus } from "lucide-react";
import api from "@/lib/axios";

const TeacherDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["teacher", "dashboard", "summary"],
    queryFn: async () => {
      const { data: d } = await api.get("/teacher/dashboard/summary");
      return d;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["teacher", "student-requests"],
    queryFn: async () => {
      const { data: d } = await api.get("/teacher/student-requests");
      return d;
    },
  });

  const errMsg = error?.response?.data?.detail || error?.message;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Teacher dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Request new students for classes you teach. Admins approve requests and accounts are created automatically.
        </p>
        {errMsg && <p className="text-sm text-destructive mt-2">{String(errMsg)}</p>}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && data && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subjects you teach</p>
                  <p className="text-3xl font-bold text-foreground">{data.subject_count}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary opacity-80" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students (your classes)</p>
                  <p className="text-3xl font-bold text-foreground">{data.enrolled_student_count}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-80" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending requests</p>
                  <p className="text-3xl font-bold text-foreground">{data.pending_student_requests}</p>
                </div>
                <Clock className="w-8 h-8 text-primary opacity-80" />
              </div>
            </Card>
          </div>

          <Card className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Add a student to your class</p>
              <p className="text-sm text-muted-foreground mt-1">
                Username will be derived from their name; initial password will be{" "}
                <span className="font-mono text-foreground">&lt;username&gt;123</span> after approval.
              </p>
            </div>
            <Button asChild>
              <Link to="/teacher/request-student">
                <UserPlus className="w-4 h-4 mr-2" />
                Request student
              </Link>
            </Button>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Your recent requests</h3>
            {requests.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground">No requests yet.</Card>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 8).map((r) => (
                  <Card key={r.id} className="p-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{r.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Class {r.class_name} · Roll {r.roll_no}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        r.status === "pending"
                          ? "bg-amber-500/15 text-amber-700"
                          : r.status === "approved"
                            ? "bg-green-500/15 text-green-700"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {data.class_names?.length === 0 && (
            <Card className="p-6 border-dashed">
              <p className="text-sm text-muted-foreground">
                You are not assigned to any subjects yet. Ask an admin to assign you as the teacher on subjects for your
                classes.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
