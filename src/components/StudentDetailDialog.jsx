import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StudentDetailDialog = ({ student, open, onOpenChange }) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-2xl">Student Details</DialogTitle>
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
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status}
                </Badge>
                <span className="text-muted-foreground">Class {student.class}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Personal Information</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
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
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{student.phone}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Class</p>
                  <p className="text-foreground">Class {student.class}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Parent Information</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{student.parentName}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={student.status === "active" ? "default" : "secondary"} className="w-fit">
                    {student.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Academic Information</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                <p className="text-2xl font-bold text-foreground">92%</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Assignments</p>
                <p className="text-2xl font-bold text-foreground">24/28</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average Grade</p>
                <p className="text-2xl font-bold text-foreground">A</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailDialog;
