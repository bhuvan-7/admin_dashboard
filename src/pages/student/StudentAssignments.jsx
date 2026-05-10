import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardList, Calendar, Search } from "lucide-react";

const assignments = [
  { id: "A-101", title: "Algebra Practice Set", subject: "Mathematics", due: "2026-05-14", status: "Pending" },
  { id: "A-102", title: "Reading Comprehension", subject: "English", due: "2026-05-15", status: "Submitted" },
  { id: "A-103", title: "Plant Cell Worksheet", subject: "Science", due: "2026-05-16", status: "Pending" },
  { id: "A-104", title: "History Chapter Notes", subject: "Social Studies", due: "2026-05-12", status: "Graded" },
];

const statusBadge = (status) => {
  if (status === "Submitted") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  if (status === "Graded") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const StudentAssignments = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your assignments and due dates.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.subject} • {a.id}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {a.due}
                  </p>
                </div>
              </div>

              <Badge className={statusBadge(a.status)} variant="secondary">
                {a.status}
              </Badge>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No assignments found.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;

