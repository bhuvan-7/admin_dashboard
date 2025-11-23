import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, BookOpen, Award, UserPlus, Users as UsersIcon } from "lucide-react";
import TeacherDetailDialog from "@/components/TeacherDetailDialog";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTeachers([
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@lms.com",
        phone: "9876543210",
        subject: "Mathematics",
        experience: 12,
        qualification: "Ph.D in Mathematics",
        assignedClasses: ["Class 9", "Class 10", "Class 11"],
        location: "Mumbai, Maharashtra",
      },
      {
        id: 2,
        name: "Prof. Michael Chen",
        email: "michael.chen@lms.com",
        phone: "9876543211",
        subject: "Physics",
        experience: 8,
        qualification: "M.Sc Physics, B.Ed",
        assignedClasses: ["Class 11", "Class 12"],
        location: "Delhi, Delhi",
      },
      {
        id: 3,
        name: "Ms. Priya Sharma",
        email: "priya.sharma@lms.com",
        phone: "9876543212",
        subject: "English Literature",
        experience: 6,
        qualification: "M.A English, B.Ed",
        assignedClasses: ["Class 6", "Class 7", "Class 8"],
        location: "Bangalore, Karnataka",
      },
      {
        id: 4,
        name: "Mr. Rahul Verma",
        email: "rahul.verma@lms.com",
        phone: "9876543213",
        subject: "Chemistry",
        experience: 10,
        qualification: "M.Sc Chemistry",
        assignedClasses: ["Class 10", "Class 11", "Class 12"],
        location: "Pune, Maharashtra",
      },
      {
        id: 5,
        name: "Dr. Emily Davis",
        email: "emily.davis@lms.com",
        phone: "9876543214",
        subject: "Biology",
        experience: 15,
        qualification: "Ph.D in Biology",
        assignedClasses: ["Class 9", "Class 10"],
        location: "Hyderabad, Telangana",
      },
      {
        id: 6,
        name: "Mr. Amit Patel",
        email: "amit.patel@lms.com",
        phone: "9876543215",
        subject: "Computer Science",
        experience: 5,
        qualification: "M.Tech CS, B.Ed",
        assignedClasses: ["Class 11", "Class 12"],
        location: "Ahmedabad, Gujarat",
      },
    ]);
  }, []);

  const handleCardClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all teacher profiles
          </p>
        </div>

        {/* Right-side stats + button */}
        <div className="flex items-center gap-4">
          {/* Total Teachers Box */}
          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-40 h-10">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <UsersIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-primary/70">
                  Total Teachers
                </p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">{teachers.length}</p>
          </div>

          {/* Add Teacher Button */}
          <Button asChild>
            <Link to="/add-teacher">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teacher
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading teachers...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading teachers: {error}</p>
        </div>
      )}

      {/* Teacher Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
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
                        {teacher.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>{teacher.qualification}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Experience
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {teacher.experience} years
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.assignedClasses.map((cls) => (
                      <Badge key={cls} variant="secondary" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TeacherDetailDialog
        teacher={selectedTeacher}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
};

export default Teachers;
