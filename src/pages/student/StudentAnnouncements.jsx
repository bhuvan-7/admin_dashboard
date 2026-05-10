import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Clock } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Exam Schedule Released",
    description:
      "The final examination schedule has been published. Please check the Exams tab for dates and venues.",
    audience: "Students",
    timestamp: "2026-05-09 10:30 AM",
  },
  {
    id: 2,
    title: "Library Timing Update",
    description: "Library will be open from 8:00 AM to 6:00 PM from Monday to Friday.",
    audience: "All",
    timestamp: "2026-05-08 04:15 PM",
  },
  {
    id: 3,
    title: "Assignment Submission Reminder",
    description: "Please submit pending assignments before the due date to avoid late penalties.",
    audience: "Students",
    timestamp: "2026-05-07 09:00 AM",
  },
];

const badgeForAudience = (audience) => {
  if (audience === "Students") return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
  if (audience === "All") return "bg-primary/10 text-primary hover:bg-primary/20";
  return "bg-muted text-muted-foreground";
};

const StudentAnnouncements = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Latest updates from the school.</p>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <Card key={a.id} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  </div>
                  <Badge variant="secondary" className={`${badgeForAudience(a.audience)} text-xs px-2 py-0 whitespace-nowrap`}>
                    {a.audience}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {a.timestamp}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentAnnouncements;

