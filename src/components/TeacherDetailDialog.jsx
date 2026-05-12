import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TeacherDetailDialog = ({ teacher, open, onOpenChange }) => {
  if (!teacher) return null;

  const initials = teacher.full_name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 3);

  const subjectLine =
    teacher.subjects_taught?.length > 0 ? teacher.subjects_taught.join(", ") : teacher.department || "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-2xl">Teacher details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {initials}
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{teacher.full_name}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {teacher.department && <Badge variant="secondary">{teacher.department}</Badge>}
                <span className="text-muted-foreground text-sm">ID #{teacher.id}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Contact</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.email || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Teaching</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Subjects (from offerings)</p>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">{subjectLine}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Students enrolled</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.student_count ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Classes</h4>
            <div className="flex flex-wrap gap-2">
              {(teacher.class_names ?? []).length > 0 ? (
                teacher.class_names.map((cls) => (
                  <Badge key={cls} variant="secondary" className="text-sm">
                    Class {cls}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subjects assigned to this teacher yet.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDetailDialog;
