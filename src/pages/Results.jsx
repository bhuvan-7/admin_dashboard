import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CheckCircle2, TrendingUp } from "lucide-react";
import api from "@/lib/axios";

const toPercent = (marks, maxMarks) => (maxMarks > 0 ? ((marks / maxMarks) * 100).toFixed(1) : "0.0");

const Results = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: meta, isLoading: loadingBase } = useQuery({
    queryKey: ["admin", "results", "meta"],
    queryFn: async () => {
      const [studentsRes, subjectsRes] = await Promise.all([api.get("/admin/students"), api.get("/admin/subjects")]);
      return { students: studentsRes.data || [], subjects: subjectsRes.data || [] };
    },
  });

  const students = meta?.students ?? [];
  const subjects = meta?.subjects ?? [];

  const { data: results = [], isFetching: loading } = useQuery({
    queryKey: ["admin", "results", "class", selectedClass],
    enabled: Boolean(selectedClass),
    queryFn: async () => {
      const { data } = await api.get("/admin/results", { params: { class_name: selectedClass } });
      return data || [];
    },
  });

  const classOptions = useMemo(() => {
    const set = new Set(students.map((s) => s.class_name).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  const studentsById = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [students]);

  const subjectsById = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  const currentClassData = useMemo(() => {
    if (!selectedClass) return [];

    const byStudent = {};
    results.forEach((r) => {
      const student = studentsById[r.student_id];
      if (!student) return;
      if (!byStudent[student.id]) {
        byStudent[student.id] = {
          id: student.id,
          displayId: student.roll_no || `SID-${student.id}`,
          name: student.full_name,
          class: student.class_name,
          subjects: [],
        };
      }
      const subject = subjectsById[r.subject_id];
      byStudent[student.id].subjects.push({
        name: subject?.name || `Subject #${r.subject_id}`,
        marksObtained: r.marks_obtained,
        maxMarks: r.max_marks,
      });
    });

    return Object.values(byStudent);
  }, [results, selectedClass, studentsById, subjectsById]);

  const calculateTotalPercentage = (student) => {
    const totalMarks = student.subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
    const maxTotalMarks = student.subjects.reduce((sum, sub) => sum + sub.maxMarks, 0);
    return maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(1) : "0.0";
  };

  const isPassed = (student) => {
    const percentage = parseFloat(calculateTotalPercentage(student));
    return percentage >= 40; // Passing threshold is 40%
  };

  const summaryStats = useMemo(() => {
    if (!currentClassData.length) {
      return { totalStudents: 0, passedStudents: 0, passPercentage: 0 };
    }

    const totalStudents = currentClassData.length;
    const passedStudents = currentClassData.filter((student) => isPassed(student)).length;
    const passPercentage = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : "0.0";

    return {
      totalStudents,
      passedStudents,
      passPercentage,
    };
  }, [currentClassData]);

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Results</h2>
        <p className="text-muted-foreground">View and analyze student examination results by class from live backend data.</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Label htmlFor="classSelect" className="text-foreground mb-2 block">
            Select Class
          </Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="classSelect" className="bg-background border-border text-foreground w-full md:w-[300px]">
              <SelectValue placeholder={loadingBase ? "Loading classes..." : "Choose a class"} />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass && loading && (
          <div className="text-center py-8 text-muted-foreground">Loading results...</div>
        )}

        {selectedClass && !loading && currentClassData.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-foreground">{summaryStats.totalStudents}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Passed Students</p>
                    <p className="text-3xl font-bold text-foreground">{summaryStats.passedStudents}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pass Percentage</p>
                    <p className="text-3xl font-bold text-foreground">{summaryStats.passPercentage}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-blue-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="text-foreground">Roll No</TableHead>
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Class</TableHead>
                    <TableHead className="text-foreground">Total %</TableHead>
                    <TableHead className="text-center text-foreground">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClassData.map((student) => {
                    const totalPercentage = calculateTotalPercentage(student);
                    const passed = isPassed(student);

                    return (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleRowClick(student)}
                      >
                        <TableCell className="text-foreground">{student.displayId}</TableCell>
                        <TableCell className="text-foreground font-medium">{student.name}</TableCell>
                        <TableCell className="text-foreground">{student.class}</TableCell>
                        <TableCell className="text-foreground">{totalPercentage}%</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              passed
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                            }
                          >
                            {passed ? "Pass" : "Fail"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {selectedClass && !loading && currentClassData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No results available for {selectedClass}.
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-8 text-muted-foreground">
            Please select a class to view results.
          </div>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Subject-wise Marks - {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="mt-4">
              <div className="mb-4 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Roll No:</span> {selectedStudent.displayId}
                </p>
                <p>
                  <span className="font-medium">Class:</span> {selectedStudent.class}
                </p>
              </div>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="text-foreground">Subject</TableHead>
                      <TableHead className="text-foreground">Marks Obtained</TableHead>
                      <TableHead className="text-foreground">Maximum Marks</TableHead>
                      <TableHead className="text-foreground">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent.subjects.map((subject, index) => {
                      const percentage = ((subject.marksObtained / subject.maxMarks) * 100).toFixed(1);
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-foreground font-medium">{subject.name}</TableCell>
                          <TableCell className="text-foreground">{subject.marksObtained}</TableCell>
                          <TableCell className="text-foreground">{subject.maxMarks}</TableCell>
                          <TableCell className="text-foreground">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total Percentage:</span>
                  <span className="text-lg font-bold text-foreground">
                    {calculateTotalPercentage(selectedStudent)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-foreground">Result:</span>
                  <Badge
                    className={
                      isPassed(selectedStudent)
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                    }
                  >
                    {isPassed(selectedStudent) ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;

