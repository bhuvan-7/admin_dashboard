import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ParentDetailDialog = ({ parent, open, onOpenChange }) => {
  if (!parent) return null;

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
            <DialogTitle className="text-2xl">Parent Details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {parent.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{parent.name}</h3>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Parent of {parent.children.length} student{parent.children.length > 1 ? "s" : ""}
                </span>
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
                    <p className="text-foreground">{parent.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-foreground">{parent.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg">Account Information</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Parent ID</p>
                  <p className="text-foreground font-mono">PRT{String(parent.id).padStart(4, '0')}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                  <p className="text-foreground">January 2024</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Children Details</h4>
            <div className="space-y-3">
              {parent.children.map((child, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-muted rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{child.class}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{child.class}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Engagement Overview</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground mt-1">Messages Sent</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground mt-1">Meetings Attended</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">Today</p>
                <p className="text-sm text-muted-foreground mt-1">Last Login</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentDetailDialog;
