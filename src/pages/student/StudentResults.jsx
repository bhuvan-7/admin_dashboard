import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";
import api from "@/lib/axios";

const percentage = (score, max) => (max ? ((score / max) * 100).toFixed(1) : "0.0");

const gradeLetter = (pct) => {
  const p = parseFloat(pct);
  if (p >= 97) return "A+";
  if (p >= 93) return "A";
  if (p >= 90) return "A-";
  if (p >= 87) return "B+";
  if (p >= 83) return "B";
  if (p >= 80) return "B-";
  if (p >= 77) return "C+";
  if (p >= 73) return "C";
  if (p >= 70) return "C-";
  if (p >= 67) return "D+";
  if (p >= 63) return "D";
  return "F";
};

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [subjectById, setSubjectById] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rRes, sRes] = await Promise.all([api.get("/student/results"), api.get("/student/subjects")]);
        if (cancelled) return;
        const map = {};
        for (const s of sRes.data || []) map[s.id] = s.name;
        setSubjectById(map);
        setResults(rRes.data || []);
      } catch {
        if (!cancelled) {
          setResults([]);
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
      results.map((r) => {
        const pct = percentage(r.marks_obtained, r.max_marks);
        return {
          id: r.id,
          subject: subjectById[r.subject_id] || `Subject #${r.subject_id}`,
          score: r.marks_obtained,
          max: r.max_marks,
          pct,
          grade: gradeLetter(pct),
        };
      }),
    [results, subjectById],
  );

  const overall = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.score, 0);
    const max = rows.reduce((s, r) => s + r.max, 0);
    return percentage(total, max);
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Results</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Marks published by your school (same records admins manage).
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Live API
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Percentage</p>
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">%</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No results published yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{r.subject}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {r.score}/{r.max}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{r.pct}%</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          <Award className="w-3.5 h-3.5 mr-1" />
                          {r.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentResults;
