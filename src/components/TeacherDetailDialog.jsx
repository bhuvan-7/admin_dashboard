import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, BookOpen, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TeacherDetailDialog = ({ teacher, open, onOpenChange }) => {
  if (!teacher) return null;

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
            <DialogTitle className="text-2xl">Teacher Details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{teacher.name}</h3>
              <div className="flex items-center gap-3">
                <Badge variant="default">{teacher.subject}</Badge>
                <span className="text-muted-foreground">{teacher.experience} years experience</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.phone}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground">{teacher.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Professional Details</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.qualification}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{teacher.subject}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="text-foreground">{teacher.experience} years</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Assigned Classes</h4>
            <div className="flex flex-wrap gap-2">
              {teacher.assignedClasses.map((cls, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {cls}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Teaching Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">245</p>
                <p className="text-sm text-muted-foreground mt-1">Total Students</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">{teacher.assignedClasses.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Classes</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDetailDialog;
