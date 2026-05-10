import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User } from "lucide-react";

const enrolledSubjects = [
  { name: "Mathematics", code: "MATH-210", teacher: "Dr. Rajesh Kumar", room: "A-201" },
  { name: "English", code: "ENG-205", teacher: "Ms. Priya Sharma", room: "B-102" },
  { name: "Science", code: "SCI-220", teacher: "Dr. Amit Patel", room: "Lab-1" },
  { name: "Social Studies", code: "SST-215", teacher: "Mr. Suresh Reddy", room: "C-305" },
  { name: "Computer Science", code: "CS-230", teacher: "Ms. Ananya Iyer", room: "Lab-2" },
];

const StudentSubjects = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your enrolled subjects for this term.</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Current Term
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledSubjects.map((subject) => (
          <Card key={subject.code} className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground">{subject.name}</h3>
                  <p className="text-xs text-muted-foreground">{subject.code}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {subject.room}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span>{subject.teacher}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;

