import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          api.get("/student/attendance"),
          api.get("/student/attendance/history"),
        ]);
        if (!cancelled) {
          setRows(summaryRes.data || []);
          setHistory(historyRes.data || []);
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setHistory([]);
        }
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
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Summary by subject and session-by-session history.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Live API
        </Badge>
      </div>

      <Card className="p-6 hover:shadow-lg transition-shadow max-w-sm">
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

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">By subject</TabsTrigger>
          <TabsTrigger value="history">Session history</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <Card className="p-0 overflow-hidden">
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
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="rounded-md border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        No attendance sessions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.session_id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground">{h.session_date}</td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{h.subject}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant="secondary"
                            className={
                              h.present
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {h.present ? "Present" : "Absent"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAttendance;
