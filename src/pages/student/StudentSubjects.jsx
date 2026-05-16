import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, FileText } from "lucide-react";
import api from "@/lib/axios";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/student/subjects");
        if (!cancelled) setSubjects(data || []);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.detail || "Could not load subjects.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Syllabus and teacher notes for each enrolled subject.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Live API
        </Badge>
      </div>

      {error && (
        <Card className="p-4 border-destructive/50">
          <p className="text-sm text-destructive">{String(error)}</p>
        </Card>
      )}

      {!error && subjects.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No enrollments yet. Ask an admin to enroll you in subjects.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground">{subject.name}</h3>
                  <p className="text-xs text-muted-foreground">{subject.code}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Class {subject.class_name}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <User className="w-3.5 h-3.5" />
              <span>{subject.teacher_name || "Teacher TBA"}</span>
            </div>

            {subject.syllabus && (
              <div className="mb-3">
                <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Syllabus
                </p>
                <p className="text-sm text-muted-foreground">{subject.syllabus}</p>
              </div>
            )}

            {subject.notes && (
              <div className="p-3 rounded-md bg-muted/40 border border-border">
                <p className="text-xs font-medium text-foreground mb-1">Teacher notes</p>
                <p className="text-sm text-muted-foreground">{subject.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;
