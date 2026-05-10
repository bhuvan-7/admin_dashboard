import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Clock, MapPin } from "lucide-react";

const exams = [
  { subject: "Mathematics", date: "2026-05-18", time: "10:00 AM - 12:00 PM", venue: "Hall 2", status: "Upcoming" },
  { subject: "English", date: "2026-05-20", time: "10:00 AM - 12:00 PM", venue: "Hall 1", status: "Upcoming" },
  { subject: "Science", date: "2026-05-22", time: "10:00 AM - 12:00 PM", venue: "Lab 1", status: "Upcoming" },
  { subject: "Social Studies", date: "2026-05-24", time: "10:00 AM - 12:00 PM", venue: "Hall 3", status: "Upcoming" },
];

const statusToBadge = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
  if (status === "Ongoing") return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200";
};

const StudentExams = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exams</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your upcoming exam schedule.</p>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => (
          <Card key={`${exam.subject}-${exam.date}`} className="p-5 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{exam.subject}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.date} • {exam.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {exam.venue}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className={statusToBadge(exam.status)} variant="secondary">
                {exam.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentExams;

