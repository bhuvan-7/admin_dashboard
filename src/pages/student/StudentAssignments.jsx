import { useMemo, useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Calendar, Search, MessageSquare, Award } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

const statusBadge = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "submitted") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  if (s === "graded") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const labelStatus = (s) => {
  const x = (s || "").toLowerCase();
  return x.charAt(0).toUpperCase() + x.slice(1);
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
};

const StudentAssignments = () => {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [subjectById, setSubjectById] = useState({});

  const load = useCallback(async () => {
    try {
      const [aRes, sRes] = await Promise.all([api.get("/student/assignments"), api.get("/student/subjects")]);
      const map = {};
      for (const s of sRes.data || []) map[s.id] = s.name;
      setSubjectById(map);
      setRows(
        (aRes.data || []).map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          subject: map[a.subject_id] || `Subject #${a.subject_id}`,
          due: a.due_date,
          status: labelStatus(a.submission_status),
          statusRaw: (a.submission_status || "").toLowerCase(),
          grade: a.grade,
          feedback: a.feedback,
          submittedAt: a.submitted_at,
        })),
      );
    } catch {
      setRows([]);
      toast.error("Could not load assignments.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        String(a.id).includes(q),
    );
  }, [query, rows]);

  const submit = async (id) => {
    try {
      await api.post(`/student/assignments/${id}/submit`, { status: "submitted" });
      toast.success("Marked as submitted.");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Submit failed.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View instructions, submit work, and read teacher grades and feedback.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.subject} • #{a.id}
                  </p>
                  {a.description && (
                    <p className="text-sm text-muted-foreground mt-2">{a.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {a.due}
                    {a.statusRaw === "pending" && isOverdue(a.due) && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                    {a.submittedAt && (
                      <span className="text-muted-foreground">· Submitted {new Date(a.submittedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                  {a.statusRaw === "graded" && (a.grade || a.feedback) && (
                    <div className="mt-3 p-3 rounded-md bg-muted/50 border border-border space-y-1">
                      {a.grade && (
                        <p className="text-sm flex items-center gap-1.5 text-foreground">
                          <Award className="w-4 h-4 text-primary" />
                          Grade: <span className="font-semibold">{a.grade}</span>
                        </p>
                      )}
                      {a.feedback && (
                        <p className="text-sm flex items-start gap-1.5 text-muted-foreground">
                          <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                          {a.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge className={statusBadge(a.status)} variant="secondary">
                  {a.status}
                </Badge>
                {a.status === "Pending" && (
                  <Button size="sm" variant="outline" onClick={() => submit(a.id)}>
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No assignments found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
