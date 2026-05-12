import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Clock, MapPin } from "lucide-react";
import api from "@/lib/axios";

const pad = (n) => String(n).padStart(2, "0");

const formatTime = (t) => {
  if (!t) return "";
  const parts = String(t).split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h)) return String(t);
  const am = h >= 12;
  const h12 = h % 12 || 12;
  return `${h12}:${pad(m)} ${am ? "PM" : "AM"}`;
};

const statusToBadge = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  if (status === "Ongoing") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [subjectById, setSubjectById] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [exRes, subRes] = await Promise.all([api.get("/student/exams"), api.get("/student/subjects")]);
        if (cancelled) return;
        const map = {};
        for (const s of subRes.data || []) map[s.id] = s.name;
        setSubjectById(map);
        setExams(exRes.data || []);
      } catch {
        if (!cancelled) {
          setExams([]);
          setSubjectById({});
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      exams.map((e) => ({
        id: e.id,
        subject: subjectById[e.subject_id] || `Subject #${e.subject_id}`,
        date: e.exam_date,
        time: `${formatTime(e.start_time)} – ${formatTime(e.end_time)}`,
        venue: e.venue,
        status: e.status || "Upcoming",
      })),
    [exams, subjectById],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exams</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Schedule from the same exams the admin publishes.</p>
      </div>

      {rows.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">No exams scheduled for your subjects yet.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((exam) => (
            <Card key={exam.id} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CalendarCheck2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{exam.subject}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {exam.date} • {exam.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {exam.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge className={statusToBadge(exam.status)} variant="secondary">
                  {exam.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
