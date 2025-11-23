import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotificationPopup = () => {
  const [visible, setVisible] = useState(true);
  const [studentCount, setStudentCount] = useState(2);
  const [teacherCount, setTeacherCount] = useState(3);

  useEffect(() => {
    // TODO: Replace with axios call to fetch pending request counts
    // Example:
    // const fetchPendingCounts = async () => {
    //   try {
    //     const response = await axios.get('/api/requests/pending/count');
    //     setStudentCount(response.data.studentCount);
    //     setTeacherCount(response.data.teacherCount);
    //   } catch (err) {
    //     console.error("Error fetching pending count:", err);
    //   }
    // };
    // fetchPendingCounts();
  }, []);

  const totalCount = studentCount + teacherCount;
  
  if (!visible || totalCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            New Pending Requests
          </p>
          <p className="text-sm text-muted-foreground">
            {studentCount > 0 && `${studentCount} student request${studentCount > 1 ? "s" : ""}`}
            {studentCount > 0 && teacherCount > 0 && " and "}
            {teacherCount > 0 && `${teacherCount} teacher request${teacherCount > 1 ? "s" : ""}`}
            {" "}waiting for review
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link to="/requests">View Requests</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVisible(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopup;
