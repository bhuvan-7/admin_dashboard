import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import api from "@/lib/axios";

const pct = (present, total) => (total ? ((present / total) * 100).toFixed(1) : "0.0");

const badgeFor = (percentage) => {
  const p = parseFloat(percentage);
  if (p >= 75) return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  if (p >= 50) return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
  return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
};

const StudentAttendance = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/student/attendance");
        if (!cancelled) setRows(data || []);
      } catch {
        if (!cancelled) setRows([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const overall = useMemo(() => {
    const total = rows.reduce((s, r) => s + (r.total || 0), 0);
    const present = rows.reduce((s, r) => s + (r.present || 0), 0);
    return pct(present, total);
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Attendance</h2>
        <p className="text-muted-foreground">Same attendance sessions your admin records for your class.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold text-foreground">{overall}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Present</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-foreground">%</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No attendance data yet for your subjects.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const percentage = pct(r.present, r.total);
                    return (
                      <tr key={r.subject_id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{r.subject}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{r.total}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{r.present}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={badgeFor(percentage)} variant="secondary">
                            {percentage}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendance;
