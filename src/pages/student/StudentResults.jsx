import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";

const results = [
  { subject: "Mathematics", score: 88, max: 100, grade: "A" },
  { subject: "English", score: 81, max: 100, grade: "A-" },
  { subject: "Science", score: 85, max: 100, grade: "A" },
  { subject: "Social Studies", score: 78, max: 100, grade: "B+" },
  { subject: "Computer Science", score: 91, max: 100, grade: "A+" },
];

const percentage = (score, max) => (max ? ((score / max) * 100).toFixed(1) : "0.0");

const StudentResults = () => {
  const overall = (() => {
    const total = results.reduce((s, r) => s + r.score, 0);
    const max = results.reduce((s, r) => s + r.max, 0);
    return percentage(total, max);
  })();

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Results</h2>
        <p className="text-muted-foreground">Your subject-wise marks and overall performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Percentage</p>
              <p className="text-3xl font-bold text-foreground">{overall}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground">%</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {results.map((r) => (
                  <tr key={r.subject} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{r.subject}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {r.score}/{r.max}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{percentage(r.score, r.max)}%</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Award className="w-3.5 h-3.5 mr-1" />
                        {r.grade}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentResults;

