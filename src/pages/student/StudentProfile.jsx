import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Mail, Hash, School } from "lucide-react";
import api from "@/lib/axios";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/student/me");
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.detail || "Could not load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your account and class details from the LMS.</p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading profile…</p>}
      {error && (
        <Card className="p-4 border-destructive/50">
          <p className="text-sm text-destructive">{String(error)}</p>
        </Card>
      )}

      {profile && (
        <Card className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile.full_name}</h2>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <School className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Class</span>
                  <Badge variant="outline">{profile.class_name}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Roll no.</span>
                  <span className="font-medium text-foreground">{profile.roll_no}</span>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;
