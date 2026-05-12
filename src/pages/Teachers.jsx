import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, BookOpen, UserPlus, Users as UsersIcon } from "lucide-react";
import TeacherDetailDialog from "@/components/TeacherDetailDialog";
import api from "@/lib/axios";

const Teachers = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: teachers = [], isLoading: loading, isError, error } = useQuery({
    queryKey: ["admin", "teachers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/teachers");
      return data;
    },
  });

  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Unknown error" : null;

  const handleCardClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground mt-1">Profiles from the database (subjects linked via class offerings)</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-40 h-10">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <UsersIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-primary/70">Total Teachers</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">{teachers.length}</p>
          </div>

          <Button asChild>
            <Link to="/add-teacher">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teacher
            </Link>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading teachers...</p>
        </div>
      )}

      {errMsg && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading teachers: {errMsg}</p>
        </div>
      )}

      {!loading && !errMsg && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => {
            const subjectLine =
              teacher.subjects_taught?.length > 0
                ? teacher.subjects_taught.join(", ")
                : teacher.department || "—";
            return (
              <Card
                key={teacher.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(teacher)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {teacher.full_name
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{teacher.full_name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{subjectLine}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {teacher.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>
                        {teacher.student_count} student{teacher.student_count !== 1 ? "s" : ""} across{" "}
                        {teacher.class_names?.length ?? 0} class
                        {(teacher.class_names?.length ?? 0) !== 1 ? "es" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {(teacher.class_names ?? []).map((cls) => (
                        <Badge key={cls} variant="secondary" className="text-xs">
                          Class {cls}
                        </Badge>
                      ))}
                      {(teacher.class_names ?? []).length === 0 && (
                        <span className="text-xs text-muted-foreground">No class assignments yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <TeacherDetailDialog teacher={selectedTeacher} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
    </div>
  );
};

export default Teachers;
