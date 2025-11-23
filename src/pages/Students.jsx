import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, ChevronDown, Users } from "lucide-react";
import StudentDetailDialog from "@/components/StudentDetailDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  useEffect(() => {
    // Mock data for now
    setStudents([
      {
        id: 1,
        name: "Aarav Sharma",
        rollNumber: "2024001",
        class: "1",
        parentName: "Rajesh Sharma",
        email: "aarav.sharma@student.com",
        phone: "9876543210",
        status: "active",
      },
      {
        id: 2,
        name: "Diya Patel",
        rollNumber: "2024002",
        class: "1",
        parentName: "Neha Patel",
        email: "diya.patel@student.com",
        phone: "9876543211",
        status: "active",
      },
      {
        id: 3,
        name: "Arjun Kumar",
        rollNumber: "2024003",
        class: "2",
        parentName: "Suresh Kumar",
        email: "arjun.kumar@student.com",
        phone: "9876543212",
        status: "active",
      },
      {
        id: 4,
        name: "Ananya Singh",
        rollNumber: "2024004",
        class: "2",
        parentName: "Priya Singh",
        email: "ananya.singh@student.com",
        phone: "9876543213",
        status: "inactive",
      },
      {
        id: 5,
        name: "Vihaan Reddy",
        rollNumber: "2024005",
        class: "3",
        parentName: "Ramesh Reddy",
        email: "vihaan.reddy@student.com",
        phone: "9876543214",
        status: "active",
      },
      {
        id: 6,
        name: "Ishaan Gupta",
        rollNumber: "2024006",
        class: "3",
        parentName: "Amit Gupta",
        email: "ishaan.gupta@student.com",
        phone: "9876543215",
        status: "active",
      },
    ]);
  }, []);

  const filteredStudents =
    selectedClass === "All"
      ? students
      : students.filter((student) => student.class === selectedClass);

  const handleCardClick = (student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">
            View students grouped by their classes
          </p>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Dropdown for Class Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-12 w-48 justify-between"
              >
                {selectedClass === "All"
                  ? "All Students"
                  : `Class ${selectedClass}`}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedClass("All")}>
                All Students
              </DropdownMenuItem>
              {classes.map((cls) => (
                <DropdownMenuItem
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                >
                  Class {cls}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Total Students Box */}
          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-48 h-12">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs uppercase tracking-wide text-primary/70">
                Total Students
              </p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {filteredStudents.length}
            </p>
          </div>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading students: {error}</p>
        </div>
      )}

      {/* Student List */}
      {!loading && !error && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}{" "}
            {selectedClass === "All"
              ? "in all classes"
              : `in Class ${selectedClass}`}
          </p>

          {filteredStudents.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No students found.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(student)}
              >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {student.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Roll: {student.rollNumber}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                        className={
                          student.status === "active"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : ""
                        }
                      >
                        {student.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Parent: {student.parentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{student.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Badge
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        Class {student.class}
                      </Badge>
                    </div>
                  </div>
                </Card>
          ))}
         </div>
          )}
        </div>
      )}

      <StudentDetailDialog
        student={selectedStudent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
};

export default Students;
