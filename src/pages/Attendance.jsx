import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Download, Search as SearchIcon } from "lucide-react";
import api from "@/lib/axios";

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: classOptions = [] } = useQuery({
    queryKey: ["admin", "attendance", "classes"],
    queryFn: async () => {
      const { data } = await api.get("/admin/attendance/classes");
      return data || [];
    },
  });

  const { data: subjectRows = [] } = useQuery({
    queryKey: ["admin", "attendance", "subjects", selectedClass],
    enabled: Boolean(selectedClass),
    queryFn: async () => {
      const { data } = await api.get("/admin/subjects", { params: { class_name: selectedClass } });
      return (data || []).map((s) => ({ id: String(s.id), name: s.name }));
    },
  });

  useEffect(() => {
    setSelectedSubject("");
  }, [selectedClass]);

  const { data: attendanceRows = [], isFetching: attendanceLoading } = useQuery({
    queryKey: ["admin", "attendance", "grid", selectedClass, selectedSubject, searchTerm],
    enabled: Boolean(selectedClass && selectedSubject),
    queryFn: async () => {
      const { data } = await api.get("/admin/attendance", {
        params: {
          class_name: selectedClass,
          subject_id: Number(selectedSubject),
          q: searchTerm.trim() || undefined,
        },
      });
      return (data || []).map((r) => {
        const total = r.total ?? 0;
        const present = r.present ?? 0;
        const pct = total ? ((present / total) * 100).toFixed(1) : "0.0";
        return {
          id: r.id,
          name: r.name,
          total,
          present,
          percentage: pct,
        };
      });
    },
  });

  const subjectNameById = useMemo(() => {
    const m = {};
    for (const s of subjectRows) m[s.id] = s.name;
    return m;
  }, [subjectRows]);

  const handleDownloadReport = () => {
    if (!attendanceRows.length) return;
    const header = ["Student Name", "Student ID", "Total Classes", "Present", "Attendance %"];
    const rows = attendanceRows.map((row) => [row.name, row.id, row.total, row.present, row.percentage]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const subLabel = subjectNameById[selectedSubject] || selectedSubject;
    link.download = `${selectedClass || "attendance"}-${subLabel || "report"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Attendance</h2>
        <p className="text-muted-foreground">Monitor attendance by class and subject (live API).</p>
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
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subjectSelect" className="text-foreground mb-2 block">
              Select Subject
            </Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
              <SelectTrigger id="subjectSelect" className="bg-background border-border text-foreground">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectRows.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
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
              {attendanceRows.length} {attendanceRows.length === 1 ? "student" : "students"}
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
                    {attendanceLoading
                      ? "Loading attendance…"
                      : !selectedClass
                        ? "Select a class and subject to view attendance."
                        : !subjectRows.length
                          ? "No subjects for this class. Add subjects under Admin → Subjects, then run seed if needed."
                          : !selectedSubject
                            ? "Select a subject to view attendance."
                            : "No students or no attendance data yet."}
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
