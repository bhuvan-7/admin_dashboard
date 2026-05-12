import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const TeacherRequestStudent = () => {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: summary, isLoading } = useQuery({
    queryKey: ["teacher", "dashboard", "summary"],
    queryFn: async () => {
      const { data: d } = await api.get("/teacher/dashboard/summary");
      return d;
    },
  });

  const classes = summary?.class_names ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !className || !rollNo.trim()) {
      toast.error("Name, class, and roll number are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/teacher/student-requests", {
        full_name: fullName.trim(),
        class_name: className,
        roll_no: rollNo.trim(),
        email: email.trim() || null,
      });
      toast.success("Request sent. An admin will review it.");
      setFullName("");
      setRollNo("");
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: ["teacher"] });
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(d ? String(d) : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Request new student</h1>
          <p className="text-sm text-muted-foreground mt-1">
            After approval, login will be <span className="font-mono">username</span> (from the student&apos;s name) and
            password <span className="font-mono">username123</span>.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/teacher">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading your classes…</p>}

      {!isLoading && classes.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          You have no classes linked yet. An admin must assign you to subjects for a class before you can request students.
        </Card>
      )}

      {classes.length > 0 && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Student full name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As it should appear on their account"
              />
            </div>

            <div className="space-y-2">
              <Label>Class *</Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll">Roll number *</Label>
              <Input id="roll" value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="School roll no." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@school.edu" />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send request to admin"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default TeacherRequestStudent;
