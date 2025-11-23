import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import mockAttendanceData from "@/data/mockAttendanceData";
import { Download, Search as SearchIcon } from "lucide-react";

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!selectedClass) {
      setSelectedSubject("");
    }
  }, [selectedClass]);

  const classOptions = useMemo(() => mockAttendanceData.map((item) => item.class), []);
  const currentClassData = useMemo(
    () => mockAttendanceData.find((item) => item.class === selectedClass),
    [selectedClass],
  );
  const availableSubjects = currentClassData?.subjects ?? [];

  const attendanceRows = useMemo(() => {
    if (!currentClassData || !selectedSubject) {
      return [];
    }

    const query = searchTerm.trim().toLowerCase();

    return currentClassData.students
      .filter((student) => student.name.toLowerCase().includes(query))
      .map((student) => {
        const statsForSubject = student.attendance[selectedSubject] ?? { total: 0, present: 0 };
        const totalClasses = statsForSubject.total;
        const presentClasses = statsForSubject.present;
        const attendancePct = totalClasses ? ((presentClasses / totalClasses) * 100).toFixed(1) : "0.0";

        return {
          id: student.id,
          name: student.name,
          total: totalClasses,
          present: presentClasses,
          percentage: attendancePct,
        };
      });
  }, [currentClassData, selectedSubject, searchTerm]);

  const handleDownloadReport = () => {
    if (!attendanceRows.length) {
      return;
    }

    const header = ["Student Name", "Student ID", "Total Classes", "Present", "Attendance %"];
    const rows = attendanceRows.map((row) => [
      row.name,
      row.id,
      row.total,
      row.present,
      row.percentage,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedClass || "attendance"}-${selectedSubject || "report"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Attendance</h2>
        <p className="text-muted-foreground">Monitor daily attendance trends across classes and subjects.</p>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <Label htmlFor="classSelect" className="text-foreground mb-2 block">
              Select Class
            </Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="classSelect" className="bg-background border-border text-foreground">
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

          <div>
            <Label htmlFor="subjectSelect" className="text-foreground mb-2 block">
              Select Subject
            </Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedClass}
            >
              <SelectTrigger id="subjectSelect" className="bg-background border-border text-foreground">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="searchStudent" className="text-foreground mb-2 block">
              Search Student
            </Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="searchStudent"
                placeholder="Student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedSubject}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {attendanceRows.length}{" "}
              {attendanceRows.length === 1 ? "student" : "students"}
            </span>
          </p>
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!attendanceRows.length}
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Student ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Total Classes</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Present</th>
                <th className="px-6 py-3 font-medium">Attendance %</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {attendanceRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    {!selectedClass
                      ? "Select a class and subject to view attendance."
                      : "Select a class and subject to view attendance."}
                  </td>
                </tr>
              ) : (
                attendanceRows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{row.total}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{row.present}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          parseFloat(row.percentage) >= 75
                            ? "bg-green-100 text-green-700"
                            : parseFloat(row.percentage) >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Attendance;
