import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, ChevronDown, Users } from "lucide-react";
import StudentDetailDialog from "@/components/StudentDetailDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const Students = () => {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: students = [], isLoading: loading, isError, error } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const { data } = await api.get("/admin/students");
      return data;
    },
  });

  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Unknown error" : null;

  const classes = useMemo(() => {
    const set = new Set(students.map((s) => s.class_name).filter(Boolean));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  }, [students]);

  const uiStudents = useMemo(
    () =>
      students.map((s) => ({
        id: s.id,
        name: s.full_name,
        rollNumber: s.roll_no,
        class: s.class_name,
        parentName: "—",
        email: s.email || "—",
        phone: "—",
        status: "active",
      })),
    [students],
  );

  const filteredStudents =
    selectedClass === "All" ? uiStudents : uiStudents.filter((student) => student.class === selectedClass);

  const handleCardClick = (student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Records from the student table (parent links not stored yet)</p>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-12 w-48 justify-between">
                {selectedClass === "All" ? "All Students" : `Class ${selectedClass}`}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedClass("All")}>All Students</DropdownMenuItem>
              {classes.map((cls) => (
                <DropdownMenuItem key={cls} onClick={() => setSelectedClass(cls)}>
                  Class {cls}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-48 h-12">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs uppercase tracking-wide text-primary/70">Total Students</p>
            </div>
            <p className="text-2xl font-bold text-primary">{filteredStudents.length}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      )}

      {errMsg && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading students: {errMsg}</p>
        </div>
      )}

      {!loading && !errMsg && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}{" "}
            {selectedClass === "All" ? "in all classes" : `in Class ${selectedClass}`}
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
                          <h3 className="font-semibold text-foreground">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
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
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Badge variant="outline" className="text-primary border-primary">
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

      <StudentDetailDialog student={selectedStudent} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
    </div>
  );
};

export default Students;
