import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Users, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

// Mock data for results
const mockResultsData = {
  "1st Std": [
    {
      id: "STU001",
      name: "Alice Johnson",
      class: "1st Std",
      subjects: [
        { name: "Mathematics", marksObtained: 85, maxMarks: 100 },
        { name: "English", marksObtained: 78, maxMarks: 100 },
        { name: "Science", marksObtained: 82, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 80, maxMarks: 100 },
      ],
    },
    {
      id: "STU002",
      name: "Bob Smith",
      class: "1st Std",
      subjects: [
        { name: "Mathematics", marksObtained: 92, maxMarks: 100 },
        { name: "English", marksObtained: 88, maxMarks: 100 },
        { name: "Science", marksObtained: 90, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 85, maxMarks: 100 },
      ],
    },
    {
      id: "STU003",
      name: "Charlie Brown",
      class: "1st Std",
      subjects: [
        { name: "Mathematics", marksObtained: 45, maxMarks: 100 },
        { name: "English", marksObtained: 52, maxMarks: 100 },
        { name: "Science", marksObtained: 48, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 50, maxMarks: 100 },
      ],
    },
    {
      id: "STU004",
      name: "Diana Prince",
      class: "1st Std",
      subjects: [
        { name: "Mathematics", marksObtained: 88, maxMarks: 100 },
        { name: "English", marksObtained: 85, maxMarks: 100 },
        { name: "Science", marksObtained: 90, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 87, maxMarks: 100 },
      ],
    },
    {
      id: "STU005",
      name: "Ethan Hunt",
      class: "1st Std",
      subjects: [
        { name: "Mathematics", marksObtained: 75, maxMarks: 100 },
        { name: "English", marksObtained: 72, maxMarks: 100 },
        { name: "Science", marksObtained: 78, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 74, maxMarks: 100 },
      ],
    },
  ],
  "2nd Std": [
    {
      id: "STU006",
      name: "Fiona Green",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 95, maxMarks: 100 },
        { name: "English", marksObtained: 92, maxMarks: 100 },
        { name: "Science", marksObtained: 94, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 90, maxMarks: 100 },
        { name: "Hindi", marksObtained: 88, maxMarks: 100 },
      ],
    },
    {
      id: "STU007",
      name: "George Wilson",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 65, maxMarks: 100 },
        { name: "English", marksObtained: 68, maxMarks: 100 },
        { name: "Science", marksObtained: 70, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 67, maxMarks: 100 },
        { name: "Hindi", marksObtained: 72, maxMarks: 100 },
      ],
    },
    {
      id: "STU008",
      name: "Hannah Lee",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 40, maxMarks: 100 },
        { name: "English", marksObtained: 38, maxMarks: 100 },
        { name: "Science", marksObtained: 42, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 35, maxMarks: 100 },
        { name: "Hindi", marksObtained: 45, maxMarks: 100 },
      ],
    },
    {
      id: "STU009",
      name: "Ian Murphy",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 82, maxMarks: 100 },
        { name: "English", marksObtained: 85, maxMarks: 100 },
        { name: "Science", marksObtained: 80, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 83, maxMarks: 100 },
        { name: "Hindi", marksObtained: 87, maxMarks: 100 },
      ],
    },
    {
      id: "STU010",
      name: "Julia Roberts",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 78, maxMarks: 100 },
        { name: "English", marksObtained: 80, maxMarks: 100 },
        { name: "Science", marksObtained: 75, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 77, maxMarks: 100 },
        { name: "Hindi", marksObtained: 79, maxMarks: 100 },
      ],
    },
    {
      id: "STU011",
      name: "Kevin Hart",
      class: "2nd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 88, maxMarks: 100 },
        { name: "English", marksObtained: 85, maxMarks: 100 },
        { name: "Science", marksObtained: 90, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 87, maxMarks: 100 },
        { name: "Hindi", marksObtained: 82, maxMarks: 100 },
      ],
    },
  ],
  "3rd Std": [
    {
      id: "STU012",
      name: "Lily Chen",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 90, maxMarks: 100 },
        { name: "English", marksObtained: 88, maxMarks: 100 },
        { name: "Science", marksObtained: 92, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 85, maxMarks: 100 },
        { name: "Hindi", marksObtained: 87, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 91, maxMarks: 100 },
      ],
    },
    {
      id: "STU013",
      name: "Mike Johnson",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 55, maxMarks: 100 },
        { name: "English", marksObtained: 58, maxMarks: 100 },
        { name: "Science", marksObtained: 52, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 56, maxMarks: 100 },
        { name: "Hindi", marksObtained: 54, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 60, maxMarks: 100 },
      ],
    },
    {
      id: "STU014",
      name: "Nancy Drew",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 95, maxMarks: 100 },
        { name: "English", marksObtained: 93, maxMarks: 100 },
        { name: "Science", marksObtained: 96, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 94, maxMarks: 100 },
        { name: "Hindi", marksObtained: 92, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 98, maxMarks: 100 },
      ],
    },
    {
      id: "STU015",
      name: "Oliver Twist",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 35, maxMarks: 100 },
        { name: "English", marksObtained: 32, maxMarks: 100 },
        { name: "Science", marksObtained: 38, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 30, maxMarks: 100 },
        { name: "Hindi", marksObtained: 40, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 42, maxMarks: 100 },
      ],
    },
    {
      id: "STU016",
      name: "Patricia Adams",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 80, maxMarks: 100 },
        { name: "English", marksObtained: 82, maxMarks: 100 },
        { name: "Science", marksObtained: 78, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 85, maxMarks: 100 },
        { name: "Hindi", marksObtained: 80, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 83, maxMarks: 100 },
      ],
    },
    {
      id: "STU017",
      name: "Quinn Taylor",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 72, maxMarks: 100 },
        { name: "English", marksObtained: 75, maxMarks: 100 },
        { name: "Science", marksObtained: 70, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 73, maxMarks: 100 },
        { name: "Hindi", marksObtained: 76, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 74, maxMarks: 100 },
      ],
    },
    {
      id: "STU018",
      name: "Rachel Green",
      class: "3rd Std",
      subjects: [
        { name: "Mathematics", marksObtained: 85, maxMarks: 100 },
        { name: "English", marksObtained: 88, maxMarks: 100 },
        { name: "Science", marksObtained: 87, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 86, maxMarks: 100 },
        { name: "Hindi", marksObtained: 84, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 89, maxMarks: 100 },
      ],
    },
  ],
  "4th Std": [
    {
      id: "STU019",
      name: "Sam Wilson",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 92, maxMarks: 100 },
        { name: "English", marksObtained: 90, maxMarks: 100 },
        { name: "Science", marksObtained: 94, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 88, maxMarks: 100 },
        { name: "Hindi", marksObtained: 91, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 93, maxMarks: 100 },
        { name: "Art", marksObtained: 89, maxMarks: 100 },
      ],
    },
    {
      id: "STU020",
      name: "Tina Turner",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 68, maxMarks: 100 },
        { name: "English", marksObtained: 70, maxMarks: 100 },
        { name: "Science", marksObtained: 65, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 72, maxMarks: 100 },
        { name: "Hindi", marksObtained: 69, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 71, maxMarks: 100 },
        { name: "Art", marksObtained: 73, maxMarks: 100 },
      ],
    },
    {
      id: "STU021",
      name: "Uma Thurman",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 45, maxMarks: 100 },
        { name: "English", marksObtained: 48, maxMarks: 100 },
        { name: "Science", marksObtained: 42, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 46, maxMarks: 100 },
        { name: "Hindi", marksObtained: 50, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 44, maxMarks: 100 },
        { name: "Art", marksObtained: 47, maxMarks: 100 },
      ],
    },
    {
      id: "STU022",
      name: "Victor Stone",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 88, maxMarks: 100 },
        { name: "English", marksObtained: 85, maxMarks: 100 },
        { name: "Science", marksObtained: 90, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 87, maxMarks: 100 },
        { name: "Hindi", marksObtained: 86, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 89, maxMarks: 100 },
        { name: "Art", marksObtained: 84, maxMarks: 100 },
      ],
    },
    {
      id: "STU023",
      name: "Wendy Davis",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 75, maxMarks: 100 },
        { name: "English", marksObtained: 78, maxMarks: 100 },
        { name: "Science", marksObtained: 72, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 76, maxMarks: 100 },
        { name: "Hindi", marksObtained: 74, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 77, maxMarks: 100 },
        { name: "Art", marksObtained: 75, maxMarks: 100 },
      ],
    },
    {
      id: "STU024",
      name: "Xavier Woods",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 96, maxMarks: 100 },
        { name: "English", marksObtained: 94, maxMarks: 100 },
        { name: "Science", marksObtained: 98, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 95, maxMarks: 100 },
        { name: "Hindi", marksObtained: 93, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 97, maxMarks: 100 },
        { name: "Art", marksObtained: 96, maxMarks: 100 },
      ],
    },
    {
      id: "STU025",
      name: "Yara Shahidi",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 82, maxMarks: 100 },
        { name: "English", marksObtained: 85, maxMarks: 100 },
        { name: "Science", marksObtained: 80, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 83, maxMarks: 100 },
        { name: "Hindi", marksObtained: 84, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 81, maxMarks: 100 },
        { name: "Art", marksObtained: 86, maxMarks: 100 },
      ],
    },
    {
      id: "STU026",
      name: "Zoe Saldana",
      class: "4th Std",
      subjects: [
        { name: "Mathematics", marksObtained: 38, maxMarks: 100 },
        { name: "English", marksObtained: 35, maxMarks: 100 },
        { name: "Science", marksObtained: 40, maxMarks: 100 },
        { name: "Social Studies", marksObtained: 32, maxMarks: 100 },
        { name: "Hindi", marksObtained: 36, maxMarks: 100 },
        { name: "Computer Science", marksObtained: 42, maxMarks: 100 },
        { name: "Art", marksObtained: 34, maxMarks: 100 },
      ],
    },
  ],
};

const Results = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const classOptions = ["1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", "7th Std", "8th Std", "9th Std", "10th Std"];

  const currentClassData = useMemo(() => {
    if (!selectedClass) return [];
    return mockResultsData[selectedClass] || [];
  }, [selectedClass]);

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
        <p className="text-muted-foreground">View and analyze student examination results by class.</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Label htmlFor="classSelect" className="text-foreground mb-2 block">
            Select Class
          </Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="classSelect" className="bg-background border-border text-foreground w-full md:w-[300px]">
              <SelectValue placeholder="Choose a class" />
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

        {selectedClass && currentClassData.length > 0 && (
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
                    <TableHead className="text-foreground">Student ID</TableHead>
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
                        <TableCell className="text-foreground">{student.id}</TableCell>
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

        {selectedClass && currentClassData.length === 0 && (
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
                  <span className="font-medium">Student ID:</span> {selectedStudent.id}
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

