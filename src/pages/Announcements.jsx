import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Megaphone, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const audienceToRecipients = (audience) => {
  const key = (audience || "").toLowerCase();
  const map = { all: ["All"], students: ["Students"], teachers: ["Teachers"], parents: ["Parents"] };
  return map[key] || [audience || "All"];
};

const Announcements = () => {
  const queryClient = useQueryClient();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    recipients: {
      all: false,
      students: false,
      teachers: false,
      parents: false,
    },
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["admin", "announcements"],
    queryFn: async () => {
      const { data } = await api.get("/admin/announcements");
      return (data || []).map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        recipients: audienceToRecipients(a.audience),
        timestamp: new Date(a.created_at).toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));
    },
  });

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecipientChange = (recipient, checked) => {
    if (recipient === "all") {
      setFormData((prev) => ({
        ...prev,
        recipients: {
          all: checked,
          students: false,
          teachers: false,
          parents: false,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        recipients: {
          ...prev.recipients,
          all: false,
          [recipient]: checked,
        },
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.recipients.all && !formData.recipients.students && !formData.recipients.teachers && !formData.recipients.parents) {
      toast.error("Please select at least one recipient group");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const audiences = [];
    if (formData.recipients.all) {
      audiences.push("all");
    } else {
      if (formData.recipients.students) audiences.push("students");
      if (formData.recipients.teachers) audiences.push("teachers");
      if (formData.recipients.parents) audiences.push("parents");
    }

    try {
      for (const audience of audiences) {
        await api.post("/admin/announcements", {
          title: formData.title.trim(),
          description: formData.description.trim(),
          audience,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Announcement sent successfully!");
      setFormData({
        title: "",
        description: "",
        recipients: {
          all: false,
          students: false,
          teachers: false,
          parents: false,
        },
      });
    } catch {
      toast.error("Could not create announcement.");
    }
  };

  const handleCardClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailDialogOpen(true);
  };

  const getRecipientBadgeColor = (recipient) => {
    switch (recipient) {
      case "All":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "Students":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      case "Teachers":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "Parents":
        return "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create and manage announcements for students, teachers, and parents
          </p>
        </div>
      </div>

      {/* Announcement Creation Form */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Create New Announcement
        </h2>
        <div className="space-y-3.5">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="Enter announcement title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Enter announcement description"
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Recipients *</Label>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={formData.recipients.all}
                  onCheckedChange={(checked) => handleRecipientChange("all", checked)}
                />
                <Label htmlFor="all" className="cursor-pointer font-normal text-sm">
                  All
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="students"
                  checked={formData.recipients.students}
                  onCheckedChange={(checked) => handleRecipientChange("students", checked)}
                  disabled={formData.recipients.all}
                />
                <Label htmlFor="students" className={`cursor-pointer font-normal text-sm ${formData.recipients.all ? "text-muted-foreground" : ""}`}>
                  Students
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teachers"
                  checked={formData.recipients.teachers}
                  onCheckedChange={(checked) => handleRecipientChange("teachers", checked)}
                  disabled={formData.recipients.all}
                />
                <Label htmlFor="teachers" className={`cursor-pointer font-normal text-sm ${formData.recipients.all ? "text-muted-foreground" : ""}`}>
                  Teachers
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parents"
                  checked={formData.recipients.parents}
                  onCheckedChange={(checked) => handleRecipientChange("parents", checked)}
                  disabled={formData.recipients.all}
                />
                <Label htmlFor="parents" className={`cursor-pointer font-normal text-sm ${formData.recipients.all ? "text-muted-foreground" : ""}`}>
                  Parents
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Megaphone className="w-4 h-4 mr-2" />
            Submit Announcement
          </Button>
        </div>
      </Card>

      {/* Recent Announcements List */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Recent Announcements</h2>
        {announcements.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No announcements yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary"
                onClick={() => handleCardClick(announcement)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-foreground mb-1">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{announcement.description}</p>
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{announcement.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        {announcement.recipients.map((recipient) => (
                          <Badge key={recipient} variant="secondary" className={`${getRecipientBadgeColor(recipient)} text-xs px-2 py-0`}>
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Announcement Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Announcement Details</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="text-lg font-semibold text-foreground mt-1">{selectedAnnouncement.title}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Full Description</Label>
                <p className="text-foreground mt-2 p-4 bg-muted/50 rounded-lg">{selectedAnnouncement.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Sent To</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAnnouncement.recipients.map((recipient) => (
                      <Badge key={recipient} variant="secondary" className={getRecipientBadgeColor(recipient)}>
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created Time</Label>
                  <p className="text-foreground mt-2">{selectedAnnouncement.timestamp}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;
