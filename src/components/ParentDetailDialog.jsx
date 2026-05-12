import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ParentDetailDialog = ({ parent, open, onOpenChange }) => {
  if (!parent) return null;

  const initials = parent.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-2xl">Parent details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {initials}
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{parent.name}</h3>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Parent account #{parent.id}</span>
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
              <h4 className="font-semibold text-foreground text-lg">Account</h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-semibold text-foreground text-lg mb-4">Children</h4>
            {parent.children?.length > 0 ? (
              <div className="space-y-3">
                {parent.children.map((child, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                    <span className="font-medium text-foreground">{child.name}</span>
                    <Badge variant="secondary">{child.class}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No students are linked to this parent in the database yet.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentDetailDialog;
