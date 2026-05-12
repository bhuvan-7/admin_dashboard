import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotificationPopup = ({ pendingStudent = 0, pendingTeacher = 0 }) => {
  const [visible, setVisible] = useState(true);

  const totalCount = (pendingStudent || 0) + (pendingTeacher || 0);

  if (!visible || totalCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">New pending requests</p>
          <p className="text-sm text-muted-foreground">
            {pendingStudent > 0 && `${pendingStudent} student request${pendingStudent > 1 ? "s" : ""}`}
            {pendingStudent > 0 && pendingTeacher > 0 && " and "}
            {pendingTeacher > 0 && `${pendingTeacher} teacher request${pendingTeacher > 1 ? "s" : ""}`}
            {" "}
            waiting for review
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link to="/requests">View Requests</Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopup;
