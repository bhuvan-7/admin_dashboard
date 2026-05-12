import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Megaphone, ClipboardList, CalendarDays, Award, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LmsOverviewCard = ({ stats, loading, error }) => {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading LMS overview…</p>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">{error || "Could not load overview."}</p>
      </Card>
    );
  }

  const primary = stats.total_subjects ?? 0;
  const secondary = [
    { label: "Announcements", value: stats.total_announcements, icon: Megaphone },
    { label: "Assignments", value: stats.total_assignments, icon: ClipboardList },
    { label: "Exams", value: stats.total_exams, icon: CalendarDays },
    { label: "Results", value: stats.total_results, icon: Award },
    { label: "Attendance sessions", value: stats.total_attendance_sessions, icon: CalendarCheck2 },
  ];

  return (
    <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">LMS overview</p>
          <p className="text-xs text-muted-foreground mt-1">Live counts from your database</p>
          <h3 className="text-3xl font-bold text-primary mt-2">{primary}</h3>
          <p className="text-sm text-muted-foreground">Subjects offered</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pt-4 border-t border-border animate-in fade-in-50">
          {secondary.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="w-4 h-4" />
                  {row.label}
                </span>
                <span className="font-semibold text-foreground">{row.value}</span>
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full mt-4 text-primary"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? "Show less" : "Show details"}
      </Button>
    </Card>
  );
};

export default LmsOverviewCard;
