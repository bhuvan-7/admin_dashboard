import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, User, FileText } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const Subjects = () => {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addRemoveDialogOpen, setAddRemoveDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    class: "",
    syllabus: "",
    notes: "",
    teacherId: "__none__",
  });
  const [removeSubjectId, setRemoveSubjectId] = useState("");
  const [assignTeacherId, setAssignTeacherId] = useState("__none__");
  const [savingAssign, setSavingAssign] = useState(false);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const { data: teachersList = [] } = useQuery({
    queryKey: ["admin", "teachers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/teachers");
      return Array.isArray(data) ? data : [];
    },
  });

  const {
    data: subjects = [],
    isLoading: subjectsLoading,
    isError: subjectsError,
    error: subjectsErr,
  } = useQuery({
    queryKey: ["admin", "subjects", "page", selectedClass],
    queryFn: async () => {
      const [tRes, sRes] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/admin/subjects", { params: { class_name: selectedClass } }),
      ]);
      const teachers = Array.isArray(tRes.data) ? tRes.data : [];
      const rows = Array.isArray(sRes.data) ? sRes.data : [];
      const map = {};
      for (const t of teachers) map[t.id] = t.full_name;
      return rows.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        class: s.class_name,
        teacher_id: s.teacher_id ?? null,
        teacher: map[s.teacher_id] || null,
        syllabus: s.syllabus || "",
        notes: s.notes || "",
      }));
    },
  });

  const filteredSubjects = subjects.filter((subject) => subject.class === selectedClass);

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
    setDetailDialogOpen(true);
  };

  const handleAddRemoveClick = () => {
    setAddRemoveDialogOpen(true);
    setActionType("add");
    setFormData({
      name: "",
      code: "",
      class: selectedClass,
      syllabus: "",
      notes: "",
      teacherId: "__none__",
    });
  };

  useEffect(() => {
    if (detailDialogOpen && selectedSubject) {
      setAssignTeacherId(selectedSubject.teacher_id != null ? String(selectedSubject.teacher_id) : "__none__");
    }
  }, [detailDialogOpen, selectedSubject]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Subject Name is required");
      return false;
    }
    if (!formData.code.trim()) {
      toast.error("Subject Code is required");
      return false;
    }
    if (!formData.class) {
      toast.error("Class must be selected");
      return false;
    }
    if (formData.syllabus.length < 10) {
      toast.error("Syllabus must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setAddRemoveDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAdd = async () => {
    try {
      await api.post("/admin/subjects", {
        name: formData.name.trim(),
        code: formData.code.trim(),
        class_name: formData.class,
        syllabus: formData.syllabus.trim(),
        notes: formData.notes?.trim() || null,
        teacher_id: formData.teacherId === "__none__" ? null : Number(formData.teacherId),
      });
      setConfirmDialogOpen(false);
      toast.success("Subject added successfully!");
      setFormData({
        name: "",
        code: "",
        class: "",
        syllabus: "",
        notes: "",
        teacherId: "__none__",
      });
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      toast.error("Could not add subject.");
    }
  };

  const handleRemoveClick = () => {
    setActionType("remove");
    setRemoveSubjectId("");
  };

  const handleConfirmRemove = async () => {
    if (!removeSubjectId) {
      toast.error("Please select a subject to remove");
      return;
    }
    try {
      await api.delete(`/admin/subjects/${removeSubjectId}`);
      setAddRemoveDialogOpen(false);
      setConfirmDialogOpen(false);
      toast.success("Subject removed successfully!");
      setRemoveSubjectId("");
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch {
      toast.error("Could not remove subject.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage subjects for each class
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Class Filter Dropdown */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add/Remove Button */}
          <Button onClick={handleAddRemoveClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add / Remove
          </Button>
        </div>
      </div>

      {/* Subject Cards Grid */}
      {subjectsError && (
        <Card className="p-6 text-center border-destructive/50">
          <p className="text-sm text-destructive font-medium">Could not load subjects.</p>
          <p className="text-xs text-muted-foreground mt-2">
            {subjectsErr?.response?.data?.detail || subjectsErr?.message || "Check that the API is running and you are logged in as admin."}
          </p>
        </Card>
      )}
      {!subjectsError && subjectsLoading ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading subjects…</p>
        </Card>
      ) : !subjectsError && filteredSubjects.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No subjects found for Class {selectedClass}</p>
        </Card>
      ) : !subjectsError ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary"
              onClick={() => handleCardClick(subject)}
            >
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
                <Badge variant="secondary" className="text-xs">Class {subject.class}</Badge>
              </div>

              {subject.teacher && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{subject.teacher}</span>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-2">{subject.syllabus}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Subject Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Subject Details</DialogTitle>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Subject Name</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedSubject.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Subject Code</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedSubject.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Class</Label>
                  <p className="text-lg font-semibold text-foreground">Class {selectedSubject.class}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign teacher</Label>
                <Select value={assignTeacherId} onValueChange={setAssignTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {teachersList.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  disabled={savingAssign}
                  onClick={async () => {
                    setSavingAssign(true);
                    try {
                      await api.patch(`/admin/subjects/${selectedSubject.id}`, {
                        teacher_id: assignTeacherId === "__none__" ? null : Number(assignTeacherId),
                      });
                      toast.success("Teacher assignment updated.");
                      await queryClient.invalidateQueries({ queryKey: ["admin"] });
                      const name =
                        assignTeacherId === "__none__"
                          ? null
                          : teachersList.find((x) => String(x.id) === assignTeacherId)?.full_name ?? null;
                      setSelectedSubject({
                        ...selectedSubject,
                        teacher_id: assignTeacherId === "__none__" ? null : Number(assignTeacherId),
                        teacher: name,
                      });
                    } catch {
                      toast.error("Could not update assignment.");
                    } finally {
                      setSavingAssign(false);
                    }
                  }}
                >
                  {savingAssign ? "Saving…" : "Save assignment"}
                </Button>
              </div>

              <div>
                <Label className="text-muted-foreground">Full Syllabus</Label>
                <p className="text-foreground mt-2 p-4 bg-muted/50 rounded-lg">{selectedSubject.syllabus}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Notes / Materials</Label>
                <p className="text-foreground mt-2 p-4 bg-muted/50 rounded-lg">
                  {selectedSubject.notes || "No notes available"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Remove Subject Dialog */}
      <Dialog open={addRemoveDialogOpen} onOpenChange={setAddRemoveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {actionType === "add" ? "Add New Subject" : "Remove Subject"}
            </DialogTitle>
          </DialogHeader>

          {actionType === "add" ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleFormChange("code", e.target.value)}
                    placeholder="e.g. MATH101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class *</Label>
                  <Select value={formData.class} onValueChange={(value) => handleFormChange("class", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          Class {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Teacher (optional)</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => handleFormChange("teacherId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {teachersList.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="syllabus">Syllabus * (min 10 characters)</Label>
                <Textarea
                  id="syllabus"
                  value={formData.syllabus}
                  onChange={(e) => handleFormChange("syllabus", e.target.value)}
                  placeholder="Enter the syllabus details..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes / Materials (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  placeholder="Enter additional notes or materials..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Select Subject to Remove</Label>
              <Select value={removeSubjectId} onValueChange={setRemoveSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} ({subject.code}) - Class {subject.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddRemoveDialogOpen(false)}>
              Cancel
            </Button>
            {actionType === "add" ? (
              <>
                <Button variant="outline" onClick={handleRemoveClick}>
                  Switch to Remove
                </Button>
                <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Subject
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (!removeSubjectId) {
                    toast.error("Please select a subject to remove");
                    return;
                  }
                  setAddRemoveDialogOpen(false);
                  setConfirmDialogOpen(true);
                }}
                variant="destructive"
              >
                Remove Subject
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "add" ? "Confirm Add Subject" : "Confirm Remove Subject"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "add"
                ? `Are you sure you want to add "${formData.name}" (${formData.code}) to Class ${formData.class}?`
                : `Are you sure you want to remove this subject? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "add" ? handleConfirmAdd : handleConfirmRemove}
              className={actionType === "add" ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"}
            >
              {actionType === "add" ? "Add Subject" : "Remove Subject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;
