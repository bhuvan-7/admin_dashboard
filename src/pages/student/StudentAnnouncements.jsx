import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Clock } from "lucide-react";
import api from "@/lib/axios";

const badgeForAudience = (audience) => {
  const a = (audience || "").toLowerCase();
  if (a === "students") return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
  if (a === "all") return "bg-primary/10 text-primary hover:bg-primary/20";
  return "bg-muted text-muted-foreground";
};

const labelAudience = (a) => {
  const x = (a || "").toLowerCase();
  if (x === "all") return "All";
  return x.charAt(0).toUpperCase() + x.slice(1);
};

const StudentAnnouncements = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/student/announcements");
        if (!cancelled) setItems(data || []);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Announcements your admin sends to students.</p>
      </div>

      {items.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">No announcements yet.</Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
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
                    <Badge
                      variant="secondary"
                      className={`${badgeForAudience(a.audience)} text-xs px-2 py-0 whitespace-nowrap`}
                    >
                      {labelAudience(a.audience)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(a.created_at).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
