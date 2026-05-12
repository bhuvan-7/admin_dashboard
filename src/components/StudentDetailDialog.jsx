import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StudentDetailDialog = ({ student, open, onOpenChange }) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-2xl">Student details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{student.name}</h3>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                  {student.status}
                </Badge>
                <span className="text-muted-foreground">Class {student.class}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Profile</h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Roll number</p>
                  <p className="text-foreground font-medium">{student.rollNumber}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{student.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground">{student.phone !== "—" ? student.phone : "—"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Family</h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Parent / guardian</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{student.parentName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Attendance, assignments, and grades are available on the dedicated admin and student pages once recorded in
              the API.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailDialog;
